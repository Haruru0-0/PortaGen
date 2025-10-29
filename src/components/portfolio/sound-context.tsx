"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"

type SoundContextType = {
  playClickSound: () => void
  playHoverSound: () => void
  playWindowOpenSound: () => void
  playWindowCloseSound: () => void
  playMinimizeSound: () => void
  playMaximizeSound: () => void
  playErrorSound: () => void
  playSuccessSound: () => void
  isMuted: boolean
  toggleMute: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)

  const playSound = useCallback(
    (frequency: number, duration: number) => {
      if (isMuted) return

      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = frequency
        oscillator.type = "sine"

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + duration)
      } catch (error) {
        console.log("[v0] Audio context not available")
      }
    },
    [isMuted],
  )

  const playClickSound = useCallback(() => playSound(800, 0.1), [playSound])
  const playHoverSound = useCallback(() => playSound(600, 0.05), [playSound])
  const playWindowOpenSound = useCallback(() => playSound(1000, 0.2), [playSound])
  const playWindowCloseSound = useCallback(() => playSound(400, 0.2), [playSound])
  const playMinimizeSound = useCallback(() => playSound(700, 0.15), [playSound])
  const playMaximizeSound = useCallback(() => playSound(900, 0.15), [playSound])
  const playErrorSound = useCallback(() => playSound(300, 0.3), [playSound])
  const playSuccessSound = useCallback(() => playSound(1200, 0.2), [playSound])

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), [])

  return (
    <SoundContext.Provider
      value={{
        playClickSound,
        playHoverSound,
        playWindowOpenSound,
        playWindowCloseSound,
        playMinimizeSound,
        playMaximizeSound,
        playErrorSound,
        playSuccessSound,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useAppSound() {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error("useAppSound must be used within SoundProvider")
  }
  return context
}
