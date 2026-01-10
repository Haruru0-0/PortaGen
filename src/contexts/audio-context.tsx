import { playlist, type Track } from "@/lib/types";
import { createContext, useEffect, useRef, useState } from "react";

export const AudioContext = createContext({
  audioRef: { current: null as HTMLAudioElement | null },
  currentTrack: playlist[0],
  isPlaying: false,
  progress: 0,
  volume: 70,
  duration: 0,
  isLoading: false,
  setCurrentTrack: (track: Track) => { },
  setIsPlaying: (playing: boolean) => { },
  setProgress: (progress: number) => { },
  setVolume: (volume: number) => { },
  setIsLoading: (loading: boolean) => { },
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track>(playlist[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Initialize audio element only once
  useEffect(() => {
    if (typeof document !== 'undefined' && !audioRef.current) {
      const audio = document.createElement('audio');
      audioRef.current = audio;
      document.body.appendChild(audio);

      // Save current time when switching views
      const currentTime = audio.currentTime;

      const updateProgress = () => {
        if (!audio.duration) return;
        const newProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(isNaN(newProgress) ? 0 : newProgress);
      };

      const handleDurationChange = () => {
        setDuration(audio.duration || 0);
      };

      const handleEnded = () => {
        const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % playlist.length;
        setCurrentTrack(playlist[nextIndex]);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('loadedmetadata', handleDurationChange);

      // Restore playback state if it was playing
      if (isPlaying) {
        audio.play().catch(e => console.log("Autoplay prevented:", e));
      }

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('loadedmetadata', handleDurationChange);
        // Don't remove the audio element - we want it to persist
      };
    }
  }, []);

  // Handle track changes
  useEffect(() => {
    const playAudio = async () => {
      // Resolve source
      const src = typeof currentTrack.src === 'string' ? currentTrack.src : currentTrack.src?.sources?.[0]?.src;

      if (!audioRef.current || !src) return;

      try {
        setIsLoading(true);

        const wasPlaying = isPlaying;
        audioRef.current.src = src;
        audioRef.current.volume = volume / 100;

        await audioRef.current.load();

        if (wasPlaying) {
          await audioRef.current.play().catch(e => {
            console.log("Autoplay prevented:", e);
            setIsPlaying(false);
          });
        }
      } catch (error) {
        console.error("Playback error:", error);
        setIsPlaying(false);
      } finally {
        setIsLoading(false);
      }
    };

    playAudio();
  }, [currentTrack]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        currentTrack,
        isPlaying,
        progress,
        volume,
        duration,
        isLoading,
        setCurrentTrack,
        setIsPlaying,
        setProgress,
        setVolume,
        setIsLoading,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}