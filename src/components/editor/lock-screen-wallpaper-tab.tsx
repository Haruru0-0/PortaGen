import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { Library } from "lucide-react"
import { useLockScreenContext } from "@/contexts/lockScreenContext"
import { useLockScreenStore } from "@/lib/stores/lock-screen-store"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import { useFileUpload } from "@/hooks/use-file-upload"
import { AssetPicker } from "@/components/common/asset-picker"
import { Asset } from "@/lib/types"
import Image from "next/image"

export function LockScreenWallpaperTab() {
  const { data, updateWallpaper, getLockScreenData } = useLockScreenContext()
  const { setWallpaper, pendingWallpaperFile, setPendingWallpaperFile } = useLockScreenStore()
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { uploadFile, uploading } = useFileUpload()

  const [renameOpen, setRenameOpen] = useState(false)
  const [customName, setCustomName] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [assetPickerOpen, setAssetPickerOpen] = useState(false)
  const [urlInput, setUrlInput] = useState("")

  useEffect(() => {
    if (currentPortfolioId) {
      void getLockScreenData(currentPortfolioId)
    }
  }, [currentPortfolioId, getLockScreenData])
  useEffect(() => {
    if (data && data.wallpaperUrl) {
      setUrlInput(data.wallpaperUrl)
    }
  }, [data])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const onUpload = (file: File) => {
    const base = file.name.replace(/\.[^/.]+$/, "")
    setPendingWallpaperFile(file)
    setCustomName(base)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setWallpaper(url) // Update store for immediate preview
  }

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value)
    if (e.target.value) {
      setWallpaper(e.target.value)
      setPendingWallpaperFile(null)
    }
  }

  const handleSaveUrl = async () => {
    if (!currentPortfolioId || !urlInput) return
    await updateWallpaper(currentPortfolioId, null, urlInput)
    setUrlInput("")
  }

  const handleSave = () => {
    if (pendingWallpaperFile) {
      setRenameOpen(true)
    }
  }

  const confirmUpload = async () => {
    if (!pendingWallpaperFile || !currentPortfolioId) return
    const name = customName.trim() || pendingWallpaperFile.name.replace(/\.[^/.]+$/, "")
    const result = await uploadFile(pendingWallpaperFile, 'wallpaper', name)
    if (result?.success && result.data?.id) {
      await updateWallpaper(currentPortfolioId, result.data.id)
      setRenameOpen(false)
      setPendingWallpaperFile(null)
      setCustomName("")
      setPreviewUrl(null)
      // The store will be updated via the context after updateWallpaper
    } else if (!result?.success) {
      alert(result?.error || 'Upload failed')
    }
  }

  const handleAssetSelect = async (asset: Asset) => {
    if (!currentPortfolioId) return
    await updateWallpaper(currentPortfolioId, asset.id)
    setWallpaper(`https://drive.google.com/uc?id=${asset.fileId}`)
    setPendingWallpaperFile(null)
    setPreviewUrl(null)
  }

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-sm pixel-text-shadow">LOCK SCREEN WALLPAPER</h3>

        <div className="space-y-2">
          <FileUpload
            accept="image/*"
            onFileSelect={onUpload}
            preview={previewUrl || (data?.wallpaperAsset?.fileId ? `https://drive.google.com/uc?id=${data.wallpaperAsset.fileId}` : '')}
            label="LOCK SCREEN IMAGE"
            maxSize={5}
          />
          <PixelButton
            variant="secondary"
            className="w-full text-[10px] flex items-center justify-center gap-2"
            onClick={() => setAssetPickerOpen(true)}
          >
            <Library className="w-3 h-3" />
            SELECT FROM LIBRARY
          </PixelButton>

          <div className="pt-2 space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase">OR IMAGE LINK (PINTEREST ETC)</p>
            <div className="flex gap-2">
              <PixelInput
                placeholder="https://..."
                value={urlInput}
                onChange={handleUrlInputChange}
              />
              <PixelButton className="text-[10px]" onClick={handleSaveUrl} disabled={!urlInput}>SAVE</PixelButton>
            </div>
            {urlInput && (
              <div className="relative w-full h-32 border border-border rounded overflow-hidden">
                <Image
                  src={urlInput}
                  alt="Lock Screen Preview"
                  fill
                  className="object-cover"
                  onError={() => {/* Handle error silently or show placeholder */ }}
                />
              </div>
            )}
          </div>
        </div>

        {pendingWallpaperFile && (
          <PixelButton
            className="w-full text-[10px]"
            onClick={handleSave}
          >
            SAVE WALLPAPER
          </PixelButton>
        )}
      </div>
      <PixelModal isOpen={renameOpen} onClose={() => !uploading && setRenameOpen(false)} title="RENAME WALLPAPER">
        <div className="space-y-4">
          <p className="text-[10px] text-muted-foreground">SET A NAME FOR YOUR WALLPAPER</p>
          <PixelInput
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Enter name"
          />
          <div className="flex gap-3 pt-2">
            <PixelButton
              variant="secondary"
              className="flex-1 text-[10px]"
              onClick={() => setRenameOpen(false)}
              disabled={uploading}
            >
              CANCEL
            </PixelButton>
            <PixelButton
              className="flex-1 text-[10px]"
              onClick={confirmUpload}
              disabled={uploading || !pendingWallpaperFile}
            >
              {uploading ? 'UPLOADING…' : 'UPLOAD'}
            </PixelButton>
          </div>
        </div>
      </PixelModal>
      <AssetPicker
        isOpen={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        onSelect={handleAssetSelect}
        type="wallpaper"
      />
    </PixelCard>
  )
}
