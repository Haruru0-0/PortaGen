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

export function LockScreenWallpaperTab() {
  const { data, updateWallpaper, getLockScreenData, loading } = useLockScreenContext()
  const { wallpaper, setWallpaper, pendingWallpaperFile, setPendingWallpaperFile } = useLockScreenStore()
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { uploadFile, uploading } = useFileUpload()

  const [renameOpen, setRenameOpen] = useState(false)
  const [customName, setCustomName] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (currentPortfolioId) {
      void getLockScreenData(currentPortfolioId)
    }
  }, [currentPortfolioId, getLockScreenData])


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

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-sm pixel-text-shadow">LOCK SCREEN WALLPAPER</h3>

        <FileUpload
          accept="image/*"
          onFileSelect={onUpload}
          preview={previewUrl || data?.wallpaperUrl || ''}
          label="LOCK SCREEN IMAGE"
          maxSize={5}
        />

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
    </PixelCard>
  )
}
