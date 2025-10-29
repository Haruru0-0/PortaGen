"use client"

import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { useState } from "react"
import { useAudio } from "./audio-context"
import { useAppSound } from "./sound-context"

interface MusicPlayerWidgetProps {
  isDesktop: boolean
  icon?: string
}

export default function MusicPlayerWidget({ isDesktop, icon }: MusicPlayerWidgetProps) {
  const { isPlaying, currentTrack, tracks, play, pause, next, previous, volume, setVolume } = useAudio()
  const { playClickSound } = useAppSound()
  const [showVolume, setShowVolume] = useState(false)

  const handlePlayPause = () => {
    playClickSound()
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleNext = () => {
    playClickSound()
    next()
  }

  const handlePrevious = () => {
    playClickSound()
    previous()
  }

  if (isDesktop) {
    return (
      <div
        className="fixed bottom-16 right-4 w-80 border-2 rounded-lg p-4 shadow-lg pointer-events-auto"
        style={{
          backgroundColor: "var(--theme-background, rgba(255, 255, 255, 0.2))",
          backdropFilter: "blur(10px)",
          borderColor: "var(--theme-accent, rgba(255, 255, 255, 0.3))",
          color: "var(--theme-text, white)",
          fontFamily: "var(--theme-font, inherit)",
        }}
      >
        <div className="flex items-center gap-3">
          {icon ? (
            <img src={icon || "/placeholder.svg"} alt="Music" className="w-12 h-12 rounded object-cover" />
          ) : (
            <div
              className="w-12 h-12 rounded flex items-center justify-center font-bold"
              style={{
                background: `linear-gradient(to bottom right, var(--theme-primary, #ec4899), var(--theme-secondary, #a855f7))`,
                color: "var(--theme-text, white)",
              }}
            >
              ♪
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--theme-text, white)" }}>
              {tracks[currentTrack]?.title || "No track"}
            </p>
            <p className="text-xs truncate opacity-70" style={{ color: "var(--theme-text, white)" }}>
              {tracks[currentTrack]?.artist || "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={handlePrevious}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "var(--theme-accent, rgba(255, 255, 255, 0.2))",
            }}
          >
            <SkipBack className="w-4 h-4" style={{ color: "var(--theme-text, white)" }} />
          </button>
          <button
            onClick={handlePlayPause}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "var(--theme-primary, rgba(255, 255, 255, 0.3))",
            }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" style={{ color: "var(--theme-text, white)" }} />
            ) : (
              <Play className="w-5 h-5 ml-0.5" style={{ color: "var(--theme-text, white)" }} />
            )}
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{
              backgroundColor: "var(--theme-accent, rgba(255, 255, 255, 0.2))",
            }}
          >
            <SkipForward className="w-4 h-4" style={{ color: "var(--theme-text, white)" }} />
          </button>
          <div className="relative ml-2">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: "var(--theme-accent, rgba(255, 255, 255, 0.2))",
              }}
            >
              <Volume2 className="w-4 h-4" style={{ color: "var(--theme-text, white)" }} />
            </button>
            {showVolume && (
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-lg p-2"
                style={{
                  backgroundColor: "var(--theme-background, rgba(255, 255, 255, 0.2))",
                  backdropFilter: "blur(10px)",
                }}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                  className="w-24 h-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full border-2 rounded-lg p-3 shadow-lg"
      style={{
        backgroundColor: "var(--theme-background, rgba(255, 255, 255, 0.2))",
        backdropFilter: "blur(10px)",
        borderColor: "var(--theme-accent, rgba(255, 255, 255, 0.3))",
        color: "var(--theme-text, white)",
        fontFamily: "var(--theme-font, inherit)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon ? (
          <img src={icon || "/placeholder.svg"} alt="Music" className="w-10 h-10 rounded object-cover" />
        ) : (
          <div
            className="w-10 h-10 rounded flex items-center justify-center font-bold text-sm"
            style={{
              background: `linear-gradient(to bottom right, var(--theme-primary, #ec4899), var(--theme-secondary, #a855f7))`,
              color: "var(--theme-text, white)",
            }}
          >
            ♪
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: "var(--theme-text, white)" }}>
            {tracks[currentTrack]?.title || "No track"}
          </p>
          <p className="text-[10px] truncate opacity-70" style={{ color: "var(--theme-text, white)" }}>
            {tracks[currentTrack]?.artist || "Unknown"}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handlePrevious}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: "var(--theme-accent, rgba(255, 255, 255, 0.2))",
          }}
        >
          <SkipBack className="w-3 h-3" style={{ color: "var(--theme-text, white)" }} />
        </button>
        <button
          onClick={handlePlayPause}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: "var(--theme-primary, rgba(255, 255, 255, 0.3))",
          }}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" style={{ color: "var(--theme-text, white)" }} />
          ) : (
            <Play className="w-4 h-4 ml-0.5" style={{ color: "var(--theme-text, white)" }} />
          )}
        </button>
        <button
          onClick={handleNext}
          className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
          style={{
            backgroundColor: "var(--theme-accent, rgba(255, 255, 255, 0.2))",
          }}
        >
          <SkipForward className="w-3 h-3" style={{ color: "var(--theme-text, white)" }} />
        </button>
      </div>
    </div>
  )
}
