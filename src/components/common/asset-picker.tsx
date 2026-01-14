"use client"

import { useEffect, useState } from "react"
import { PixelModal } from "@/components/pixel-modal"
import { PixelButton } from "@/components/pixel-button"
import { PixelInput } from "@/components/pixel-input"
import { Loader2, Music, Zap, FileImage } from "lucide-react"
import Image from "next/image"
import { Asset } from "@/lib/types"

interface AssetPickerProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (asset: Asset) => void
    type?: "all" | "image" | "audio" | "wallpaper" | "icon" | "music" | "sound" // Filter type
}

export function AssetPicker({ isOpen, onClose, onSelect, type = "all" }: AssetPickerProps) {
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)

    useEffect(() => {
        if (isOpen) {
            fetchAssets()
            setSelectedAssetId(null)
            setSearchQuery("")
        }
    }, [isOpen])

    const getOptimizedDriveUrl = (fileId: string, type: 'display' | 'download' | 'thumbnail' = 'display') => {
        switch (type) {
            case 'thumbnail':
                return `https://drive.google.com/thumbnail?id=${fileId}&sz=w300-h300`
            case 'download':
                return `https://drive.google.com/uc?export=download&id=${fileId}`
            case 'display':
            default:
                return `https://drive.google.com/uc?id=${fileId}`
        }
    }

    const fetchAssets = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/assets`)
            if (response.ok) {
                const data = await response.json()
                const assetsWithFixedUrls = data.assets.map((asset: any) => ({
                    ...asset,
                    url: asset.url || getOptimizedDriveUrl(asset.fileId, 'display'),
                    thumbnailUrl: asset.thumbnailUrl || getOptimizedDriveUrl(asset.fileId, 'thumbnail'),
                    mimeType: asset.mimeType
                }))
                setAssets(assetsWithFixedUrls || [])
            }
        } catch (error) {
            console.error('Failed to fetch assets:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredAssets = assets.filter((asset) => {
        const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())

        let matchesType = true
        if (type === "image") {
            // General image category: show wallpapers and icons
            matchesType = asset.type === "wallpaper" || asset.type === "icon"
        } else if (type === "audio") {
            // General audio category: show music and sounds
            matchesType = asset.type === "music" || asset.type === "sound"
        } else if (type !== "all") {
            // Specific type: show only exact matches (wallpaper, icon, music, or sound)
            matchesType = asset.type === type
        }

        return matchesType && matchesSearch
    })

    const handleSelect = () => {
        const asset = assets.find(a => a.id === selectedAssetId)
        if (asset) {
            onSelect(asset)
            onClose()
        }
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <PixelModal isOpen={isOpen} onClose={onClose} title="SELECT ASSET">
            <div className="space-y-4 h-[60vh] flex flex-col">
                <div className="shrink-0">
                    <PixelInput
                        placeholder="SEARCH ASSETS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto border-2 border-border p-4 bg-muted/30">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-full text-muted-foreground space-y-2">
                            <div className="text-4xl">📂</div>
                            <p className="text-[10px]">NO ASSETS FOUND</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {filteredAssets.map((asset) => {
                                const isSelected = selectedAssetId === asset.id
                                const isImage = asset.type === "wallpaper" || asset.type === "icon"

                                return (
                                    <button
                                        key={asset.id}
                                        onClick={() => setSelectedAssetId(asset.id)}
                                        className={`relative group border-2 text-left p-2 transition-all cursor-pointer flex flex-col gap-2 ${isSelected
                                            ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-background"
                                            : "border-border bg-card hover:border-primary/50"
                                            }`}
                                    >
                                        <div className="aspect-square relative bg-muted border border-border overflow-hidden">
                                            {isImage ? (
                                                <Image
                                                    src={`https://drive.google.com/thumbnail?id=${asset.fileId}` || `https://drive.google.com/uc?id=${asset.fileId}`}
                                                    alt={asset.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="150px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl text-muted-foreground">
                                                    {asset.type === "music" ? <Music /> : <Zap />}
                                                </div>
                                            )}
                                            {asset.type === "wallpaper" && (
                                                <div className="absolute top-1 right-1 bg-background/80backdrop-blur-sm p-1 rounded border border-border">
                                                    <FileImage className="w-3 h-3" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="w-full">
                                            <p className="text-[10px] font-bold truncate">{asset.name}</p>
                                            <div className="flex justify-between items-center text-[8px] text-muted-foreground">
                                                <span>{asset.type.toUpperCase()}</span>
                                                <span>{formatFileSize(asset.fileSize)}</span>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="shrink-0 pt-2 flex gap-3">
                    <PixelButton
                        variant="secondary"
                        className="flex-1 text-[10px]"
                        onClick={onClose}
                    >
                        CANCEL
                    </PixelButton>
                    <PixelButton
                        variant="primary"
                        className="flex-1 text-[10px]"
                        onClick={handleSelect}
                        disabled={!selectedAssetId}
                    >
                        SELECT
                    </PixelButton>
                </div>
            </div>
        </PixelModal>
    )
}
