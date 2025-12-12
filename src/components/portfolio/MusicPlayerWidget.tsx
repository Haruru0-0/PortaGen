"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MusicWallpaper from "@/assets/MusicWallPaper.gif";
import { AudioContext } from "../../contexts/audio-context";
import { useAppSound } from "../../contexts/sound-context";
import { playlist, Track } from "@/lib/types";
import { CollapsedPlayer } from "./music-player/CollapsedPlayer";
import { ExpandedPlayer } from "./music-player/ExpandedPlayer";
import { MobilePlayer } from "./music-player/MobilePlayer";

// Type definition for Spotify Web Playback SDK Player
interface SpotifyPlayer {
  togglePlay: () => Promise<void>;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (positionMs: number) => Promise<void>;
  connect: () => Promise<boolean>;
  addListener: (event: string, callback: (state: unknown) => void) => void;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume: number;
}

// Type for Spotify track information
interface SpotifyTrack {
  id: string;
  name: string;
  album?: {
    images?: { url: string }[];
  };
  artists?: {
    name: string;
  }[];
  duration_ms?: number;
}

// Type for Spotify error
interface SpotifyError {
  message: string;
}

// Type for Spotify player state
interface SpotifyPlayerState {
  paused: boolean;
  position: number;
  duration: number;
  track_window?: {
    current_track?: {
      id: string;
    };
  };
}

// Type for Spotify device ready event
interface SpotifyDeviceReady {
  device_id: string;
}

// Type for Spotify not ready event
interface SpotifyDeviceNotReady {
  device_id: string;
}

// Extend Window interface for Spotify SDK
interface Window {
  Spotify?: {
    Player: new (config: SpotifyPlayerConfig) => SpotifyPlayer;
  };
  onSpotifyWebPlaybackSDKReady?: () => void;
}

