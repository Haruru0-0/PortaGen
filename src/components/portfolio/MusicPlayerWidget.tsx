"use client";
import { useCallback, useContext, useEffect, useRef, useState, memo } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { isSpotifyMusicUrl } from "@/lib/music/youtube-playlist";
import { useYouTubePlaylist } from "@/hooks/use-youtube-playlist";
import { useSoundCloudPlaylist } from "@/hooks/use-soundcloud-playlist";
import { AudioContext } from "../../contexts/audio-context";
import { useAppSound } from "../../contexts/sound-context";
import { playlist, Track } from "@/lib/types";
import { getMusicPlayerJSX } from "./music-player-styles";
import { MusicPlayerStyleProps } from "./music-player-styles/types";
import { useAchievements } from "./achievement-context";

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
  disconnect: () => void;
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
  musicPlayerStyleId?: string;
}

interface ThemedMusicPlayerProps extends Partial<MusicPlayerStyleProps> {
  musicPlayerStyleId: string;
  playerType: "collapsed" | "expanded" | "mobile";
  playbackError?: boolean;
  onRetry?: () => void;
  onSkipUnavailable?: () => void;
  youtubeMusicUrl?: string;
  externalLabel?: string;
}

function ThemedMusicPlayer(props: ThemedMusicPlayerProps) {
  const { musicPlayerStyleId, playerType, playbackError, onRetry, onSkipUnavailable, youtubeMusicUrl, externalLabel, ...restProps } = props;

  // Provide default values for required props
  // We use useMemo here to avoid creating a new object on every render if possible
  // though it depends on many props that change frequently
  const musicPlayerProps: MusicPlayerStyleProps = {
    playerType,
    embedded: restProps.embedded || false,
    playerRef: restProps.playerRef || { current: null },
    buttonsRef: restProps.buttonsRef || { current: [] },
    handleExpandClick: restProps.handleExpandClick || (() => { }),
    handleButtonClick: restProps.handleButtonClick || (() => { }),
    handleButtonHover: restProps.handleButtonHover || (() => { }),
    handleButtonLeave: restProps.handleButtonLeave || (() => { }),
    isLoading: restProps.isLoading || false,
    albumCoverRef: restProps.albumCoverRef || { current: null },
    useSpotify: restProps.useSpotify || false,
    spotifyCurrentTrack: restProps.spotifyCurrentTrack || null,
    currentTrack: restProps.currentTrack || { id: 0, title: "", artist: "", cover: "", duration: "", src: "" },
    showPlaylist: restProps.showPlaylist || false,
    setShowPlaylist: restProps.setShowPlaylist || (() => { }),
    handlePlaylistToggle: restProps.handlePlaylistToggle || (() => { }),
    handleDesktopClose: restProps.handleDesktopClose || (() => { }),
    progress: restProps.progress || 0,
    handleSeek: restProps.handleSeek || (() => { }),
    formatTime: restProps.formatTime || (() => "0:00"),
    spDurationMs: restProps.spDurationMs || 0,
    isPlaying: restProps.isPlaying || false,
    onPlayPause: restProps.onPlayPause || (() => { }),
    onNext: restProps.onNext || (() => { }),
    onPrevious: restProps.onPrevious || (() => { }),
    volume: restProps.volume ?? 50,
    setVolume: restProps.setVolume || (() => { }),
    spotifyPlayerRef: restProps.spotifyPlayerRef || { current: null },
    playClickSound: restProps.playClickSound || (() => { }),
    playlistRef: restProps.playlistRef || { current: null },
    spotifyPlaylistTracks: restProps.spotifyPlaylistTracks || [],
    playlist: restProps.playlist || [],
    changeTrack: restProps.changeTrack || (() => { }),
    formatDuration: restProps.formatDuration || (() => "0:00"),
    handlePlayPause: restProps.onPlayPause || (() => { }),
    handleNext: restProps.onNext || (() => { }),
    handlePrevious: restProps.onPrevious || (() => { }),
    previewMode: restProps.previewMode || "desktop",
    isSpotifyFallback: restProps.isSpotifyFallback || false,
    spotifyEmbedUrl: restProps.spotifyEmbedUrl || "",
  };

  return <>
    {getMusicPlayerJSX(musicPlayerStyleId, musicPlayerProps)}
    {playbackError ? (
      <div
        role="alert"
        className={`${playerType === "mobile" ? "relative mt-2 w-full" : restProps.embedded ? "absolute" : "fixed"} z-[100] rounded-lg border border-white/20 bg-zinc-950/95 p-3 text-sm text-white shadow-lg`}
        style={playerType === "mobile" ? undefined : {
          bottom: playerType === "collapsed" ? "8rem" : "calc(min(300px, 60vh) + 2rem)",
          right: "1.5rem", width: "min(380px, calc(100% - 3rem))",
        }}
      >
        <p>This track could not be played. Try again or choose another track.</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          <button type="button" className="cursor-pointer underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4" onClick={onRetry}>Retry</button>
          <button type="button" className="cursor-pointer underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4" onClick={onSkipUnavailable}>Next track</button>
          {youtubeMusicUrl ? <a className="underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-4" href={youtubeMusicUrl} target="_blank" rel="noopener noreferrer">{externalLabel ?? "Open on YouTube Music"}</a> : null}
        </div>
      </div>
    ) : null}
  </>;
}

