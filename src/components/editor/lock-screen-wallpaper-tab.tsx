import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { Library } from "lucide-react"
import { useLockScreenContext } from "@/contexts/lockScreenContext"
import { useEffect, useState } from "react"
import {useParams} from "next/navigation";
import { useFileUpload } from "@/hooks/use-file-upload"

export function LockScreenWallpaperTab() {
  const { data, updateWallpaper, getLockScreenData, loading } = useLockScreenContext()
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { uploadFile, uploading } = useFileUpload()

  const [renameOpen, setRenameOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [customName, setCustomName] = useState("")

  useEffect(() => {
    if (currentPortfolioId) {
      void getLockScreenData(currentPortfolioId)
    }
  }, [currentPortfolioId, getLockScreenData])

  const onUpload = (file: File) => {
    if (!currentPortfolioId) return
    const base = file.name.replace(/\.[^/.]+$/, "")
    setPendingFile(file)
    setCustomName(base)
    setRenameOpen(true)
  }

  const confirmUpload = async () => {
    if (!pendingFile || !currentPortfolioId) return
    const name = customName.trim() || pendingFile.name.replace(/\.[^/.]+$/, "")
    const result = await uploadFile(pendingFile, 'wallpaper', name)
    if (result?.success && result.data?.id) {
      await updateWallpaper(currentPortfolioId, result.data.id)
      setRenameOpen(false)
      setPendingFile(null)
      setCustomName("")
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
          preview={data?.wallpaperUrl || ''}
          label="LOCK SCREEN IMAGE"
          maxSize={5}
        />

        <PixelButton
          variant="secondary"
          className="w-full text-[10px] flex items-center justify-center gap-2"
          disabled
        >
          <Library className="w-4 h-4" />
          CHOOSE FROM LIBRARY
        </PixelButton>
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
              disabled={uploading || !pendingFile}
            >
              {uploading ? 'UPLOADING…' : 'UPLOAD'}
            </PixelButton>
          </div>
        </div>
      </PixelModal>
    </PixelCard>
  )
}
