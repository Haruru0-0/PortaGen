"use client"

import { useState } from "react"
import { PixelModal } from "./pixel-modal"
import { PixelButton } from "./pixel-button"
import { Play, Pause } from "lucide-react"

interface Asset {
  id: string
  name: string
  url: string
  thumbnail?: string
  category?: string
}

interface AssetLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  assets: Asset[]
  type: "sound" | "wallpaper" | "icon" | "music"
  onSelect: (asset: Asset) => void
}

export function AssetLibraryModal({ isOpen, onClose, assets, type, onSelect }: AssetLibraryModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null)

  const handleSelect = () => {
    if (selectedAsset) {
      onSelect(selectedAsset)
      onClose()
    }
  }

  const handlePlaySound = (url: string) => {
    if (playingAudio) {
      playingAudio.pause()
      setPlayingAudio(null)
    }

    const audio = new Audio(url)
    audio.play()
    setPlayingAudio(audio)

    audio.onended = () => setPlayingAudio(null)
  }

  return (
    <PixelModal isOpen={isOpen} onClose={onClose} title={`CHOOSE ${type.toUpperCase()}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {assets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className={`p-3 border-2 transition-colors ${
                selectedAsset?.id === asset.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
              }`}
            >
              {type === "wallpaper" && (
                <img
                  src={asset.thumbnail || asset.url || "/placeholder.svg"}
                  alt={asset.name}
                  className="w-full aspect-video object-cover mb-2 border-2 border-border"
                />
              )}
              {type === "icon" && (
                <img
                  src={asset.url || "/placeholder.svg"}
                  alt={asset.name}
                  className="w-16 h-16 mx-auto mb-2 border-2 border-border object-cover"
                />
              )}
              {(type === "sound" || type === "music") && (
                <div className="flex items-center justify-center mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePlaySound(asset.url)
                    }}
                    className="w-12 h-12 border-2 border-border bg-primary hover:bg-primary/80 flex items-center justify-center"
                  >
                    {playingAudio?.src === asset.url ? (
                      <Pause className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <Play className="w-5 h-5 text-primary-foreground" />
                    )}
                  </button>
                </div>
              )}
              <p className="text-[10px] text-center truncate">{asset.name}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2 border-t-2 border-border">
          <PixelButton variant="secondary" className="flex-1 text-[10px]" onClick={onClose}>
            CANCEL
          </PixelButton>
          <PixelButton
            variant="primary"
            className="flex-1 text-[10px]"
            onClick={handleSelect}
            disabled={!selectedAsset}
          >
            SELECT
          </PixelButton>
        </div>
      </div>
    </PixelModal>
  )
}
