"use client"

import { useState } from "react"
import { PixelCard } from "./pixel-card"
import { FileUpload } from "./file-upload"
import { Volume2, VolumeX, Play } from "lucide-react"

interface SoundEffect {
  id: string
  name: string
  url: string
  volume: number
}

interface SoundEditorProps {
  sounds: SoundEffect[]
  onSoundsChange: (sounds: SoundEffect[]) => void
}

export function SoundEditor({ sounds, onSoundsChange }: SoundEditorProps) {
  const [soundEffects, setSoundEffects] = useState<SoundEffect[]>(sounds)

  const handleSoundUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file)
    const updated = soundEffects.map((s) => (s.id === id ? { ...s, url } : s))
    setSoundEffects(updated)
    onSoundsChange(updated)
  }

  const handleVolumeChange = (id: string, volume: number) => {
    const updated = soundEffects.map((s) => (s.id === id ? { ...s, volume } : s))
    setSoundEffects(updated)
    onSoundsChange(updated)
  }

  const playSound = (url: string, volume: number) => {
    if (!url) return
    const audio = new Audio(url)
    audio.volume = volume / 100
    audio.play()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm pixel-text-shadow">SOUND EFFECTS</h3>

      {soundEffects.map((sound) => (
        <PixelCard key={sound.id}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-bold">{sound.name}</h4>
              {sound.url && (
                <button
                  onClick={() => playSound(sound.url, sound.volume)}
                  className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                >
                  <Play className="w-3 h-3" />
                </button>
              )}
            </div>

            <FileUpload
              accept="audio/*"
              onFileSelect={(file) => handleSoundUpload(sound.id, file)}
              preview={sound.url}
              label="UPLOAD SOUND"
              maxSize={2}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[8px] uppercase flex items-center gap-1">
                  {sound.volume > 0 ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                  VOLUME
                </label>
                <span className="text-[8px]">{sound.volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sound.volume}
                onChange={(e) => handleVolumeChange(sound.id, Number.parseInt(e.target.value))}
                className="w-full h-2 bg-muted border-2 border-border appearance-none cursor-pointer"
              />
            </div>
          </div>
        </PixelCard>
      ))}
    </div>
  )
}
