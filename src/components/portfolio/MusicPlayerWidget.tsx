"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  List,
  Loader2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import sanrio from "@/assets/sanrio.png";
import Forward from "@/assets/Forward.png";
import Previous from "@/assets/Previous.png";
import MusicWallpaper from "@/assets/MusicWallPaper.gif";
import SliderIcon from "@/assets/SliderIcon.png";
import MusicPlayerImage from "@/assets/MusicPlayerImage.png";
import PlaylistIcon from "@/assets/PlaylistIcon.png";
import CinamonExit from "@/assets/CinamonExit.png";
import { AudioContext } from "./audio-context";
import { useAppSound } from "./sound-context";
import { playlist, Track } from "@/lib/types";

interface MusicPlayerProps {
  isDesktop?: boolean;
  embedded?: boolean;
  spotifyPlaylistUrl?: string;
}

export default function MusicPlayerWidget({
  isDesktop = false,
  embedded = false,
  spotifyPlaylistUrl,
}: MusicPlayerProps) {
  const {
    audioRef,
    currentTrack,
    isPlaying,
    progress,
    volume,
    isLoading,
    setCurrentTrack,
    setIsPlaying,
    setProgress,
    setVolume,
    setIsLoading,
  } = useContext(AudioContext);

  const { playClickSound, playMenuSound, playPowerUpSound } = useAppSound();

  // Resolve track source (string | next-video Asset) to URL string
  const resolveTrackSrc = (src: Track["src"]): string => {
    if (typeof src === "string") return src;
    return src?.sources?.[0]?.src ?? "";
  };

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const spotifyEmbedUrl = (() => {
    if (!spotifyPlaylistUrl) return "";
    try {
      return spotifyPlaylistUrl.replace(
        "open.spotify.com/playlist",
        "open.spotify.com/embed/playlist"
      );
    } catch {
      return "";
    }
  })();

  // Spotify Web Playback SDK integration (Premium required)
  const useSpotify = !!spotifyPlaylistUrl;
  const spotifyPlayerRef = useRef<any>(null);
  const spotifyAccessTokenRef = useRef<string>("");
  const spotifyDeviceIdRef = useRef<string>("");
  const [spotifyReady, setSpotifyReady] = useState(false);
  const [spotifyFailed, setSpotifyFailed] = useState(false);
  const [spIsPlaying, setSpIsPlaying] = useState(false);
  const [spPositionMs, setSpPositionMs] = useState(0);
  const [spDurationMs, setSpDurationMs] = useState(0);
  const [spotifyCurrentTrack, setSpotifyCurrentTrack] = useState<any>(null);
  const [spotifyPlaylistTracks, setSpotifyPlaylistTracks] = useState<any[]>([]);

  const parsePlaylistId = (url?: string) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      const parts = u.pathname.split("/");
      const idx = parts.findIndex((p) => p === "playlist");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      return "";
    } catch {
      return "";
    }
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const fetchSpotifyCurrentTrack = async () => {
    if (!spotifyAccessTokenRef.current) return;
    try {
      const res = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: { Authorization: `Bearer ${spotifyAccessTokenRef.current}` },
        }
      );
      console.log("Current track API response status:", res.status);
      if (res.status === 204) {
        console.log("No track currently playing");
        return;
      }
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.item) {
            setSpotifyCurrentTrack(data.item);
            console.log("Fetched current Spotify track:", data.item.name);
          } else {
            console.log("No item in current track response");
          }
        } else {
          console.error("Unexpected content type:", contentType);
        }
      } else {
        const errorText = res.status === 204 ? "No Content" : await res.text();
        console.error("Current track API error:", res.status, errorText);
      }
    } catch (e) {
      console.error("Failed to fetch current track:", e);
    }
  };

  const fetchSpotifyPlaylistTracks = async () => {
    if (!spotifyAccessTokenRef.current || !spotifyPlaylistUrl) return;
    const playlistId = parsePlaylistId(spotifyPlaylistUrl);
    if (!playlistId) return;

    try {
      const res = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
        {
          headers: { Authorization: `Bearer ${spotifyAccessTokenRef.current}` },
        }
      );
      console.log("Playlist tracks API response status:", res.status);
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setSpotifyPlaylistTracks(data.items.map((item: any) => item.track));
          console.log("Fetched Spotify playlist tracks:", data.items.length);
        } else {
          console.error("Unexpected content type for playlist:", contentType);
        }
      } else {
        const errorText = res.status === 204 ? "No Content" : await res.text();
        console.error("Playlist tracks API error:", res.status, errorText);
      }
    } catch (e) {
      console.error("Failed to fetch playlist tracks:", e);
    }
  };

  useEffect(() => {
    if (!useSpotify) return;

    let cancelled = false;
    const init = async () => {
      try {
        // Get access token
        const res = await fetch("/api/auth/spotify/token");
        console.log("Token API response status:", res.status);
        if (!res.ok) {
          console.error(
            "Failed to get Spotify token:",
            res.status,
            await res.text()
          );
          setSpotifyFailed(true);
          return;
        }
        const tokenData = await res.json();
        console.log("Token API response data:", tokenData);
        const { accessToken } = tokenData;
        if (cancelled) return;
        if (!accessToken) {
          console.error("No access token received from Spotify");
          setSpotifyFailed(true);
          return;
        }
        console.log(
          "Spotify token obtained successfully:",
          typeof accessToken,
          accessToken.substring(0, 10) + "..."
        );
        spotifyAccessTokenRef.current = accessToken;

        console.log("Setting up Spotify Web Playback SDK ready callback");
        (window as any).onSpotifyWebPlaybackSDKReady = () => {
          console.log("Spotify Web Playback SDK ready callback fired");
          if (cancelled) return;
          const player = new (window as any).Spotify.Player({
            name: "PortaGen Player",
            getOAuthToken: function (cb) {
              console.log(
                "getOAuthToken called, cb type:",
                typeof cb,
                "token available:",
                !!accessToken
              );
              if (typeof cb === "function") {
                cb(accessToken);
              } else {
                console.error("getOAuthToken called with non-function cb:", cb);
              }
            },
            volume: 0.5,
          });

          // Add comprehensive event listeners for debugging
          player.addListener("initialization_error", (error: any) => {
            console.error("Spotify initialization_error:", error);
            setSpotifyFailed(true);
          });

          player.addListener("authentication_error", (error: any) => {
            console.error("Spotify authentication_error:", error);
            setSpotifyFailed(true);
          });

          player.addListener("account_error", (error: any) => {
            console.error("Spotify account_error:", error);
            setSpotifyFailed(true);
          });

          player.addListener("ready", async ({ device_id }: any) => {
            if (cancelled) return;
            console.log("Spotify player ready! Device ID:", device_id);
            spotifyDeviceIdRef.current = device_id;
            setSpotifyReady(true);
            setSpotifyFailed(false);

            // Fetch playlist tracks
            await fetchSpotifyPlaylistTracks();

            const playlistId = parsePlaylistId(spotifyPlaylistUrl);
            if (!playlistId) {
              console.warn("No playlist ID found in URL:", spotifyPlaylistUrl);
              return;
            }
            console.log("Starting Spotify playlist:", playlistId);
            try {
              // Transfer playback to SDK device and start playlist
              await fetch("https://api.spotify.com/v1/me/player", {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${spotifyAccessTokenRef.current}`,
                },
                body: JSON.stringify({ device_ids: [device_id], play: true }),
              });
              await fetch(
                `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
                {
                  method: "PUT",
                  headers: {
                    Authorization: `Bearer ${spotifyAccessTokenRef.current}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    context_uri: `spotify:playlist:${playlistId}`,
                  }),
                }
              );
            } catch (e) {
              console.error("Failed to start playlist:", e);
              setSpotifyFailed(true);
            }
          });

          player.addListener("player_state_changed", async (state: any) => {
            if (!state) return;
            console.log("Spotify player_state_changed:", {
              paused: state.paused,
              position: state.position,
              duration: state.duration,
            });
            setSpIsPlaying(!state.paused);
            setSpPositionMs(state.position || 0);
            setSpDurationMs(state.duration || 0);
            const pct = state.duration
              ? (state.position / state.duration) * 100
              : 0;
            setProgress(isNaN(pct) ? 0 : pct);
            setIsPlaying(!state.paused);

            // Fetch current track info when track changes
            if (
              state.track_window?.current_track?.id !== spotifyCurrentTrack?.id
            ) {
              await fetchSpotifyCurrentTrack();
            }
          });

          player.addListener("not_ready", ({ device_id }: any) => {
            console.log("Spotify player not_ready, device_id:", device_id);
            setSpotifyReady(false);
            setSpotifyFailed(true);
          });

          console.log("Connecting Spotify player...");
          player
            .connect()
            .then((success: boolean) => {
              console.log("Spotify player connect result:", success);
              if (!success) {
                setSpotifyFailed(true);
              }
            })
            .catch((error: any) => {
              console.error("Spotify player connect error:", error);
              setSpotifyFailed(true);
            });
          spotifyPlayerRef.current = player;
        };

        // Load SDK if not present
        if (!(window as any).Spotify) {
          console.log("Loading Spotify Web Playback SDK script...");
          console.log("Creating Spotify SDK script element");
          await new Promise<void>((resolve) => {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            script.onload = () => {
              console.log(
                "Spotify SDK script loaded successfully, Spotify available:",
                !!(window as any).Spotify
              );
              resolve();
            };
            script.onerror = (e) => {
              console.error("Failed to load Spotify SDK script", e);
              setSpotifyFailed(true);
            };
            document.body.appendChild(script);
          });
        } else if (
          typeof (window as any).onSpotifyWebPlaybackSDKReady === "function"
        ) {
          console
            .log("Spotify SDK already loaded, calling ready callback")(
              window as any
            )
            .onSpotifyWebPlaybackSDKReady();
        }
      } catch (e) {
        console.error("Spotify initialization error:", e);
        setSpotifyFailed(true);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [useSpotify, spotifyPlaylistUrl]);

  const playerRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);
  const albumCoverRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);
  const rotationTweenRef = useRef<gsap.core.Tween | null>(null);

  // Handle album cover rotation
  const handleAlbumRotation = useCallback(() => {
    if (!albumCoverRef.current) return;

    // Kill existing rotation if playing state changes
    if (rotationTweenRef.current) {
      rotationTweenRef.current.kill();
    }

    if (isPlaying && !isLoading) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (!prefersReducedMotion) {
        rotationTweenRef.current = gsap.to(albumCoverRef.current, {
          rotation: 360,
          duration: 3,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });
      }
    } else {
      // Stop rotation and reset to 0 degrees
      gsap.set(albumCoverRef.current, { rotation: 0 });
    }
  }, [isPlaying, isLoading]);

  // Update rotation whenever playing state changes
  useEffect(() => {
    handleAlbumRotation();
  }, [handleAlbumRotation]);

  // Button animations
  const handleButtonHover = (index: number) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const button = buttonsRef.current[index];
    if (button) {
      gsap.killTweensOf(button, "scale");
      gsap.to(button, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleButtonLeave = (index: number) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const button = buttonsRef.current[index];
    if (button) {
      gsap.killTweensOf(button, "scale");
      gsap.to(button, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleButtonClick = (index: number) => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const button = buttonsRef.current[index];
    if (button) {
      gsap.killTweensOf(button, "scale");
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  // GSAP animations
  useGSAP(() => {
    // Initial animations
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Player entrance
    if (playerRef.current) {
      gsap.fromTo(
        playerRef.current,
        { opacity: 0, scale: prefersReducedMotion ? 1 : 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        }
      );
    }

    // Button entrances
    buttonsRef.current.forEach((button, index) => {
      if (button) {
        gsap.fromTo(
          button,
          { opacity: 0, scale: prefersReducedMotion ? 1 : 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            delay: 0.1 + index * 0.05,
            ease: "back.out(1.7)",
          }
        );
      }
    });

    // Handle album rotation
    handleAlbumRotation();

    // Cleanup
    return () => {
      // Don't kill all tweens - just specific ones if needed
    };
  }, []);

  // Playlist animation
  useEffect(() => {
    if (!playlistRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (showPlaylist) {
      gsap.fromTo(
        playlistRef.current,
        { x: 320, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(1.7)",
        }
      );
    } else {
      gsap.to(playlistRef.current, {
        x: 320,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
      });
    }
  }, [showPlaylist]);

  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current) return;

      try {
        setIsLoading(true);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = resolveTrackSrc(currentTrack.src);

        await audioRef.current.load();

        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Autoplay failed:", error);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    };

    playAudio();
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = async () => {
    if (useSpotify && spotifyPlayerRef.current) {
      try {
        await spotifyPlayerRef.current.togglePlay();
      } catch {}
      return;
    }
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        playClickSound();
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        playPowerUpSound();
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  const changeTrack = (track: Track) => {
    setCurrentTrack(track);
    setProgress(0);
    playMenuSound();
  };

  const handleNext = () => {
    if (useSpotify && spotifyPlayerRef.current) {
      spotifyPlayerRef.current.nextTrack();
      return;
    }
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % playlist.length;
    changeTrack(playlist[nextIndex]);
  };

  const handlePrevious = () => {
    if (useSpotify && spotifyPlayerRef.current) {
      spotifyPlayerRef.current.previousTrack();
      return;
    }
    const currentIndex = playlist.findIndex(
      (track) => track.id === currentTrack.id
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    changeTrack(playlist[prevIndex]);
  };

  const formatTime = (progress: number) => {
    if (useSpotify) {
      const totalSeconds = Math.floor(
        ((spDurationMs || 0) * progress) / 100 / 1000
      );
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    if (!audioRef.current || isNaN(audioRef.current.duration)) return "0:00";
    const totalSeconds = Math.floor(
      (audioRef.current.duration * progress) / 100
    );
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = async (value: number[]) => {
    const pct = value[0];
    if (useSpotify && spotifyPlayerRef.current) {
      try {
        const targetMs = Math.floor(((spDurationMs || 0) * pct) / 100);
        if (typeof spotifyPlayerRef.current.seek === "function") {
          await spotifyPlayerRef.current.seek(targetMs);
        } else if (spotifyDeviceIdRef.current) {
          await fetch(
            `https://api.spotify.com/v1/me/player/seek?position_ms=${targetMs}&device_id=${spotifyDeviceIdRef.current}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${spotifyAccessTokenRef.current}`,
              },
            }
          );
        }
        setProgress(pct);
      } catch {}
      playClickSound();
      return;
    }
    if (!audioRef.current) return;
    audioRef.current.currentTime = (audioRef.current.duration * pct) / 100;
    setProgress(pct);
    playClickSound();
  };

  const handleDesktopClose = () => {
    setIsExpanded(false);
    setShowPlaylist(false);
    playClickSound();
  };

  const handleExpandClick = () => {
    setIsExpanded(true);
    playMenuSound();
  };

  const handlePlaylistToggle = () => {
    setShowPlaylist(!showPlaylist);
    playMenuSound();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      handleNext();
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);



  if (isDesktop && !isExpanded) {
    return (
      <div
        ref={playerRef}
        className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 ${
          embedded ? "z-10" : "z-50"
        }`}
      >
        <button
          ref={(el) => {
            if (el) buttonsRef.current[0] = el;
          }}
          className="w-20 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
          onClick={() => {
            handleExpandClick();
            handleButtonClick(0);
          }}
          onMouseEnter={() => handleButtonHover(0)}
          onMouseLeave={() => handleButtonLeave(0)}
          disabled={isLoading}
        >
          <Image src={MusicPlayerImage} alt="Music Player" />
          <div
            ref={albumCoverRef}
            className="absolute top-[60.5%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full overflow-hidden border-2 border-white/30"
          >
            <Image
              src={
                (useSpotify && spotifyCurrentTrack?.album?.images?.[0]?.url) ||
                currentTrack.cover ||
                "/placeholder.svg"
              }
              alt={
                (useSpotify && spotifyCurrentTrack?.name) || currentTrack.title
              }
              className="w-full h-full object-cover"
              fill
              sizes="56px"
            />
          </div>
        </button>
      </div>
    );
  }

  // Desktop expanded panel - Spotify embed fallback when SDK fails
  if (
    isDesktop &&
    isExpanded &&
    spotifyEmbedUrl &&
    useSpotify &&
    spotifyFailed
  ) {
    return (
      <div
        ref={playerRef}
        className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 ${
          embedded ? "z-10" : "z-50"
        } backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-cover bg-center`}
        style={{
          width: "380px",
          height: "300px",
          backgroundImage: `url(${MusicWallpaper})`,
        }}
      >
        <div className="flex h-full w-full">
          <div className="flex-1 p-4">
            <iframe
              src={spotifyEmbedUrl}
              width="100%"
              height="100%"
              frameBorder={0}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop expanded panel
  if (isDesktop && isExpanded) {
    return (
      <div
        ref={playerRef}
        className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 ${
          embedded ? "z-10" : "z-50"
        } backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-cover bg-center transition-all duration-300`}
        style={{
          width: "380px",
          height: "300px",
          backgroundImage: `url(${MusicWallpaper.src})`,
        }}
      >
        <div className="relative flex h-full w-full overflow-hidden">
          {/* Main Player */}
          <div
            className={`p-6 flex flex-col transition-all duration-300 ${
              showPlaylist ? "w-full" : "flex-1"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Now Playing
              </h3>
              <div className="flex gap-2">
                <button
                  ref={(el) => {
                    if (el) buttonsRef.current[1] = el;
                  }}
                  className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => {
                    handlePlaylistToggle();
                    handleButtonClick(1);
                  }}
                  onMouseEnter={() => handleButtonHover(1)}
                  onMouseLeave={() => handleButtonLeave(1)}
                >
                  <Image src={PlaylistIcon} alt="Playlist Icon" />
                  <div className="absolute top-[21%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <List className="h-4 w-4" />
                  </div>
                </button>
                <button
                  ref={(el) => {
                    if (el) buttonsRef.current[2] = el;
                  }}
                  className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => {
                    handleDesktopClose();
                    handleButtonClick(2);
                  }}
                  onMouseEnter={() => handleButtonHover(2)}
                  onMouseLeave={() => handleButtonLeave(2)}
                >
                  <Image src={CinamonExit} alt="Cinamon Exit" />
                  <div className="absolute top-[55%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <X className="h-4 w-4" />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div
                ref={albumCoverRef}
                className="w-20 h-20 rounded-xl overflow-hidden shadow-lg relative flex-shrink-0"
              >
                <Image
                  src={
                    (useSpotify &&
                      spotifyCurrentTrack?.album?.images?.[0]?.url) ||
                    currentTrack.cover ||
                    "/placeholder.svg"
                  }
                  alt={
                    (useSpotify && spotifyCurrentTrack?.name) ||
                    currentTrack.title
                  }
                  className="w-full h-full object-cover"
                  fill
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className="font-bold text-gray-800 dark:text-white text-base leading-tight"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {(useSpotify && spotifyCurrentTrack?.name) ||
                    currentTrack.title}
                </h4>
                <p
                  className="text-sm text-gray-600 dark:text-gray-300 leading-tight"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {(useSpotify &&
                    spotifyCurrentTrack?.artists
                      ?.map((a) => a.name)
                      .join(", ")) ||
                    currentTrack.artist}
                </p>
                <div className="mt-2">
                  <Slider
                    value={[progress]}
                    max={100}
                    step={0.1}
                    className="cursor-pointer w-full"
                    onValueChange={handleSeek}
                    disabled={isLoading}
                    trackClassName="bg-[#ccf2fc]"
                    rangeClassName="bg-[#74defc]"
                    thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                    thumb={
                      <Image
                        src={SliderIcon}
                        className="w-full h-full object-cover rounded-full"
                        alt={"sliderIcon"}
                        width={32}
                        height={32}
                      />
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{formatTime(progress)}</span>
                    <span>
                      {useSpotify
                        ? new Date(spDurationMs).toISOString().substr(14, 5)
                        : currentTrack.duration}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                ref={(el) => {
                  if (el) buttonsRef.current[3] = el;
                }}
                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                  handlePrevious();
                  playClickSound();
                  handleButtonClick(3);
                }}
                onMouseEnter={() => handleButtonHover(3)}
                onMouseLeave={() => handleButtonLeave(3)}
                disabled={isLoading}
              >
                <Image src={Previous} alt="previous" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  <SkipBack className="h-4 w-4" />
                </div>
              </button>

              <button
                ref={(el) => {
                  if (el) buttonsRef.current[4] = el;
                }}
                className="w-18 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                  handlePlayPause();
                  handleButtonClick(4);
                }}
                onMouseEnter={() => handleButtonHover(4)}
                onMouseLeave={() => handleButtonLeave(4)}
                disabled={isLoading}
              >
                <Image src={sanrio} alt="sanrio" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </div>
              </button>

              <button
                ref={(el) => {
                  if (el) buttonsRef.current[5] = el;
                }}
                className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                  handleNext();
                  playClickSound();
                  handleButtonClick(5);
                }}
                onMouseEnter={() => handleButtonHover(5)}
                onMouseLeave={() => handleButtonLeave(5)}
                disabled={isLoading}
              >
                <Image src={Forward} alt="forward" />
                <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  <SkipForward className="h-4 w-4" />
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                className="cursor-pointer w-full flex-1"
                onValueChange={(value) => {
                  const v = value[0];
                  setVolume(v);
                  if (useSpotify && spotifyPlayerRef.current) {
                    const vol = Math.min(1, Math.max(0, v / 100));
                    spotifyPlayerRef.current.setVolume(vol);
                  }
                  playClickSound();
                }}
                disabled={isLoading}
                trackClassName="bg-[#ccf2fc]"
                rangeClassName="bg-[#74defc]"
                thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                thumb={
                  <Image
                    src={SliderIcon}
                    className="w-full h-full object-cover rounded-full"
                    alt={"sliderIcon"}
                    width={32}
                    height={32}
                  />
                }
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                {volume}
              </span>
            </div>
          </div>

          {/* Playlist Panel */}
          {showPlaylist && (
            <div
              ref={playlistRef}
              className="absolute top-0 right-0 w-80 h-full bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-gray-800 dark:text-white shrink-0">
                  Playlist
                </h4>
                <button
                  ref={(el) => {
                    if (el) buttonsRef.current[1] = el;
                  }}
                  className="w-12 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => {
                    handlePlaylistToggle();
                    handleButtonClick(1);
                  }}
                  onMouseEnter={() => handleButtonHover(1)}
                  onMouseLeave={() => handleButtonLeave(1)}
                >
                  <Image src={PlaylistIcon} alt="Playlist Icon" />
                  <div className="absolute top-[21%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <List className="h-4 w-4" />
                  </div>
                </button>
              </div>
              <div className="space-y-2 overflow-y-auto px-2 py-2 flex-1 min-h-0">
                {(useSpotify ? spotifyPlaylistTracks : playlist).map(
                  (track) => (
                    <div
                      key={track.id}
                      className={cn(
                        "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                        (useSpotify
                          ? spotifyCurrentTrack?.id
                          : currentTrack.id) === track.id
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                      onClick={() => (useSpotify ? null : changeTrack(track))}
                      onMouseEnter={(e) => {
                        const prefersReducedMotion = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        if (!prefersReducedMotion) {
                          gsap.to(e.currentTarget, {
                            scale: 1.02,
                            duration: 0.1,
                          });
                        }
                      }}
                      onMouseLeave={(e) => {
                        const prefersReducedMotion = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        if (!prefersReducedMotion) {
                          gsap.to(e.currentTarget, { scale: 1, duration: 0.1 });
                        }
                      }}
                      onMouseDown={(e) => {
                        const prefersReducedMotion = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        if (!prefersReducedMotion) {
                          gsap.to(e.currentTarget, {
                            scale: 0.98,
                            duration: 0.1,
                          });
                        }
                      }}
                      onMouseUp={(e) => {
                        const prefersReducedMotion = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        if (!prefersReducedMotion) {
                          gsap.to(e.currentTarget, {
                            scale: 1.02,
                            duration: 0.1,
                          });
                        }
                      }}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                        <Image
                          src={
                            (useSpotify
                              ? track.album?.images?.[0]?.url
                              : track.cover) || "/placeholder.svg"
                          }
                          alt={useSpotify ? track.name : track.title}
                          className="object-cover"
                          fill
                          sizes="40px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p
                          className="font-medium text-sm text-gray-800 dark:text-white leading-tight"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {useSpotify ? track.name : track.title}
                        </p>
                        <p
                          className="text-xs text-gray-600 dark:text-gray-300 leading-tight"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {useSpotify
                            ? track.artists?.map((a: any) => a.name).join(", ")
                            : track.artist}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                        {useSpotify
                          ? formatDuration(track.duration_ms)
                          : track.duration}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mobile/Widget version with horizontal scrolling playlist
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        ref={playerRef}
        className="w-full h-[170px] rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-cover bg-center"
        style={{ backgroundImage: `url(${MusicWallpaper})` }}
      >
        {!showPlaylist ? (
          <div className="p-4 gap-4 flex flex-row items-center h-full">
            <div
              ref={albumCoverRef}
              className={cn(
                "w-32 h-32 rounded-2xl overflow-hidden shadow-md transform transition-transform flex-shrink-0",
                isLoading ? "opacity-80" : "opacity-100"
              )}
            >
              <Image
                src={
                  (useSpotify &&
                    spotifyCurrentTrack?.album?.images?.[0]?.url) ||
                  currentTrack.cover ||
                  "/placeholder.svg"
                }
                alt={`${
                  (useSpotify && spotifyCurrentTrack?.name) ||
                  currentTrack.title
                } album cover`}
                className="object-cover"
                fill
                sizes="128px"
              />
            </div>

            <div className="flex flex-col flex-1 gap-3 h-full justify-between min-w-0">
              <div className="w-full flex flex-col items-start min-w-0">
                <h2
                  className="text-xl font-bold text-gray-800 dark:text-white w-full leading-tight"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {(useSpotify && spotifyCurrentTrack?.name) ||
                    currentTrack.title}
                </h2>
                <p
                  className="text-sm text-gray-600 dark:text-gray-300 w-full leading-tight"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {(useSpotify &&
                    spotifyCurrentTrack?.artists
                      ?.map((a: any) => a.name)
                      .join(", ")) ||
                    currentTrack.artist}
                </p>
              </div>

              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <button
                    ref={(el) => {
                      if (el) buttonsRef.current[6] = el;
                    }}
                    className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                    onClick={() => {
                      handlePrevious();
                      playClickSound();
                      handleButtonClick(6);
                    }}
                    onMouseEnter={() => handleButtonHover(6)}
                    onMouseLeave={() => handleButtonLeave(6)}
                    disabled={isLoading}
                  >
                    <Image src={Previous} alt="previous" />
                    <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                      <SkipBack className="h-3 w-3" />
                    </div>
                  </button>

                  <button
                    ref={(el) => {
                      if (el) buttonsRef.current[7] = el;
                    }}
                    className="w-16 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                    onClick={() => {
                      handlePlayPause();
                      handleButtonClick(7);
                    }}
                    onMouseEnter={() => handleButtonHover(7)}
                    onMouseLeave={() => handleButtonLeave(7)}
                    disabled={isLoading}
                  >
                    <Image src={sanrio} alt="sanrio" />
                    <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </div>
                  </button>

                  <button
                    ref={(el) => {
                      if (el) buttonsRef.current[8] = el;
                    }}
                    className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                    onClick={() => {
                      handleNext();
                      playClickSound();
                      handleButtonClick(8);
                    }}
                    onMouseEnter={() => handleButtonHover(8)}
                    onMouseLeave={() => handleButtonLeave(8)}
                    disabled={isLoading}
                  >
                    <Image src={Forward} alt="forward" />
                    <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                      <SkipForward className="h-3 w-3" />
                    </div>
                  </button>
                </div>
                <button
                  ref={(el) => {
                    if (el) buttonsRef.current[9] = el;
                  }}
                  className="w-10 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={() => {
                    handlePlaylistToggle();
                    handleButtonClick(9);
                  }}
                  onMouseEnter={() => handleButtonHover(9)}
                  onMouseLeave={() => handleButtonLeave(9)}
                  disabled={isLoading}
                >
                  <Image src={PlaylistIcon} alt="Playlist Icon" />
                  <div className="absolute top-[20%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                    <List className="h-3 w-3" />
                  </div>
                </button>
              </div>

              <div className="w-full">
                <Slider
                  value={[progress]}
                  max={100}
                  step={0.1}
                  className="cursor-pointer w-full"
                  onValueChange={handleSeek}
                  disabled={isLoading}
                  trackClassName="bg-[#ccf2fc]"
                  rangeClassName="bg-[#74defc]"
                  thumbClassName="h-8 w-8 flex items-center justify-center rounded-full"
                  thumb={
                    <Image
                      src={SliderIcon}
                      className="w-full h-full object-cover rounded-full"
                      alt={"sliderIcon"}
                      width={32}
                      height={32}
                    />
                  }
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(progress)}</span>
                  <span>{currentTrack.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Playlist
              </h3>
              <button
                ref={(el) => {
                  if (el) buttonsRef.current[10] = el;
                }}
                className="w-8 relative text-center cursor-pointer p-0 hover:bg-transparent dark:hover:bg-transparent"
                onClick={() => {
                  setShowPlaylist(false);
                  playClickSound();
                  handleButtonClick(10);
                }}
                onMouseEnter={() => handleButtonHover(10)}
                onMouseLeave={() => handleButtonLeave(10)}
              >
                <Image src={CinamonExit} alt="Cinamon Exit" />
                <div className="absolute top-[55%] left-[46%] transform -translate-x-1/2 -translate-y-1/2 text-[#74cef7]">
                  <X className="h-3 w-3" />
                </div>
              </button>
            </div>

            {/* Horizontal scrolling playlist */}
            <div className="flex-1 overflow-hidden">
              <div
                className="flex gap-3 overflow-x-auto p-2 py-2 h-full"
                style={{ scrollbarWidth: "thin" }}
              >
                {(useSpotify ? spotifyPlaylistTracks : playlist).map(
                  (track) => (
                    <div
                      key={track.id}
                      className={cn(
                        "flex flex-row gap-2 z-99 items-center bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-2 cursor-pointer transition-all duration-200 border",
                        (useSpotify
                          ? spotifyCurrentTrack?.id
                          : currentTrack.id) === track.id
                          ? "border-blue-400 bg-blue-100/30 dark:bg-blue-900/30"
                          : "border-white/20 hover:bg-white/30 dark:hover:bg-gray-700/50"
                      )}
                      onClick={() => {
                        if (!useSpotify) {
                          changeTrack(track);
                          setShowPlaylist(false);
                        }
                      }}
                      onMouseEnter={(e) => {
                        const prefersReducedMotion = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        if (!prefersReducedMotion) {
                          gsap.to(e.currentTarget, {
                            scale: 1.05,
                            y: -2,
                            duration: 0.1,
                          });
                        }
                      }}
                      onMouseLeave={(e) => {
                        const prefersReducedMotion = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        if (!prefersReducedMotion) {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            y: 0,
                            duration: 0.1,
                          });
                        }
                      }}
                      onMouseDown={(e) => {
                        const prefersReducedMotion = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        if (!prefersReducedMotion) {
                          gsap.to(e.currentTarget, {
                            scale: 0.95,
                            duration: 0.1,
                          });
                        }
                      }}
                      onMouseUp={(e) => {
                        const prefersReducedMotion = window.matchMedia(
                          "(prefers-reduced-motion: reduce)"
                        ).matches;
                        if (!prefersReducedMotion) {
                          gsap.to(e.currentTarget, {
                            scale: 1.05,
                            duration: 0.1,
                          });
                        }
                      }}
                    >
                      <div className="w-12 h-12 aspect-square rounded-lg overflow-hidden relative">
                        <Image
                          src={
                            (useSpotify
                              ? track.album?.images?.[0]?.url
                              : track.cover) || "/placeholder.svg"
                          }
                          alt={useSpotify ? track.name : track.title}
                          className="object-cover"
                          fill
                          sizes="48px"
                        />
                      </div>
                      <div className="text-center min-w-0 flex-1 overflow-hidden">
                        <p
                          className="font-medium text-sm text-gray-800 dark:text-white leading-tight"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {useSpotify ? track.name : track.title}
                        </p>
                        <p
                          className="text-xs text-gray-600 dark:text-gray-300 leading-tight"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {useSpotify
                            ? track.artists?.map((a: any) => a.name).join(", ")
                            : track.artist}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-tight">
                          {useSpotify
                            ? formatDuration(track.duration_ms)
                            : track.duration}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
