// app/assets/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelButton } from "@/components/pixel-button"
import { PixelModal } from "@/components/pixel-modal"
import { PortfolioSelector } from "@/components/portfolio-selector"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useGoogleDrive } from "@/hooks/use-google-drive"
import { useFileUpload } from "@/hooks/use-file-upload"
import { Cloud, CheckCircle, XCircle, Loader2 } from "lucide-react"

type AssetType = "all" | "wallpaper" | "icon" | "music" | "sound"

interface Asset {
  id: number
  fileId: string
  name: string
  type: AssetType
  size: string
  fileSize: number
  date: string
  url: string
  thumbnailUrl?: string
  portfolioId: number
}

interface Portfolio {
  id: number
  name: string
  slug: string
  isPublished: boolean
}

export default function AssetsPage() {
  const [activeFilter, setActiveFilter] = useState<AssetType>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssets, setSelectedAssets] = useState<number[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [currentPortfolioId, setCurrentPortfolioId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const { connected, loading: driveLoading, connectDrive } = useGoogleDrive()
  const { uploadFile, deleteFile, uploading, error: uploadError } = useFileUpload()

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    assetId: number | null
  }>({
    isOpen: false,
    assetId: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const filters: { id: AssetType; label: string }[] = [
    { id: "all", label: "ALL" },
    { id: "wallpaper", label: "WALLPAPERS" },
    { id: "icon", label: "ICONS" },
    { id: "music", label: "MUSIC" },
    { id: "sound", label: "SOUNDS" },
  ]

  // Fetch portfolios on mount
  useEffect(() => {
    fetchPortfolios()
  }, [])

  // Fetch assets when portfolio changes
  useEffect(() => {
    if (currentPortfolioId) {
      fetchAssets()
    }
  }, [currentPortfolioId])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolio/list')
      if (response.ok) {
        const data = await response.json()
        setPortfolios(data.portfolios || [])

        if (data.portfolios.length > 0 && !currentPortfolioId) {
          setCurrentPortfolioId(data.portfolios[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error)
    }
  }

  const fetchAssets = async () => {
    if (!currentPortfolioId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/assets?portfolioId=${currentPortfolioId}`)
      if (response.ok) {
        const data = await response.json()
        setAssets(data.assets || [])
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePortfolioChange = (portfolioId: number) => {
    setCurrentPortfolioId(portfolioId)
  }

  const handlePortfolioCreated = (newPortfolio: Portfolio) => {
    setPortfolios(prev => [...prev, newPortfolio])
    setCurrentPortfolioId(newPortfolio.id)
    // Assets will be automatically fetched due to the useEffect dependency
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesFilter = activeFilter === "all" || asset.type === activeFilter
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const toggleAssetSelection = (id: number) => {
    setSelectedAssets((prev) =>
        prev.includes(id)
            ? prev.filter((assetId) => assetId !== id)
            : [...prev, id]
    )
  }

  // File upload handler
  const handleFileUpload = async (files: File[]) => {
    if (!connected) {
      alert('Please connect your Google Drive first!')
      return
    }

    if (!currentPortfolioId) {
      alert('Please select a portfolio first')
      return
    }

    for (const file of files) {
      const assetType = getFileType(file)
      const result = await uploadFile(file, assetType, currentPortfolioId)

      if (result.success) {
        // Refresh assets list
        await fetchAssets()
      } else {
        console.error('Failed to upload:', file.name, result.error)
      }
    }

    setIsUploadModalOpen(false)
  }

  const getFileType = (file: File): "wallpaper" | "icon" | "image" | "audio" => {
    if (file.type.startsWith('image/')) {
      // Simple heuristic: icons are usually smaller
      return file.size < 100000 ? 'icon' : 'wallpaper'
    } else if (file.type.startsWith('audio/')) {
      // Simple heuristic: sounds are usually shorter
      return 'audio'
    }
    return 'wallpaper'
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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

  const confirmDelete = async () => {
    if (deleteConfirmation.assetId) {
      const asset = assets.find(a => a.id === deleteConfirmation.assetId)
      if (asset) {
        const result = await deleteFile(asset.fileId)
        if (result.success) {
          setAssets(assets.filter(a => a.id !== deleteConfirmation.assetId))
          setSelectedAssets(selectedAssets.filter(id => id !== deleteConfirmation.assetId))
        }
      }
    }
    setDeleteConfirmation({ isOpen: false, assetId: null })
  }

  // Bulk delete handler
  const handleBulkDelete = () => {
    if (selectedAssets.length > 0) {
      setDeleteConfirmation({ isOpen: true, assetId: -1 })
    }
  }

  const confirmBulkDelete = async () => {
    for (const assetId of selectedAssets) {
      const asset = assets.find(a => a.id === assetId)
      if (asset) {
        await deleteFile(asset.fileId)
      }
    }

    setAssets(assets.filter(asset => !selectedAssets.includes(asset.id)))
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
      case "wallpaper": return "🖼️"
      case "icon": return "🎨"
      case "music": return "🎵"
      case "sound": return "🔊"
      default: return "📄"
    }
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg pixel-text-shadow mb-2">ASSET LIBRARY</h2>
            <p className="text-[10px] text-muted-foreground">
              MANAGE YOUR WALLPAPERS, ICONS, AND MUSIC
            </p>
          </div>

          <div className="flex gap-3">
            {!connected && (
                <PixelButton
                    variant="secondary"
                    className="text-[10px] flex items-center gap-2"
                    onClick={connectDrive}
                    disabled={driveLoading}
                >
                  <Cloud className="w-4 h-4" />
                  {driveLoading ? 'CONNECTING...' : 'CONNECT DRIVE'}
                </PixelButton>
            )}
            <PixelButton
                variant="primary"
                className="text-[10px]"
                onClick={() => setIsUploadModalOpen(true)}
                disabled={!connected}
            >
              + UPLOAD ASSET
            </PixelButton>
          </div>
        </div>

        {/* Drive Status Banner */}
        {!connected && (
            <PixelCard className="border-yellow-500">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-yellow-500" />
                  <div>
                    <p className="text-[10px] font-bold">GOOGLE DRIVE NOT CONNECTED</p>
                    <p className="text-[8px] text-muted-foreground">
                      Connect your Google Drive to upload and manage assets
                    </p>
                  </div>
                </div>
                <PixelButton
                    variant="primary"
                    className="text-[10px]"
                    onClick={connectDrive}
                >
                  CONNECT NOW
                </PixelButton>
              </div>
            </PixelCard>
        )}

        {/* Portfolio Selector Component */}
        <PortfolioSelector
            portfolios={portfolios}
            currentPortfolioId={currentPortfolioId}
            onPortfolioChange={handlePortfolioChange}
            onPortfolioCreated={handlePortfolioCreated}
        />

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
                            activeFilter === filter.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-card hover:bg-muted"
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
                    <PixelButton
                        variant="secondary"
                        className="text-[10px] px-3 py-1"
                        onClick={handleBulkDownload}
                    >
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

        {/* Upload Area */}
        {connected && currentPortfolioId && (
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
                <p className="text-[10px] text-muted-foreground">
                  SUPPORTED: PNG, JPG, SVG, MP3, WAV
                </p>
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
        )}

        {/* Loading State */}
        {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )}

        {/* Asset Grid */}
        {!loading && currentPortfolioId && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                  <PixelCard key={asset.id} className="relative">
                    <div className="space-y-3">
                      <div className="absolute top-4 left-4 z-10">
                        <button
                            onClick={() => toggleAssetSelection(asset.id)}
                            className={`w-6 h-6 border-2 border-border ${
                                selectedAssets.includes(asset.id) ? "bg-primary" : "bg-card"
                            } flex items-center justify-center`}
                        >
                          {selectedAssets.includes(asset.id) && (
                              <span className="text-[10px]">✓</span>
                          )}
                        </button>
                      </div>

                      <div className="aspect-square bg-muted border-2 border-border flex items-center justify-center text-4xl overflow-hidden">
                        {asset.url && asset.type !== "music" && asset.type !== "sound" ? (
                            <img
                                src={asset.thumbnailUrl || asset.url}
                                alt={asset.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            getAssetIcon(asset.type)
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-[10px] pixel-text-shadow truncate">
                          {asset.name}
                        </h4>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>{formatFileSize(asset.fileSize)}</span>
                          <span>{new Date(asset.date).toLocaleDateString()}</span>
                        </div>
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
        )}

        {/* Empty State */}
        {!loading && (!currentPortfolioId || filteredAssets.length === 0) && (
            <PixelCard>
              <div className="text-center py-12 space-y-4">
                <div className="text-4xl">
                  {!currentPortfolioId ? "📁" : "🖼️"}
                </div>
                <h4 className="text-sm pixel-text-shadow">
                  {!currentPortfolioId ? "NO PORTFOLIO SELECTED" : "NO ASSETS FOUND"}
                </h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {!currentPortfolioId
                      ? "SELECT A PORTFOLIO OR CREATE A NEW ONE TO MANAGE ASSETS"
                      : searchQuery
                          ? "TRY A DIFFERENT SEARCH TERM"
                          : "UPLOAD YOUR FIRST ASSET TO GET STARTED"
                  }
                </p>
              </div>
            </PixelCard>
        )}

        {/* Upload Error */}
        {uploadError && (
            <div className="fixed bottom-4 right-4 p-4 bg-red-500 border-2 border-red-700 text-white text-[10px] max-w-sm">
              ERROR: {uploadError}
            </div>
        )}

        {/* Uploading Indicator */}
        {uploading && (
            <div className="fixed bottom-4 right-4 p-4 bg-primary border-2 border-border text-primary-foreground text-[10px] flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              UPLOADING...
            </div>
        )}

        {/* View Modal */}
        <PixelModal
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            title={viewingAsset?.name || ""}
        >
          {viewingAsset && (
              <div className="space-y-4">
                {viewingAsset.type !== "music" && viewingAsset.type !== "sound" && viewingAsset.url ? (
                    <img
                        src={viewingAsset.url}
                        alt={viewingAsset.name}
                        className="w-full border-2 border-border"
                    />
                ) : viewingAsset.type === "music" || viewingAsset.type === "sound" ? (
                    <audio controls className="w-full">
                      <source src={viewingAsset.url} />
                    </audio>
                ) : (
                    <div className="aspect-video bg-muted border-2 border-border flex items-center justify-center text-4xl">
                      {getAssetIcon(viewingAsset.type)}
                    </div>
                )}
                <div className="space-y-2 text-[10px]">
                  <p><strong>TYPE:</strong> {viewingAsset.type.toUpperCase()}</p>
                  <p><strong>SIZE:</strong> {formatFileSize(viewingAsset.fileSize)}</p>
                  <p><strong>DATE:</strong> {new Date(viewingAsset.date).toLocaleString()}</p>
                  <p><strong>FILE ID:</strong> {viewingAsset.fileId}</p>
                </div>
              </div>
          )}
        </PixelModal>

        {/* Delete Confirmation */}
        <DeleteConfirmationModal
            isOpen={deleteConfirmation.isOpen}
            onClose={() => setDeleteConfirmation({ isOpen: false, assetId: null })}
            onConfirm={deleteConfirmation.assetId === -1 ? confirmBulkDelete : confirmDelete}
            title="DELETE ASSET?"
            message={
              deleteConfirmation.assetId === -1
                  ? `ARE YOU SURE YOU WANT TO DELETE ${selectedAssets.length} SELECTED ASSETS? THIS WILL REMOVE THEM FROM GOOGLE DRIVE.`
                  : "ARE YOU SURE YOU WANT TO DELETE THIS ASSET? THIS WILL REMOVE IT FROM GOOGLE DRIVE."
            }
        />
      </div>
  )
}