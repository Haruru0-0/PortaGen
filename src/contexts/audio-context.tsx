"use client";

import { playlist, type Track } from "@/lib/types";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { loadYouTubeIframeApi, YT_STATE, type YTPlayer } from "@/lib/music/youtube-iframe";
import { hiddenWidgetStyle, loadSoundCloudApi, soundCloudEmbedSrc, type SCWidget } from "@/lib/music/soundcloud-widget";

/**
 * Which engine plays YouTube Music tracks.
 * "proxy": our server fetches the audio and an <audio> element plays it (default).
 * "embed": YouTube's own IFrame player plays it in the visitor's browser.
 * Choose with NEXT_PUBLIC_YT_ENGINE=embed, or add ?ytEngine=embed or ?ytEngine=proxy to the page URL.
 */
export type YouTubeEngine = "proxy" | "embed";

function readEngine(): YouTubeEngine {
  if (typeof window === "undefined") return "proxy";
  try {
    const query = new URLSearchParams(window.location.search).get("ytEngine");
    if (query === "embed" || query === "proxy") return query;
  } catch {
    // ignore: fall through to the build-time default
  }
  return process.env.NEXT_PUBLIC_YT_ENGINE === "embed" ? "embed" : "proxy";
}

export const AudioContext = createContext({
  audioRef: { current: null as HTMLAudioElement | null },
  currentTrack: playlist[0],
  isPlaying: false,
  progress: 0,
  volume: 70,
  duration: 0,
  isLoading: false,
  playbackError: false,
  retryPlayback: () => {},
  engine: "proxy" as YouTubeEngine,
  seek: (_percent: number) => { void _percent; return false as boolean; },
  setQueue: (_tracks: Track[], _sourceKey?: string) => { void _tracks; void _sourceKey; },
  setCurrentTrack: (_track: Track) => { void _track; },
  setIsPlaying: (_playing: boolean) => { void _playing; },
  setProgress: (_progress: number) => { void _progress; },
  setVolume: (_volume: number) => { void _volume; },
  setIsLoading: (_loading: boolean) => { void _loading; },
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);
  const [queueSourceKey, setQueueSourceKey] = useState("local");
  const [engine] = useState<YouTubeEngine>(readEngine);
  const [playerReady, setPlayerReady] = useState(false);
  const embedHostRef = useRef<HTMLDivElement | null>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const loadedEmbedRef = useRef<string | null>(null);
  const advanceRef = useRef<() => void>(() => {});
  const [scReady, setScReady] = useState(false);
  const scHostRef = useRef<HTMLDivElement | null>(null);
  const scWidgetRef = useRef<SCWidget | null>(null);
  const scIndexRef = useRef(-1);
  const scDurationRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Track[]>(playlist);
  const sourceKeyRef = useRef("local");
  const loadedEntryRef = useRef<number | null>(null);
  const trackRef = useRef(currentTrack);
  const playingRef = useRef(isPlaying);
  const embedActive = engine === "embed" && !!currentTrack.videoId;
  // SoundCloud tracks always play through SoundCloud's own (hidden) widget.
  const scActive = !!currentTrack.soundcloudUrl;
  const scUrl = currentTrack.soundcloudUrl;
  useEffect(() => {
    trackRef.current = currentTrack;
    playingRef.current = isPlaying;
  }, [currentTrack, isPlaying]);

  const setQueue = useCallback((tracks: Track[], sourceKey = "local") => {
    const sameSource = sourceKeyRef.current === sourceKey;
    if (sameSource && queueRef.current === tracks) return;
    const retainsCurrentEntry = sameSource && tracks.some(track =>
      track.id === trackRef.current.id && track.src === trackRef.current.src);
    queueRef.current = tracks;
    sourceKeyRef.current = sourceKey;
    if (!sameSource) setQueueSourceKey(sourceKey);
    if (retainsCurrentEntry) return;
    loadedEntryRef.current = null;
    setIsPlaying(false);
    setPlaybackError(false);
    setProgress(0);
    setDuration(0);
    setCurrentTrack(tracks[0] ?? { id: 0, title: "", artist: "", cover: "", duration: "", src: "" });
  }, []);

  const retryPlayback = useCallback(() => {
    loadedEntryRef.current = null;
    setPlaybackError(false);
    setRetryVersion(version => version + 1);
    setIsPlaying(true);
  }, []);

  const seek = useCallback((percent: number) => {
    const pct = Math.max(0, Math.min(100, percent));
    if (scActive) {
      const widget = scWidgetRef.current;
      if (!widget || !(scDurationRef.current > 0)) return false;
      widget.seekTo((scDurationRef.current * pct) / 100);
      setProgress(pct);
      return true;
    }
    if (embedActive) {
      const player = ytPlayerRef.current;
      const length = player?.getDuration() ?? 0;
      if (!player || !(length > 0)) return false;
      player.seekTo((length * pct) / 100, true);
      setProgress(pct);
      return true;
    }
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return false;
    audio.currentTime = (audio.duration * pct) / 100;
    setProgress(pct);
    return true;
  }, [embedActive, scActive]);

  // Called when an embedded track ends: move to the next entry, or restart a one-track queue.
  useEffect(() => {
    advanceRef.current = () => {
      const queue = queueRef.current;
      if (!queue.length) { setIsPlaying(false); return; }
      const index = queue.findIndex(track => track.id === trackRef.current.id);
      const next = queue[(index + 1) % queue.length];
      if (next === trackRef.current) {
        ytPlayerRef.current?.seekTo(0, true);
        if (playingRef.current) ytPlayerRef.current?.playVideo();
      } else {
        setCurrentTrack(next);
      }
    };
  });

  // This provider is the sole owner of audio sources and media listeners.
  useEffect(() => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audioRef.current = audio;
    const updateProgress = () => setProgress(Number.isFinite(audio.duration) && audio.duration > 0
      ? (audio.currentTime / audio.duration) * 100 : 0);
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const ready = () => setIsLoading(false);
    const reset = () => { setProgress(0); setDuration(0); setIsLoading(false); setPlaybackError(false); };
    const waiting = () => { if (playingRef.current) setIsLoading(true); };
    const loadStart = () => { setPlaybackError(false); waiting(); };
    const error = () => { setIsLoading(false); setIsPlaying(false); setPlaybackError(true); };
    const ended = () => {
      const queue = queueRef.current;
      if (!queue.length) { setIsPlaying(false); return; }
      const index = queue.findIndex(track => track.id === trackRef.current.id);
      const next = queue[(index + 1) % queue.length];
      if (next === trackRef.current) {
        audio.currentTime = 0;
        if (playingRef.current) audio.play().catch(error);
      } else {
        setCurrentTrack(next);
      }
    };
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("durationchange", updateDuration);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("emptied", reset);
    audio.addEventListener("loadstart", loadStart);
    audio.addEventListener("pause", ready);
    audio.addEventListener("canplay", ready);
    audio.addEventListener("playing", ready);
    audio.addEventListener("waiting", waiting);
    audio.addEventListener("error", error);
    audio.addEventListener("ended", ended);
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("durationchange", updateDuration);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("emptied", reset);
      audio.removeEventListener("loadstart", loadStart);
      audio.removeEventListener("pause", ready);
      audio.removeEventListener("canplay", ready);
      audio.removeEventListener("playing", ready);
      audio.removeEventListener("waiting", waiting);
      audio.removeEventListener("error", error);
      audio.removeEventListener("ended", ended);
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (embedActive || scActive) {
      // An embedded widget plays this track; keep the <audio> element silent.
      audio.pause();
      return;
    }
    let cancelled = false;
    const src = typeof currentTrack.src === "string" ? currentTrack.src : currentTrack.src?.sources?.[0]?.src ?? "";
    if (audio.getAttribute("src") !== src || loadedEntryRef.current !== currentTrack.id) {
      loadedEntryRef.current = currentTrack.id;
      audio.pause();
      if (src) audio.src = src;
      else audio.removeAttribute("src");
      audio.load();
    }
    if (isPlaying && src) {
      audio.play().then(() => {
        if (!cancelled) setIsLoading(false);
      }).catch(() => {
        if (!cancelled) { setIsPlaying(false); setIsLoading(false); setPlaybackError(true); }
      });
    } else {
      audio.pause();
    }
    return () => { cancelled = true; };
  }, [currentTrack, isPlaying, queueSourceKey, retryVersion, embedActive, scActive]);

  // Create the hidden SoundCloud widget while a SoundCloud track is current.
  useEffect(() => {
    if (!scActive || !scUrl) return;
    let cancelled = false;
    const iframe = document.createElement("iframe");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";
    iframe.allow = "autoplay";
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.src = soundCloudEmbedSrc(scUrl);
    scHostRef.current?.appendChild(iframe);
    loadSoundCloudApi().then(SC => {
      if (cancelled) return;
      const widget = SC.Widget(iframe);
      scWidgetRef.current = widget;
      const E = SC.Widget.Events;
      widget.bind(E.READY, () => { scIndexRef.current = 0; setScReady(true); });
      widget.bind(E.PLAY, () => {
        setIsLoading(false);
        setPlaybackError(false);
        // The widget moves through its own list; keep the current track in step with it.
        widget.getCurrentSoundIndex(index => {
          scIndexRef.current = index;
          const track = queueRef.current.find(entry => entry.scIndex === index);
          if (track && track.id !== trackRef.current.id) setCurrentTrack(track);
        });
        widget.getDuration(ms => { scDurationRef.current = ms; setDuration(ms / 1000); });
      });
      widget.bind(E.PAUSE, () => setIsLoading(false));
      widget.bind(E.FINISH, () => {
        widget.getCurrentSoundIndex(index => {
          const queue = queueRef.current;
          // After the last sound, wrap to the first like the other engines.
          if (queue.length && index >= queue.length - 1) setCurrentTrack(queue[0]);
        });
      });
      widget.bind(E.PLAY_PROGRESS, data => { if (data) setProgress(data.relativePosition * 100); });
      widget.bind(E.ERROR, () => { setIsLoading(false); setIsPlaying(false); setPlaybackError(true); });
    }).catch(() => {
      if (!cancelled) { setIsLoading(false); setIsPlaying(false); setPlaybackError(true); }
    });
    return () => {
      cancelled = true;
      scWidgetRef.current = null;
      scIndexRef.current = -1;
      scDurationRef.current = 0;
      iframe.remove();
      setScReady(false);
    };
  }, [scActive, scUrl]);

  // Play, pause and switch sounds on the SoundCloud widget.
  useEffect(() => {
    const widget = scWidgetRef.current;
    const index = currentTrack.scIndex;
    if (!scActive || !scReady || !widget || index === undefined) return;
    if (scIndexRef.current !== index) {
      scIndexRef.current = index;
      widget.skip(index);
    }
    if (isPlaying) widget.play();
    else widget.pause();
  }, [scActive, scReady, currentTrack, isPlaying, retryVersion]);

  useEffect(() => {
    if (scActive && scReady) scWidgetRef.current?.setVolume(Math.max(0, Math.min(100, volume)));
  }, [scActive, scReady, volume]);

  // Create the YouTube player once an embedded track is current, and tear it down when leaving that mode.
  useEffect(() => {
    if (!embedActive) return;
    let cancelled = false;
    loadYouTubeIframeApi().then(YT => {
      const host = embedHostRef.current;
      if (cancelled || !host || ytPlayerRef.current) return;
      const mount = document.createElement("div");
      host.appendChild(mount);
      ytPlayerRef.current = new YT.Player(mount, {
        width: 200,
        height: 200,
        playerVars: { playsinline: 1, controls: 0, disablekb: 1, rel: 0, modestbranding: 1, origin: window.location.origin },
        events: {
          onReady: () => setPlayerReady(true),
          onStateChange: event => {
            if (event.data === YT_STATE.PLAYING) { setIsLoading(false); setPlaybackError(false); }
            else if (event.data === YT_STATE.BUFFERING) { if (playingRef.current) setIsLoading(true); }
            else if (event.data === YT_STATE.PAUSED) setIsLoading(false);
            else if (event.data === YT_STATE.ENDED) advanceRef.current();
          },
          onError: () => { setIsLoading(false); setIsPlaying(false); setPlaybackError(true); },
        },
      });
    }).catch(() => {
      if (!cancelled) { setIsLoading(false); setIsPlaying(false); setPlaybackError(true); }
    });
    return () => {
      cancelled = true;
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
      loadedEmbedRef.current = null;
      setPlayerReady(false);
    };
  }, [embedActive]);

  // Load, play and pause the current embedded track.
  useEffect(() => {
    const player = ytPlayerRef.current;
    const videoId = currentTrack.videoId;
    if (!embedActive || !playerReady || !player || !videoId) return;
    const key = `${videoId}:${retryVersion}`;
    if (loadedEmbedRef.current !== key) {
      loadedEmbedRef.current = key;
      // Deferred so the reset is not a synchronous state update inside the effect body.
      queueMicrotask(() => {
        setProgress(0);
        setDuration(0);
        if (isPlaying) setIsLoading(true);
      });
      if (isPlaying) player.loadVideoById(videoId);
      else player.cueVideoById(videoId);
    } else if (isPlaying) {
      player.playVideo();
    } else {
      player.pauseVideo();
    }
  }, [embedActive, playerReady, currentTrack, isPlaying, retryVersion]);

  // Report progress from the embed.
  useEffect(() => {
    if (!embedActive || !playerReady) return;
    const timer = window.setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player) return;
      const length = player.getDuration();
      if (Number.isFinite(length) && length > 0) {
        setDuration(length);
        setProgress((player.getCurrentTime() / length) * 100);
      }
    }, 500);
    return () => window.clearInterval(timer);
  }, [embedActive, playerReady]);

  useEffect(() => {
    if (embedActive && playerReady) ytPlayerRef.current?.setVolume(Math.max(0, Math.min(100, volume)));
  }, [embedActive, playerReady, volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(100, volume)) / 100;
  }, [volume]);

  return (
    <AudioContext.Provider value={{ audioRef, currentTrack, isPlaying, progress, volume, duration, isLoading, playbackError, retryPlayback, engine, seek,
      setQueue, setCurrentTrack, setIsPlaying, setProgress, setVolume, setIsLoading }}>
      {children}
      {scActive && <div ref={scHostRef} aria-hidden="true" style={hiddenWidgetStyle} />}
      {embedActive && (
        // YouTube requires the embedded player to stay visible and at least 200x200.
        <div
          ref={embedHostRef}
          aria-label="YouTube player"
          className="fixed bottom-3 left-3 z-40 h-[200px] w-[200px] overflow-hidden border-2 border-white/60 bg-black shadow-lg"
        />
      )}
    </AudioContext.Provider>
  );
}
