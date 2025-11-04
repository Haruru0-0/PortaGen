// app/assets/page.tsx
"use client"

import {useEffect, useRef, useState} from "react"
import {PixelCard} from "@/components/pixel-card"
import {PixelInput} from "@/components/pixel-input"
import {PixelButton} from "@/components/pixel-button"
import {PixelModal} from "@/components/pixel-modal"
import {DeleteConfirmationModal} from "@/components/delete-confirmation-modal"
import {useGoogleDrive} from "@/hooks/use-google-drive"
import {useFileUpload} from "@/hooks/use-file-upload"
import {Cloud, FileImage, Loader2, Music, XCircle, Zap} from "lucide-react"
import Image from "next/image";
import {Asset, AssetType} from "@/lib/types"
import AssetCard from "@/components/asset-card";

// Available asset types for user selection
const ASSET_TYPES = [
    {id: "wallpaper", label: "WALLPAPER", icon: FileImage, description: "Background images for your portfolio"},
    {id: "icon", label: "ICON", icon: Zap, description: "Small images for desktop icons"},
    {id: "music", label: "MUSIC", icon: Music, description: "Audio tracks for music player"},
    {id: "sound", label: "SOUND", icon: Music, description: "Sound effects for interactions"},
] as const

export default function AssetsPage() {
    const [activeFilter, setActiveFilter] = useState<AssetType>("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedAssets, setSelectedAssets] = useState<number[]>([])
    const [assets, setAssets] = useState<Asset[]>([])
    const [loading, setLoading] = useState(false)

    const {connected, loading: driveLoading, connectDrive} = useGoogleDrive()
    const {uploadFile, deleteFile, uploading, error: uploadError} = useFileUpload()

    // Modal states
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
    const [viewingAsset, setViewingAsset] = useState<Asset | null>(null)
    const [renamingAsset, setRenamingAsset] = useState<Asset | null>(null)
    const [newAssetName, setNewAssetName] = useState("")
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean
        assetId: number | null
    }>({
        isOpen: false,
        assetId: null,
    })

    // Upload state
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [selectedAssetType, setSelectedAssetType] = useState<"wallpaper" | "icon" | "music" | "sound">("wallpaper")
    const [fileNames, setFileNames] = useState<{ [key: string]: string }>({})

    const fileInputRef = useRef<HTMLInputElement>(null)

    const filters: { id: AssetType; label: string }[] = [
        {id: "all", label: "ALL"},
        {id: "wallpaper", label: "WALLPAPERS"},
        {id: "icon", label: "ICONS"},
        {id: "music", label: "MUSIC"},
        {id: "sound", label: "SOUNDS"},
    ]

    // Fetch assets when portfolio changes
    useEffect(() => {
        fetchAssets()
    }, [])

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

    // File selection handler
    const handleFileSelect = (files: FileList | null) => {
        if (!files) return

        const fileArray = Array.from(files)
        setSelectedFiles(fileArray)
        setIsUploadModalOpen(true)

        // Auto-detect asset type based on first file
        if (fileArray.length > 0) {
            const firstFile = fileArray[0]
            if (firstFile.type.startsWith('audio/')) {
                setSelectedAssetType(firstFile.size < 500000 ? 'sound' : 'music')
            } else if (firstFile.type.startsWith('image/')) {
                setSelectedAssetType(firstFile.size < 100000 ? 'icon' : 'wallpaper')
            }
        }
    }

    // File name change handler
    const handleFileNameChange = (originalName: string, newName: string) => {
        setFileNames(prev => ({
            ...prev,
            [originalName]: newName
        }))
    }

    // File upload handler
    const handleFileUpload = async () => {
        if (!connected) {
            alert('Please connect your Google Drive first!')
            return
        }

        if (selectedFiles.length === 0) {
            alert('Please select files to upload')
            return
        }

        const uploadPromises = selectedFiles.map(async (file) => {
            try {
                // Get custom name or use original name without extension
                const customName = fileNames[file.name] || file.name.replace(/\.[^/.]+$/, "")

                const result = await uploadFile(file, selectedAssetType, customName)

                if (result.success) {
                    return {success: true, file: customName}
                } else {
                    return {success: false, file: customName, error: result.error}
                }
            } catch (error) {
                return {success: false, file: file.name, error: 'Upload failed'}
            }
        })

        const results = await Promise.all(uploadPromises)

        // Show upload summary
        const successful = results.filter(r => r.success).length
        const failed = results.filter(r => !r.success).length

        if (failed > 0) {
            const failedFiles = results.filter(r => !r.success).map(r => r.file).join(', ')
            alert(`Upload completed: ${successful} successful, ${failed} failed\nFailed: ${failedFiles}`)
        } else {
            alert(`Successfully uploaded ${successful} files!`)
        }

        // Refresh assets list
        await fetchAssets()

        // Reset state
        setSelectedFiles([])
        setIsUploadModalOpen(false)
        setSelectedAssetType("wallpaper")
        setFileNames({})
    }

    // Rename asset handler
    const handleRenameStart = (asset: Asset) => {
        setRenamingAsset(asset)
        setNewAssetName(asset.name)
        setIsRenameModalOpen(true)
    }

    const handleRenameConfirm = async () => {
        if (!renamingAsset || !newAssetName.trim()) return

        try {
            const response = await fetch(`/api/assets/${renamingAsset.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newAssetName.trim()
                }),
            })

            if (response.ok) {
                // Update local state
                setAssets(assets.map(asset =>
                    asset.id === renamingAsset.id
                        ? {...asset, name: newAssetName.trim()}
                        : asset
                ))
                setIsRenameModalOpen(false)
                setRenamingAsset(null)
                setNewAssetName("")
            } else {
                alert('Failed to rename asset')
            }
        } catch (error) {
            console.error('Rename error:', error)
            alert('Failed to rename asset')
        }
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

    // Delete handler
    const handleDelete = (assetId: number) => {
        setDeleteConfirmation({isOpen: true, assetId})
    }

    // Bulk delete handler
    const handleBulkDelete = () => {
        if (selectedAssets.length > 0) {
            setDeleteConfirmation({isOpen: true, assetId: -1})
        }
    }

    const handleDownload = (asset: Asset) => {
        const getFileExtension = (mimeType?: string) => {
            if (!mimeType) return 'file'

            const extensions: { [key: string]: string } = {
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg',
                'image/png': 'png',
                'image/gif': 'gif',
                'image/svg+xml': 'svg',
                'image/webp': 'webp',
                'audio/mpeg': 'mp3',
                'audio/wav': 'wav',
                'audio/ogg': 'ogg',
                'audio/mp4': 'm4a',
            }
            return extensions[mimeType] || mimeType.split('/')[1] || 'file'
        }

        const extension = getFileExtension(asset.mimeType)
        const downloadFileName = extension ? `${asset.name}.${extension}` : asset.name

        const downloadUrl = asset.url.includes('export=download')
            ? asset.url
            : `https://drive.google.com/uc?export=download&id=${asset.fileId}`

        const link = document.createElement("a")
        link.href = downloadUrl
        link.target = "_blank"
        link.rel = "noopener noreferrer"

        try {
            link.download = downloadFileName
            link.click()
        } catch (error) {
            console.log('Direct download failed, opening in new tab')
            link.click()
        }
    }

// Also update the bulk download handler
    const handleBulkDownload = () => {
        selectedAssets.forEach((id) => {
            const asset = assets.find((a) => a.id === id)
            if (asset) handleDownload(asset)
        })
    }

    const getAssetIcon = (type: string) => {
        switch (type) {
            case "wallpaper":
                return "🖼️"
            case "icon":
                return "🎨"
            case "music":
                return "🎵"
            case "sound":
                return "🔊"
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
                    <p className="text-[10px] text-muted-foreground">
                        MANAGE YOUR WALLPAPERS, ICONS, AND MUSIC
                    </p>
                </div>

                <div className="flex gap-3">
                    {connected && (
                        <PixelButton
                            variant="primary"
                            className="text-[10px]"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            + UPLOAD ASSET
                        </PixelButton>
                    )}
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,audio/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
            />

            {/* Drive Status Banner */}
            {!connected && (
                <PixelCard className="border-yellow-500">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <XCircle className="w-6 h-6 text-yellow-500"/>
                            <div>
                                <p className="text-[10px] font-bold">GOOGLE DRIVE NOT CONNECTED</p>
                                <p className="text-[8px] text-muted-foreground">
                                    Connect your Google Drive to upload and manage assets
                                </p>
                            </div>
                        </div>
                        <PixelButton
                            variant="primary"
                            className="text-[10px] flex items-center gap-2"
                            onClick={connectDrive}
                            disabled={driveLoading}
                        >
                            <Cloud className="w-4 h-4"/>
                            {driveLoading ? 'CONNECTING...' : 'CONNECT NOW'}
                        </PixelButton>
                    </div>
                </PixelCard>
            )}

            {/* Filters and Search */}
            <PixelCard>
                <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row gap-4">
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

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                </div>
            )}

            {/* Asset Grid */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAssets.map((asset) => (
                        <AssetCard
                            key={asset.id}
                            onToggle={() => toggleAssetSelection(asset.id)}
                            selectedAssets={selectedAssets}
                            asset={asset}
                            assetIcon={getAssetIcon(asset.type)}
                            onRename={() => handleRenameStart(asset)}
                            fileSize={formatFileSize(asset.fileSize)}
                            onView={() => handleView(asset)}
                            onDownload={() => handleDownload(asset)}
                            onDelete={() => handleDelete(asset.id)}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && (filteredAssets.length === 0) && (
                <PixelCard>
                    <div className="text-center py-12 space-y-4">
                        <div className="text-4xl">
                            🖼️
                        </div>
                        <h4 className="text-sm pixel-text-shadow">
                            NO ASSETS FOUND
                        </h4>
                        <p className="text-[10px] text-muted-foreground leading-relaxed">
                            {searchQuery
                                ? "TRY A DIFFERENT SEARCH TERM"
                                : "UPLOAD YOUR FIRST ASSET TO GET STARTED"
                            }
                        </p>
                    </div>
                </PixelCard>
            )}

            {/* Upload Modal */}
            <PixelModal
                isOpen={isUploadModalOpen}
                onClose={() => {
                    setIsUploadModalOpen(false)
                    setSelectedFiles([])
                    setFileNames({})
                }}
                title="UPLOAD ASSETS"
            >
                <div className="space-y-4">
                    {/* Selected Files with Editable Names */}
                    {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                            <label className="block text-xs uppercase tracking-wider">FILES TO UPLOAD</label>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {selectedFiles.map((file, index) => {
                                    const originalName = file.name
                                    const originalNameWithoutExt = originalName.replace(/\.[^/.]+$/, "")
                                    const extension = originalName.split('.').pop()?.toLowerCase() || ''

                                    return (
                                        <div key={index}
                                             className="flex items-center gap-2 p-2 border border-border bg-muted">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-muted-foreground flex-shrink-0">
                              {file.type.startsWith('image/') ? '🖼️' : '🎵'}
                            </span>
                                                    <input
                                                        type="text"
                                                        value={fileNames[file.name] || originalNameWithoutExt}
                                                        onChange={(e) => handleFileNameChange(file.name, e.target.value)}
                                                        className="flex-1 px-2 py-1 text-[10px] bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                                        placeholder="Enter file name"
                                                    />
                                                    <span className="text-[8px] text-muted-foreground flex-shrink-0">
                              .{extension}
                            </span>
                                                </div>
                                                <div className="flex justify-between text-[8px] text-muted-foreground">
                                                    <span>{formatFileSize(file.size)}</span>
                                                    <span>Original: {file.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Asset Type Selection */}
                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider">ASSET TYPE</label>
                        <div className="grid grid-cols-2 gap-2">
                            {ASSET_TYPES.map((type) => {
                                const IconComponent = type.icon
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedAssetType(type.id)}
                                        className={`p-3 border-2 text-left transition-colors ${
                                            selectedAssetType === type.id
                                                ? "border-primary bg-primary/10"
                                                : "border-border bg-card hover:bg-muted"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <IconComponent className="w-4 h-4"/>
                                            <span className="text-[10px] font-bold">{type.label}</span>
                                        </div>
                                        <p className="text-[8px] text-muted-foreground">{type.description}</p>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t-2 border-border">
                        <PixelButton
                            variant="secondary"
                            className="flex-1 text-[10px]"
                            onClick={() => {
                                setIsUploadModalOpen(false)
                                setSelectedFiles([])
                                setFileNames({})
                            }}
                        >
                            CANCEL
                        </PixelButton>
                        <PixelButton
                            variant="primary"
                            className="flex-1 text-[10px]"
                            onClick={handleFileUpload}
                            disabled={selectedFiles.length === 0 || uploading}
                        >
                            {uploading ? "UPLOADING..." : `UPLOAD ${selectedFiles.length} FILES`}
                        </PixelButton>
                    </div>
                </div>
            </PixelModal>

            {/* Rename Modal */}
            <PixelModal
                isOpen={isRenameModalOpen}
                onClose={() => {
                    setIsRenameModalOpen(false)
                    setRenamingAsset(null)
                    setNewAssetName("")
                }}
                title="RENAME ASSET"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider mb-2">
                            NEW NAME
                        </label>
                        <PixelInput
                            value={newAssetName}
                            onChange={(e) => setNewAssetName(e.target.value)}
                            placeholder="Enter new asset name"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRenameConfirm()
                            }}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <PixelButton
                            variant="secondary"
                            className="flex-1 text-[10px]"
                            onClick={() => {
                                setIsRenameModalOpen(false)
                                setRenamingAsset(null)
                                setNewAssetName("")
                            }}
                        >
                            CANCEL
                        </PixelButton>
                        <PixelButton
                            variant="primary"
                            className="flex-1 text-[10px]"
                            onClick={handleRenameConfirm}
                            disabled={!newAssetName.trim()}
                        >
                            RENAME
                        </PixelButton>
                    </div>
                </div>
            </PixelModal>

            <PixelModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title={viewingAsset?.name || ""}
            >
                {viewingAsset && (
                    <div className="space-y-4">
                        {(viewingAsset.type === "wallpaper" || viewingAsset.type === "icon") && viewingAsset.url ? (
                            <div className="border-2 border-border bg-muted relative w-full h-96">
                                <Image
                                    src={viewingAsset.url.replace('/thumbnail', '/uc')}
                                    alt={viewingAsset.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    className="object-contain"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = viewingAsset.thumbnailUrl || viewingAsset.url
                                    }}
                                />
                            </div>
                        ) : viewingAsset.type === "music" || viewingAsset.type === "sound" ? (
                            <audio controls className="w-full" src={viewingAsset.url}/>
                        ) : (
                            <div
                                className="aspect-video bg-muted border-2 border-border flex items-center justify-center text-4xl">
                                {getAssetIcon(viewingAsset.type)}
                            </div>
                        )}
                        <div className="space-y-2 text-[10px]">
                            <p><strong>TYPE:</strong> {viewingAsset.type.toUpperCase()}</p>
                            <p><strong>SIZE:</strong> {formatFileSize(viewingAsset.fileSize)}</p>
                            <p><strong>DATE:</strong> {new Date(viewingAsset.date).toLocaleString()}</p>
                            <p><strong>FILE ID:</strong> {viewingAsset.fileId}</p>
                            <div className="pt-2">
                                <PixelButton
                                    variant="primary"
                                    className="text-[10px] w-full"
                                    onClick={() => handleDownload(viewingAsset)}
                                >
                                    DOWNLOAD FILE
                                </PixelButton>
                            </div>
                        </div>
                    </div>
                )}
            </PixelModal>

            {/* Single Asset Delete */}
            <DeleteConfirmationModal
                isOpen={deleteConfirmation.isOpen && deleteConfirmation.assetId !== -1}
                onClose={() => setDeleteConfirmation({isOpen: false, assetId: null})}
                onConfirm={async () => {
                    if (deleteConfirmation.assetId) {
                        const asset = assets.find(a => a.id === deleteConfirmation.assetId)
                        if (asset) {
                            const result = await deleteFile(asset.fileId)
                            if (result.success) {
                                setAssets(assets.filter(a => a.id !== deleteConfirmation.assetId))
                                setSelectedAssets(selectedAssets.filter(id => id !== deleteConfirmation.assetId))
                            } else {
                                throw new Error(result.error || 'Delete failed')
                            }
                        }
                    }
                    setDeleteConfirmation({isOpen: false, assetId: null})
                }}
                title="DELETE ASSET?"
                message="ARE YOU SURE YOU WANT TO DELETE THIS ASSET? THIS WILL REMOVE IT FROM GOOGLE DRIVE."
            />

            {/* Bulk Delete */}
            <DeleteConfirmationModal
                isOpen={deleteConfirmation.isOpen && deleteConfirmation.assetId === -1}
                onClose={() => setDeleteConfirmation({isOpen: false, assetId: null})}
                onConfirm={async () => {
                    const deletePromises = selectedAssets.map(async (assetId) => {
                        const asset = assets.find(a => a.id === assetId)
                        if (asset) {
                            const result = await deleteFile(asset.fileId)
                            if (!result.success) {
                                throw new Error(`Failed to delete ${asset.name}`)
                            }
                            return assetId
                        }
                        return null
                    })

                    try {
                        await Promise.all(deletePromises)
                        setAssets(assets.filter(asset => !selectedAssets.includes(asset.id)))
                        setSelectedAssets([])
                        setDeleteConfirmation({isOpen: false, assetId: null})
                    } catch (error) {
                        console.error('Bulk delete failed:', error)
                        throw error // This will trigger the error handling in the modal
                    }
                }}
                title="DELETE ASSETS?"
                message={`ARE YOU SURE YOU WANT TO DELETE ${selectedAssets.length} SELECTED ASSETS? THIS WILL REMOVE THEM FROM GOOGLE DRIVE.`}
            />

            {/* Upload Error */}
            {uploadError && (
                <div
                    className="fixed bottom-4 right-4 p-4 bg-red-500 border-2 border-red-700 text-white text-[10px] max-w-sm">
                    ERROR: {uploadError}
                </div>
            )}

            {/* Uploading Indicator */}
            {uploading && (
                <div
                    className="fixed bottom-4 right-4 p-4 bg-primary border-2 border-border text-primary-foreground text-[10px] flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    UPLOADING...
                </div>
            )}
        </div>
    )
}