const EMPTY_QUEUE: Track[] = [];

const MusicPlayerWidget = memo(function MusicPlayerWidget({
  isDesktop = false,
  embedded = false,
  spotifyPlaylistUrl,
  musicPlayerStyleId = "default",
}: MusicPlayerProps) {
  const {
    seek: seekTrack,
    currentTrack: audioTrack,
    isPlaying,
    progress,
    volume,
    duration,
    isLoading,
    playbackError,
    retryPlayback,
    setCurrentTrack,
    setIsPlaying,
    setProgress,
    setVolume,
    setQueue,
  } = useContext(AudioContext);

  const { playClickSound, playMenuSound, playPowerUpSound } = useAppSound();
  const { emit: emitAchievement } = useAchievements();

  useEffect(() => {
    if (isPlaying) emitAchievement({ type: "music_play" });
  }, [isPlaying, emitAchievement]);

  const youtube = useYouTubePlaylist(spotifyPlaylistUrl);
  const soundcloud = useSoundCloudPlaylist(spotifyPlaylistUrl);
  const ext = soundcloud.configured ? soundcloud : youtube;
  const useSpotify = !!spotifyPlaylistUrl && isSpotifyMusicUrl(spotifyPlaylistUrl);
  const queue = ext.configured ? ext.playlist?.tracks ?? EMPTY_QUEUE : useSpotify ? EMPTY_QUEUE : playlist;
  const unavailable = ext.configured && !ext.playlist;
  const currentTrack = unavailable ? {
    id: 0,
    title: ext.loading ? "Loading playlist..." : "Playlist unavailable",
    artist: ext.loading ? (soundcloud.configured ? "SoundCloud" : "YouTube Music") : "Check that the playlist is public and try again.",
    cover: playlist[0].cover,
    duration: "0:00",
    src: "",
  } : audioTrack;
  const playerLoading = isLoading || ext.loading;
  const sourceKey = useSpotify ? `spotify:${spotifyPlaylistUrl}` : ext.sourceKey;
  useEffect(() => { setQueue(queue, sourceKey); }, [queue, sourceKey, setQueue]);

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const spotifyEmbedUrl = (() => {
    if (!useSpotify || !spotifyPlaylistUrl) return "";
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
  const spotifyPlayerRef = useRef<SpotifyPlayer | null>(null);
  const spotifyAccessTokenRef = useRef<string>("");
  const spotifyDeviceIdRef = useRef<string>("");
  const spotifyTrackIdRef = useRef<string | undefined>(undefined);
  const [spotifyReady, setSpotifyReady] = useState(false);
  const [spotifyFailed, setSpotifyFailed] = useState(false);
  const [, setSpPositionMs] = useState(0);
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

  const fetchSpotifyCurrentTrack = useCallback(async () => {
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
  }, []);

  const fetchSpotifyPlaylistTracks = useCallback(async () => {
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
  }, [spotifyPlaylistUrl]);

  useEffect(() => {
    if (!useSpotify) return;

    let cancelled = false;
    let sdkReady: (() => void) | undefined;
    setSpotifyFailed(false);
    setSpotifyReady(false);
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

        // Check premium status before initializing SDK
        try {
          const profileRes = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const profile = await profileRes.json();
          if (profile.product !== "premium") {
            console.warn("Spotify user is not premium:", profile.product);
            setSpotifyFailed(true);
            // Don't initialize SDK for non-premium users to avoid account_error
            return;
          }
        } catch (e) {
          console.error("Failed to fetch Spotify profile:", e);
        }

        sdkReady = () => {
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
            console.error("Spotify SDK account_error (likely non-premium or auth mismatch):", error);
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

          });

          player.addListener("player_state_changed", async (state: unknown) => {
            if (cancelled) return;
            if (!state) return;
            const playerState = state as SpotifyPlayerState;
            setSpPositionMs(playerState.position || 0);
            setSpDurationMs(playerState.duration || 0);
            const pct = playerState.duration
              ? (playerState.position / playerState.duration) * 100
              : 0;
            if (!isDraggingSlider.current) {
              setProgress(isNaN(pct) ? 0 : pct);
            }
            lastUpdateRef.current = Date.now();
            setIsPlaying(!playerState.paused);

            // Fetch current track info when track changes
            if (
              playerState.track_window?.current_track?.id !== spotifyTrackIdRef.current
            ) {
              spotifyTrackIdRef.current = playerState.track_window?.current_track?.id;
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
        (window as Window & { onSpotifyWebPlaybackSDKReady?: () => void }).onSpotifyWebPlaybackSDKReady = sdkReady;

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
      spotifyPlayerRef.current?.disconnect();
      spotifyPlayerRef.current = null;
      const sdkWindow = window as Window & { onSpotifyWebPlaybackSDKReady?: () => void };
      if (sdkWindow.onSpotifyWebPlaybackSDKReady === sdkReady) delete sdkWindow.onSpotifyWebPlaybackSDKReady;
    };
  }, [useSpotify, spotifyPlaylistUrl, fetchSpotifyCurrentTrack, fetchSpotifyPlaylistTracks, setIsPlaying, setProgress]);

  const playerRef = useRef<HTMLDivElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);
  const albumCoverRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLButtonElement[]>([]);
  const rotationTweenRef = useRef<gsap.core.Tween | null>(null);
  const isDraggingSlider = useRef(false);
  const lastUpdateRef = useRef<number>(Date.now());

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

      // Only rotate in collapsed desktop view
      if (!prefersReducedMotion && isDesktop && !isExpanded) {
        rotationTweenRef.current = gsap.to(albumCoverRef.current, {
          rotation: 360,
          duration: 3,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });
      } else {
        // Reset rotation for expanded, mobile, or reduced motion
        gsap.set(albumCoverRef.current, { rotation: 0 });
      }
    } else {
      // Stop rotation and reset to 0 degrees
      gsap.set(albumCoverRef.current, { rotation: 0 });
    }
  }, [isPlaying, isLoading, isDesktop, isExpanded]);


  // Local progress ticker for smooth slider
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (useSpotify && isPlaying && !isLoading && !isDraggingSlider.current) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastUpdateRef.current;

        if (elapsed > 1000) { // Sync drift fallback
          // Optionally resync here if we had access to player state, 
          // but relying on player_state_changed is usually enough.
          // We'll just update the local progress based on estimated time.
        }

        if (spDurationMs > 0) {
          setSpPositionMs((prev) => {
            const nextPos = prev + 100; // increment by interval time
            const nextPct = (nextPos / spDurationMs) * 100;
            if (!isDraggingSlider.current) {
              setProgress(Math.min(nextPct, 100));
            }
            return Math.min(nextPos, spDurationMs);
          });
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [useSpotify, isPlaying, isLoading, spDurationMs, setProgress]);

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
      gsap.killTweensOf(playerRef.current);
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
        gsap.killTweensOf(button);
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
      if (playerRef.current) gsap.killTweensOf(playerRef.current);
      buttonsRef.current.forEach(button => {
        if (button) gsap.killTweensOf(button);
      });
    };
  }, { dependencies: [musicPlayerStyleId, isDesktop, isExpanded], revertOnUpdate: true });

  const handlePlayPause = async () => {
    if (useSpotify) {
      if (!spotifyReady || !spotifyPlayerRef.current) return;
      try {
        if (!spotifyCurrentTrack) {
          const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${spotifyDeviceIdRef.current}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${spotifyAccessTokenRef.current}`, "Content-Type": "application/json" },
            body: JSON.stringify({ context_uri: `spotify:playlist:${parsePlaylistId(spotifyPlaylistUrl)}` }),
          });
          if (!response.ok) throw new Error("Spotify playback unavailable");
        } else {
          await spotifyPlayerRef.current.togglePlay();
        }
      } catch { setSpotifyFailed(true); }
      return;
    }
    if (!queue.length || unavailable) return;
    if (playbackError) retryPlayback();
    else setIsPlaying(!isPlaying);
    if (isPlaying) playClickSound();
    else playPowerUpSound();
  };

  const changeTrack = (track: Track) => {
    if (!queue.some(item => item.id === track.id)) return;
    setCurrentTrack(track);
    setProgress(0);
    playMenuSound();
  };

  const handleNext = () => {
    if (useSpotify && spotifyPlayerRef.current) {
      spotifyPlayerRef.current.nextTrack();
      return;
    }
    if (useSpotify || !queue.length) return;
    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    const nextIndex = (currentIndex + 1) % queue.length;
    changeTrack(queue[nextIndex]);
  };

  const handlePrevious = () => {
    if (useSpotify && spotifyPlayerRef.current) {
      spotifyPlayerRef.current.previousTrack();
      return;
    }
    if (useSpotify || !queue.length) return;
    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    changeTrack(queue[prevIndex]);
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
    
    if (!duration) return "0:00";
    const totalSeconds = Math.floor(
      (duration * progress) / 100
    );
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSeek = useCallback(async (value: number[]) => {
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
    if (useSpotify || !seekTrack(pct)) return;
    playClickSound();
  }, [useSpotify, spDurationMs, seekTrack, setProgress, playClickSound]);

  const handleSeekWrapped = useCallback((value: number[]) => {
    isDraggingSlider.current = true;
    handleSeek(value);
    setTimeout(() => { isDraggingSlider.current = false; }, 200);
  }, [handleSeek]);

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

  const errorFeedbackProps = {
    playbackError: ext.configured && !unavailable && playbackError,
    onRetry: retryPlayback,
    onSkipUnavailable: () => {
      if (queue.length === 1) retryPlayback();
      else { handleNext(); setIsPlaying(true); }
    },
    youtubeMusicUrl: ext.playlist?.url,
    externalLabel: soundcloud.configured ? "Open on SoundCloud" : undefined,
  };

  if (isDesktop && !isExpanded) {
    return (
      <ThemedMusicPlayer
        {...errorFeedbackProps}
        playerType="collapsed"
        embedded={embedded}
        playerRef={playerRef}
        buttonsRef={buttonsRef}
        handleExpandClick={handleExpandClick}
        handleButtonClick={handleButtonClick}
        handleButtonHover={handleButtonHover}
        handleButtonLeave={handleButtonLeave}
        isLoading={playerLoading}
        albumCoverRef={albumCoverRef}
        useSpotify={useSpotify}
        spotifyCurrentTrack={spotifyCurrentTrack}
        currentTrack={currentTrack}
        musicPlayerStyleId={musicPlayerStyleId}
      />
    );
  }

  // Desktop expanded panel
  if (isDesktop && isExpanded) {
    return (
      <ThemedMusicPlayer
        {...errorFeedbackProps}
        playerType="expanded"
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
        handleSeek={handleSeekWrapped}
        isLoading={playerLoading}
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
        playlist={queue}
        changeTrack={changeTrack}
        formatDuration={formatDuration}
        musicPlayerStyleId={musicPlayerStyleId}
        isSpotifyFallback={useSpotify && spotifyFailed}
        spotifyEmbedUrl={spotifyEmbedUrl}
      />
    );
  }

  // Mobile/Widget version with horizontal scrolling playlist
  return (
    <ThemedMusicPlayer
      {...errorFeedbackProps}
      playerType="mobile"
      embedded={embedded}
      volume={volume}
      setVolume={setVolume}
      spDurationMs={spDurationMs}
      spotifyPlayerRef={spotifyPlayerRef}
      isSpotifyFallback={useSpotify && spotifyFailed}
      spotifyEmbedUrl={spotifyEmbedUrl}
      playerRef={playerRef}
      showPlaylist={showPlaylist}
      setShowPlaylist={setShowPlaylist}
      albumCoverRef={albumCoverRef}
      isLoading={playerLoading}
      useSpotify={useSpotify}
      spotifyCurrentTrack={spotifyCurrentTrack}
      currentTrack={currentTrack}
      buttonsRef={buttonsRef}
      onPrevious={handlePrevious}
      playClickSound={playClickSound}
      handleButtonClick={handleButtonClick}
      handleButtonHover={handleButtonHover}
      handleButtonLeave={handleButtonLeave}
      onPlayPause={handlePlayPause}
      isPlaying={isPlaying}
      onNext={handleNext}
      handlePlaylistToggle={handlePlaylistToggle}
      progress={progress}
      handleSeek={handleSeekWrapped}
      formatTime={formatTime}
      spotifyPlaylistTracks={spotifyPlaylistTracks}
      playlist={queue}
      changeTrack={changeTrack}
      formatDuration={formatDuration}
      musicPlayerStyleId={musicPlayerStyleId}
      key={`${musicPlayerStyleId}-mobile`}
    />
  );
});

export default MusicPlayerWidget;
