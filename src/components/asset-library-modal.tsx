/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { PixelModal } from "./pixel-modal"
import { PixelButton } from "./pixel-button"
import { Play, Pause, Cloud, Image, Music, Zap } from "lucide-react"

interface Asset {
  id: string
  name: string
  url: string
  thumbnail?: string
  category?: string
  type?: "default" | "uploaded"
  portfolioId?: number
  portfolioName?: string
}

interface AssetLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  assets: Asset[]
  type: "sound" | "wallpaper" | "icon" | "music"
  onSelect: (asset: Asset) => void
  currentPortfolioId?: number | null
}

export function AssetLibraryModal({
                                    isOpen,
                                    onClose,
                                    assets,
                                    type,
                                    onSelect,
                                    currentPortfolioId
                                  }: AssetLibraryModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null)
  const [activeTab, setActiveTab] = useState<"default" | "uploaded">("default")
  const [userAssets, setUserAssets] = useState<Asset[]>([])
  const [portfolioFilter, setPortfolioFilter] = useState<"all" | "current">("current")
  const [loading, setLoading] = useState(false)

  // Fetch user's uploaded assets when modal opens
  useEffect(() => {
    if (isOpen && activeTab === "uploaded") {
      fetchUserAssets()
    }
  }, [isOpen, activeTab, portfolioFilter, currentPortfolioId])

  const fetchUserAssets = async () => {
    setLoading(true)
    try {
      let url = `/api/assets?type=${type}`

      if (portfolioFilter === "current" && currentPortfolioId) {
        url += `&portfolioId=${currentPortfolioId}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        // Add type indicator for user assets
        const userAssetsWithType = data.assets?.map((asset: any) => ({
          ...asset,
          type: "uploaded"
        })) || []
        setUserAssets(userAssetsWithType)
      }
    } catch (error) {
      console.error('Failed to fetch user assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = () => {
    if (selectedAsset) {
      onSelect(selectedAsset)
      onClose()
      setSelectedAsset(null)
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

  const getDisplayAssets = () => {
    if (activeTab === "default") {
      return assets.map(asset => ({ ...asset, type: "default" as const }))
    } else {
      return userAssets
    }
  }

  const getTypeIcon = () => {
    switch (type) {
      case "wallpaper": return <Image className="w-4 h-4" />
      case "icon": return <Zap className="w-4 h-4" />
      case "music": return <Music className="w-4 h-4" />
      case "sound": return <Zap className="w-4 h-4" />
      default: return <Image className="w-4 h-4" />
    }
  }

  const displayAssets = getDisplayAssets()

  return (
      <PixelModal isOpen={isOpen} onClose={onClose} title={`CHOOSE ${type.toUpperCase()}`}>
        <div className="space-y-4">
          {/* Tabs for Default vs User Assets */}
          <div className="flex gap-2 border-b-2 border-border pb-2">
            <button
                onClick={() => {
                  setActiveTab("default")
                  setSelectedAsset(null)
                }}
                className={`px-4 py-2 text-[10px] border-2 border-border transition-colors flex items-center gap-2 ${
                    activeTab === "default"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted"
                }`}
            >
              {getTypeIcon()}
              DEFAULT
            </button>
            <button
                onClick={() => {
                  setActiveTab("uploaded")
                  setSelectedAsset(null)
                }}
                className={`px-4 py-2 text-[10px] border-2 border-border transition-colors flex items-center gap-2 ${
                    activeTab === "uploaded"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-muted"
                }`}
            >
              <Cloud className="w-4 h-4" />
              MY UPLOADS
            </button>
          </div>

          {/* Portfolio Filter for User Assets */}
          {activeTab === "uploaded" && (
              <div className="flex gap-2">
                <button
                    onClick={() => setPortfolioFilter("current")}
                    className={`px-3 py-1 text-[10px] border-2 border-border transition-colors ${
                        portfolioFilter === "current"
                            ? "bg-accent text-accent-foreground"
                            : "bg-card hover:bg-muted"
                    }`}
                    disabled={!currentPortfolioId}
                >
                  CURRENT PORTFOLIO
                </button>
                <button
                    onClick={() => setPortfolioFilter("all")}
                    className={`px-3 py-1 text-[10px] border-2 border-border transition-colors ${
                        portfolioFilter === "all"
                            ? "bg-accent text-accent-foreground"
                            : "bg-card hover:bg-muted"
                    }`}
                >
                  ALL PORTFOLIOS
                </button>
              </div>
          )}

          {/* Asset Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {loading ? (
                <div className="col-span-2 flex justify-center items-center py-8">
                  <div className="text-[10px] text-muted-foreground">LOADING ASSETS...</div>
                </div>
            ) : displayAssets.length === 0 ? (
                <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                  <div className="text-2xl mb-2">
                    {activeTab === "default" ? "📁" : "☁️"}
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    {activeTab === "default"
                        ? "NO DEFAULT ASSETS AVAILABLE"
                        : "NO UPLOADED ASSETS FOUND"}
                  </p>
                  {activeTab === "uploaded" && portfolioFilter === "current" && !currentPortfolioId && (
                      <p className="text-[8px] text-muted-foreground">
                        SELECT A PORTFOLIO TO SEE ASSETS
                      </p>
                  )}
                </div>
            ) : (
                displayAssets.map((asset) => (
                    <button
                        key={`${asset.type}-${asset.id}`}
                        onClick={() => setSelectedAsset(asset)}
                        className={`p-3 border-2 transition-colors relative ${
                            selectedAsset?.id === asset.id && selectedAsset?.type === asset.type
                                ? "border-primary bg-primary/10"
                                : "border-border bg-card hover:bg-muted"
                        }`}
                    >
                      {/* Type Badge */}
                      {asset.type === "uploaded" && (
                          <div className="absolute top-1 right-1 bg-blue-500 text-white text-[8px] px-1 py-0.5">
                            MY
                          </div>
                      )}

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
                      {asset.portfolioName && asset.type === "uploaded" && (
                          <p className="text-[8px] text-muted-foreground text-center truncate">
                            {asset.portfolioName}
                          </p>
                      )}
                    </button>
                ))
            )}
          </div>

          {/* Selection Info */}
          {selectedAsset && (
              <div className="p-3 border-2 border-border bg-muted">
                <p className="text-[10px]">
                  SELECTED: <strong>{selectedAsset.name}</strong>
                  {selectedAsset.type === "uploaded" && " (Your Upload)"}
                </p>
              </div>
          )}

          {/* Action Buttons */}
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