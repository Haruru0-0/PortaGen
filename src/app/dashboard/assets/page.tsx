"use client"

import { useState, useRef } from "react"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelModal } from "@/components/pixel-modal"
import { FileUpload } from "@/components/file-upload"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"

type AssetType = "all" | "wallpapers" | "icons" | "music"

interface Asset {
  id: number
  name: string
  type: string
  size: string
  date: string
  url: string
}

export default function AssetsPage() {
  const [activeFilter, setActiveFilter] = useState<AssetType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssets, setSelectedAssets] = useState<number[]>([])
  const [assets, setAssets] = useState<Asset[]>([
    { id: 1, name: "SUNSET.PNG", type: "wallpapers", size: "2.4 MB", date: "2024-01-15", url: "/placeholder.svg" },
    { id: 2, name: "OCEAN.PNG", type: "wallpapers", size: "3.1 MB", date: "2024-01-14", url: "/placeholder.svg" },
    { id: 3, name: "ABOUT_ICON.PNG", type: "icons", size: "24 KB", date: "2024-01-13", url: "/placeholder.svg" },
    { id: 4, name: "PROJECT_ICON.PNG", type: "icons", size: "28 KB", date: "2024-01-13", url: "/placeholder.svg" },
    { id: 5, name: "CHIPTUNE.MP3", type: "music", size: "4.2 MB", date: "2024-01-12", url: "" },
    { id: 6, name: "RETRO_BEAT.MP3", type: "music", size: "3.8 MB", date: "2024-01-11", url: "" },
  ])

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; assetId: number | null }>({
    isOpen: false,
    assetId: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filters: { id: AssetType; label: string }[] = [
    { id: "all", label: "ALL" },
    { id: "wallpapers", label: "WALLPAPERS" },
    { id: "icons", label: "ICONS" },
    { id: "music", label: "MUSIC" },
  ]

  const filteredAssets = assets.filter((asset) => {
    const matchesFilter = activeFilter === "all" || asset.type === activeFilter
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const toggleAssetSelection = (id: number) => {
    setSelectedAssets((prev) => (prev.includes(id) ? prev.filter((assetId) => assetId !== id) : [...prev, id]))
  }

  // File upload handler
  const handleFileUpload = (files: File[]) => {
    const newAssets = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name.toUpperCase(),
      type: file.type.startsWith("image/") ? "wallpapers" : file.type.startsWith("audio/") ? "music" : "icons",
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      date: new Date().toISOString().split("T")[0],
      url: URL.createObjectURL(file),
    }))
    setAssets([...assets, ...newAssets])
    setIsUploadModalOpen(false)
  }

  // View handler
  const handleView = (asset: Asset) => {
    setViewingAsset(asset)
    setIsViewModalOpen(true)
  }

  // Download handler
  const handleDownload = (asset: Asset) => {
    const link = document.createElement("a")
    link.href = asset.url
    link.download = asset.name
    link.click()
  }

  // Delete handler
  const handleDelete = (assetId: number) => {
    setDeleteConfirmation({ isOpen: true, assetId })
  }

  const confirmDelete = () => {
    if (deleteConfirmation.assetId) {
      setAssets(assets.filter((asset) => asset.id !== deleteConfirmation.assetId))
      setSelectedAssets(selectedAssets.filter((id) => id !== deleteConfirmation.assetId))
    }
    setDeleteConfirmation({ isOpen: false, assetId: null })
  }

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (selectedAssets.length > 0) {
      setDeleteConfirmation({ isOpen: true, assetId: -1 })
    }
  }

  const confirmBulkDelete = () => {
    setAssets(assets.filter((asset) => !selectedAssets.includes(asset.id)))
    setSelectedAssets([])
    setDeleteConfirmation({ isOpen: false, assetId: null })
  }

  // Bulk download handler
  const handleBulkDownload = () => {
    selectedAssets.forEach((id) => {
      const asset = assets.find((a) => a.id === id)
      if (asset) handleDownload(asset)
    })
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "wallpapers":
        return "🖼️"
      case "icons":
        return "🎨"
      case "music":
        return "🎵"
      default:
        return "📄"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg pixel-text-shadow mb-2">ASSET LIBRARY</h2>
          <p className="text-[10px] text-muted-foreground">MANAGE YOUR WALLPAPERS, ICONS, AND MUSIC</p>
        </div>
        <PixelButton variant="primary" className="text-[10px]" onClick={() => setIsUploadModalOpen(true)}>
          + UPLOAD ASSET
        </PixelButton>
      </div>

      {/* Filters and Search */}
      <PixelCard>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 text-[10px] border-2 border-border ${
                    activeFilter === filter.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-muted"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1">
              <PixelInput
                placeholder="SEARCH ASSETS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {selectedAssets.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-accent border-2 border-border">
              <span className="text-[10px]">{selectedAssets.length} SELECTED</span>
              <div className="flex gap-2">
                <PixelButton variant="secondary" className="text-[10px] px-3 py-1" onClick={handleBulkDownload}>
                  DOWNLOAD
                </PixelButton>
                <PixelButton
                  variant="primary"
                  className="text-[10px] px-3 py-1 bg-destructive border-destructive"
                  onClick={handleBulkDelete}
                >
                  DELETE
                </PixelButton>
              </div>
              <button
                onClick={() => setSelectedAssets([])}
                className="ml-auto text-[10px] text-muted-foreground hover:text-foreground"
              >
                CLEAR
              </button>
            </div>
          )}
        </div>
      </PixelCard>

      <PixelCard>
        <div
          className="border-4 border-dashed border-border p-12 text-center space-y-4 hover:bg-muted cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="text-4xl">⬆️</div>
          <div>
            <p className="text-sm pixel-text-shadow mb-2">DRAG & DROP FILES HERE</p>
            <p className="text-[10px] text-muted-foreground">OR CLICK TO BROWSE</p>
          </div>
          <p className="text-[10px] text-muted-foreground">SUPPORTED: PNG, JPG, SVG, MP3, WAV</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,audio/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                handleFileUpload(Array.from(e.target.files))
              }
            }}
          />
        </div>
      </PixelCard>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <PixelCard key={asset.id} className="relative">
            <div className="space-y-3">
              <div className="absolute top-4 left-4 z-10">
                <button
                  onClick={() => toggleAssetSelection(asset.id)}
                  className={`w-6 h-6 border-2 border-border ${selectedAssets.includes(asset.id) ? "bg-primary" : "bg-card"} flex items-center justify-center`}
                >
                  {selectedAssets.includes(asset.id) && <span className="text-[10px]">✓</span>}
                </button>
              </div>

              <div className="aspect-square bg-muted border-2 border-border flex items-center justify-center text-4xl">
                {asset.url && asset.type !== "music" ? (
                  <img src={asset.url || "/placeholder.svg"} alt={asset.name} className="w-full h-full object-cover" />
                ) : (
                  getAssetIcon(asset.type)
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] pixel-text-shadow truncate">{asset.name}</h4>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{asset.size}</span>
                  <span>{asset.date}</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-2 flex-1 bg-primary border border-border" />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground text-center">UPLOADED</p>
              </div>

              <div className="flex gap-2">
                <PixelButton
                  variant="secondary"
                  className="flex-1 text-[10px] px-2 py-1"
                  onClick={() => handleView(asset)}
                >
                  VIEW
                </PixelButton>
                <button
                  className="w-8 h-8 border-2 border-border bg-card hover:bg-muted text-[10px]"
                  onClick={() => handleDownload(asset)}
                  title="Download"
                >
                  ⬇️
                </button>
                <button
                  className="w-8 h-8 border-2 border-border bg-card hover:bg-destructive text-[10px]"
                  onClick={() => handleDelete(asset.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </PixelCard>
        ))}
      </div>

      {/* Empty State */}
      {filteredAssets.length === 0 && (
        <PixelCard>
          <div className="text-center py-12 space-y-4">
            <div className="text-4xl">📁</div>
            <h4 className="text-sm pixel-text-shadow">NO ASSETS FOUND</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {searchQuery ? "TRY A DIFFERENT SEARCH TERM" : "UPLOAD YOUR FIRST ASSET TO GET STARTED"}
            </p>
          </div>
        </PixelCard>
      )}

      <PixelModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="UPLOAD ASSETS">
        <FileUpload
          accept="image/*,audio/*"
          multiple
          onUpload={handleFileUpload}
          label="DRAG & DROP FILES OR CLICK TO BROWSE"
        />
      </PixelModal>

      <PixelModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={viewingAsset?.name || ""}>
        {viewingAsset && (
          <div className="space-y-4">
            {viewingAsset.type !== "music" && viewingAsset.url ? (
              <img
                src={viewingAsset.url || "/placeholder.svg"}
                alt={viewingAsset.name}
                className="w-full border-2 border-border"
              />
            ) : (
              <div className="aspect-video bg-muted border-2 border-border flex items-center justify-center text-4xl">
                {getAssetIcon(viewingAsset.type)}
              </div>
            )}
            <div className="space-y-2 text-[10px]">
              <p>
                <strong>TYPE:</strong> {viewingAsset.type.toUpperCase()}
              </p>
              <p>
                <strong>SIZE:</strong> {viewingAsset.size}
              </p>
              <p>
                <strong>DATE:</strong> {viewingAsset.date}
              </p>
            </div>
          </div>
        )}
      </PixelModal>

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, assetId: null })}
        onConfirm={deleteConfirmation.assetId === -1 ? confirmBulkDelete : confirmDelete}
        title="DELETE ASSET?"
        message={
          deleteConfirmation.assetId === -1
            ? `ARE YOU SURE YOU WANT TO DELETE ${selectedAssets.length} SELECTED ASSETS? THIS ACTION CANNOT BE UNDONE.`
            : "ARE YOU SURE YOU WANT TO DELETE THIS ASSET? THIS ACTION CANNOT BE UNDONE."
        }
      />
    </div>
  )
}
