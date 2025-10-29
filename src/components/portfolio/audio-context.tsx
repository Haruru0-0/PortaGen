"use client"

import type React from "react"

import { createContext, useContext, useState, useRef, useCallback } from "react"

type AudioContextType = {
  isPlaying: boolean
  currentTrack: number
  tracks: { title: string; artist: string; url: string }[]
  play: () => void
  pause: () => void
  next: () => void
  previous: () => void
  setVolume: (volume: number) => void
  volume: number
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolumeState] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const tracks = [
    { title: "Track 1", artist: "Artist 1", url: "/music/track1.mp3" },
    { title: "Track 2", artist: "Artist 2", url: "/music/track2.mp3" },
  ]

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const next = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
  }, [tracks.length])

  const previous = useCallback(() => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)
  }, [tracks.length])

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol)
    if (audioRef.current) {
      audioRef.current.volume = vol
    }
  }, [])

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentTrack,
        tracks,
        play,
        pause,
        next,
        previous,
        setVolume,
        volume,
      }}
    >
      {children}
      <audio ref={audioRef} src={tracks[currentTrack]?.url} />
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider")
  }
  return context
}
