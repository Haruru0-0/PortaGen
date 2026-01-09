import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { Library } from "lucide-react"
import { useDesktopContext } from "@/contexts/desktopContext"
import { useDesktopStore } from "@/lib/stores/desktop-store"
import { useEffect, useState } from "react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useParams } from "next/navigation";
import { AssetPicker } from "@/components/common/asset-picker"

export function DesktopWidgetTab() {
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { data, getDesktopData, updateGif } = useDesktopContext()
  const { desktopGif, setDesktopGif, pendingGifFile, setPendingGifFile } = useDesktopStore()
  const { uploadFile, uploading } = useFileUpload()
  const [renameOpen, setRenameOpen] = useState(false)
  const [customName, setCustomName] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [assetPickerOpen, setAssetPickerOpen] = useState(false)

  useEffect(() => {
    if (currentPortfolioId) void getDesktopData(currentPortfolioId)
  }, [currentPortfolioId])

  useEffect(() => {
    if (pendingGifFile) {
      const url = URL.createObjectURL(pendingGifFile)
      setPreviewUrl(url)
      setDesktopGif(url)
    }
  }, [pendingGifFile, setDesktopGif])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const onUploadGif = (file: File) => {
    const base = file.name.replace(/\.[^/.]+$/, "")
    setPendingGifFile(file)
    setCustomName(base)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setDesktopGif(url) // Update store for immediate preview
  }

  const handleSave = () => {
    if (pendingGifFile) {
      setRenameOpen(true)
    }
  }

  const confirmUpload = async () => {
    if (!pendingGifFile || !currentPortfolioId) return
    const name = customName.trim() || pendingGifFile.name.replace(/\.[^/.]+$/, "")
    // Use 'wallpaper' category for GIF/background imagery
    const result = await uploadFile(pendingGifFile, 'wallpaper', name)
    if (result?.success && result.data?.id) {
      await updateGif(currentPortfolioId, result.data.id)
      setRenameOpen(false)
      setPendingGifFile(null)
      setCustomName("")
      setPreviewUrl(null)
      // The store will be updated via the context after updateGif
    } else if (!result?.success) {
      alert(result?.error || 'Upload failed')
    }
  }

  const handleAssetSelect = async (asset: { id: number; url: string; thumbnailUrl?: string }) => {
    if (!currentPortfolioId) return
    await updateGif(currentPortfolioId, asset.id)
    setDesktopGif(asset.thumbnailUrl || asset.url)
    setPendingGifFile(null)
    setPreviewUrl(null)
  }

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-sm pixel-text-shadow">DESKTOP Gif</h3>

        <div className="space-y-2">
          <FileUpload
            accept="image/gif,image/*"
            onFileSelect={onUploadGif}
            preview={previewUrl || data?.desktopGifUrl || ''}
            label=""
            maxSize={10}
          />
          <PixelButton
            variant="secondary"
            className="w-full text-[10px] flex items-center justify-center gap-2"
            onClick={() => setAssetPickerOpen(true)}
          >
            <Library className="w-3 h-3" />
            SELECT FROM LIBRARY
          </PixelButton>
        </div>

        {pendingGifFile && (
          <PixelButton
            className="w-full text-[10px]"
            onClick={handleSave}
          >
            SAVE GIF
          </PixelButton>
        )}
      </div>
      <PixelModal isOpen={renameOpen} onClose={() => !uploading && setRenameOpen(false)} title="RENAME GIF">
        <div className="space-y-4">
          <p className="text-[10px] text-muted-foreground">SET A NAME FOR YOUR GIF</p>
          <PixelInput value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter name" />
          <div className="flex gap-3 pt-2">
            <PixelButton variant="secondary" className="flex-1 text-[10px]" onClick={() => setRenameOpen(false)} disabled={uploading}>CANCEL</PixelButton>
            <PixelButton className="flex-1 text-[10px]" onClick={confirmUpload} disabled={uploading || !pendingGifFile}>{uploading ? 'UPLOADING…' : 'UPLOAD'}</PixelButton>
          </div>
        </div>
      </PixelModal>
      <AssetPicker
        isOpen={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        onSelect={handleAssetSelect}
        type="image"
      />
    </PixelCard>
  )
}
