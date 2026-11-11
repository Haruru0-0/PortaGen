"use client";

import { playlist, type Track } from "@/lib/types";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<Track[]>(playlist);
  const sourceKeyRef = useRef("local");
  const loadedEntryRef = useRef<number | null>(null);
  const trackRef = useRef(currentTrack);
  const playingRef = useRef(isPlaying);
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
  }, [currentTrack, isPlaying, queueSourceKey, retryVersion]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(100, volume)) / 100;
  }, [volume]);

  return (
    <AudioContext.Provider value={{ audioRef, currentTrack, isPlaying, progress, volume, duration, isLoading, playbackError, retryPlayback,
      setQueue, setCurrentTrack, setIsPlaying, setProgress, setVolume, setIsLoading }}>
      {children}
    </AudioContext.Provider>
  );
}