interface SpotifyPlayerConfig {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume: number;
}

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
  const spotifyPlayerRef = useRef<SpotifyPlayer | null>(null);
  const spotifyAccessTokenRef = useRef<string>("");
  const spotifyDeviceIdRef = useRef<string>("");
  const [spotifyReady, setSpotifyReady] = useState(false);
  const [spotifyFailed, setSpotifyFailed] = useState(false);
  const [spIsPlaying, setSpIsPlaying] = useState(false);
  const [spPositionMs, setSpPositionMs] = useState(0);
  const [spDurationMs, setSpDurationMs] = useState(0);
  const [spotifyCurrentTrack, setSpotifyCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [spotifyPlaylistTracks, setSpotifyPlaylistTracks] = useState<SpotifyTrack[]>([]);

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
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setSpotifyPlaylistTracks(data.items.map((item: { track: SpotifyTrack }) => item.track));
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
        if (!res.ok) {
          setSpotifyFailed(true);
          return;
        }
        const tokenData = await res.json();
        const { accessToken } = tokenData;
        if (cancelled) return;
        if (!accessToken) {
          setSpotifyFailed(true);
          return;
        }
        spotifyAccessTokenRef.current = accessToken;

        (window as Window & { onSpotifyWebPlaybackSDKReady?: () => void }).onSpotifyWebPlaybackSDKReady = () => {
          if (cancelled) return;
          const player = new (window as Window & { Spotify?: { Player: new (config: SpotifyPlayerConfig) => SpotifyPlayer } }).Spotify!.Player({
            name: "PortaGen Player",
            getOAuthToken: function (cb: (token: string) => void) {
              if (typeof cb === "function") {
                cb(accessToken);
              } else {
                console.error("getOAuthToken called with non-function cb:", cb);
              }
            },
            volume: 0.5,
          });

          // Add comprehensive event listeners for debugging
          player.addListener("initialization_error", (error: unknown) => {
            console.error("Spotify initialization_error:", error);
            setSpotifyFailed(true);
          });

          player.addListener("authentication_error", (error: unknown) => {
            console.error("Spotify authentication_error:", error);
            setSpotifyFailed(true);
          });

          player.addListener("account_error", (error: unknown) => {
            console.error("Spotify account_error:", error);
            setSpotifyFailed(true);
          });

          player.addListener("ready", async (state: unknown) => {
            const { device_id } = state as SpotifyDeviceReady;
            if (cancelled) return;
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

          player.addListener("player_state_changed", async (state: unknown) => {
            if (!state) return;
            const playerState = state as SpotifyPlayerState;
            setSpIsPlaying(!playerState.paused);
            setSpPositionMs(playerState.position || 0);
            setSpDurationMs(playerState.duration || 0);
            const pct = playerState.duration
              ? (playerState.position / playerState.duration) * 100
              : 0;
            setProgress(isNaN(pct) ? 0 : pct);
            setIsPlaying(!playerState.paused);

            // Fetch current track info when track changes
            if (
              playerState.track_window?.current_track?.id !== spotifyCurrentTrack?.id
            ) {
              await fetchSpotifyCurrentTrack();
            }
          });

          player.addListener("not_ready", (state: unknown) => {
            const { device_id } = state as SpotifyDeviceNotReady;
            console.log("Spotify player not_ready, device_id:", device_id);
            setSpotifyReady(false);
            setSpotifyFailed(true);
          });

          player
            .connect()
            .then((success: boolean) => {
              if (!success) {
                setSpotifyFailed(true);
              }
            })
            .catch((error: unknown) => {
              console.error("Spotify player connect error:", error);
              setSpotifyFailed(true);
            });
          spotifyPlayerRef.current = player;
        };

        // Load SDK if not present
        if (!(window as Window & { Spotify?: { Player: new (config: SpotifyPlayerConfig) => SpotifyPlayer } }).Spotify) {
          await new Promise<void>((resolve) => {
            const script = document.createElement("script");
            script.src = "https://sdk.scdn.co/spotify-player.js";
            script.async = true;
            script.onload = () => {
              resolve();
            };
            script.onerror = (e: unknown) => {
              console.error("Failed to load Spotify SDK script", e);
              setSpotifyFailed(true);
            };
            document.body.appendChild(script);
          });
        } else if (
          typeof (window as Window & { onSpotifyWebPlaybackSDKReady?: () => void }).onSpotifyWebPlaybackSDKReady === "function"
        ) {
          (window as Window & { onSpotifyWebPlaybackSDKReady?: () => void }).onSpotifyWebPlaybackSDKReady!();
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
      } catch { }
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
      } catch { }
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
      <CollapsedPlayer
        embedded={embedded}
        playerRef={playerRef}
        buttonsRef={buttonsRef}
        handleExpandClick={handleExpandClick}
        handleButtonClick={handleButtonClick}
        handleButtonHover={handleButtonHover}
        handleButtonLeave={handleButtonLeave}
        isLoading={isLoading}
        albumCoverRef={albumCoverRef}
        useSpotify={useSpotify}
        spotifyCurrentTrack={spotifyCurrentTrack}
        currentTrack={currentTrack}
      />
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
        className={`${embedded ? "absolute" : "fixed"} bottom-6 right-6 ${embedded ? "z-10" : "z-50"
          } backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden bg-cover bg-center`}
        style={{
          width: "380px",
          height: "300px",
          backgroundImage: `url(${MusicWallpaper.src})`,
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
      <ExpandedPlayer
        embedded={embedded}
        playerRef={playerRef}
        showPlaylist={showPlaylist}
        setShowPlaylist={setShowPlaylist}
        buttonsRef={buttonsRef}
        handleButtonHover={handleButtonHover}
        handleButtonLeave={handleButtonLeave}
        handleButtonClick={handleButtonClick}
        handleDesktopClose={handleDesktopClose}
        handlePlaylistToggle={handlePlaylistToggle}
        albumCoverRef={albumCoverRef}
        useSpotify={useSpotify}
        spotifyCurrentTrack={spotifyCurrentTrack}
        currentTrack={currentTrack}
        progress={progress}
        handleSeek={handleSeek}
        isLoading={isLoading}
        formatTime={formatTime}
        spDurationMs={spDurationMs}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        volume={volume}
        setVolume={setVolume}
        spotifyPlayerRef={spotifyPlayerRef}
        playClickSound={playClickSound}
        playlistRef={playlistRef}
        spotifyPlaylistTracks={spotifyPlaylistTracks}
        playlist={playlist}
        changeTrack={changeTrack}
        formatDuration={formatDuration}
      />
    );
  }

  // Mobile/Widget version with horizontal scrolling playlist
  return (
    <MobilePlayer
      playerRef={playerRef}
      showPlaylist={showPlaylist}
      setShowPlaylist={setShowPlaylist}
      albumCoverRef={albumCoverRef}
      isLoading={isLoading}
      useSpotify={useSpotify}
      spotifyCurrentTrack={spotifyCurrentTrack}
      currentTrack={currentTrack}
      buttonsRef={buttonsRef}
      handlePrevious={handlePrevious}
      playClickSound={playClickSound}
      handleButtonClick={handleButtonClick}
      handleButtonHover={handleButtonHover}
      handleButtonLeave={handleButtonLeave}
      handlePlayPause={handlePlayPause}
      isPlaying={isPlaying}
      handleNext={handleNext}
      handlePlaylistToggle={handlePlaylistToggle}
      progress={progress}
      handleSeek={handleSeek}
      formatTime={formatTime}
      spotifyPlaylistTracks={spotifyPlaylistTracks}
      playlist={playlist}
      changeTrack={changeTrack}
      formatDuration={formatDuration}
    />
  );
}
