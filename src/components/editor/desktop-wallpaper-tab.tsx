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

export function DesktopWallpaperTab() {
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { data, getDesktopData, updateWallpaper } = useDesktopContext()
  const {
    wallpaper, setWallpaper, pendingWallpaperFile, setPendingWallpaperFile,
    menubarIcon, setMenubarIcon, pendingMenubarIconFile, setPendingMenubarIconFile,
    menubarText, setMenubarText
  } = useDesktopStore()
  const { uploadFile, uploading } = useFileUpload()
  const [renameOpen, setRenameOpen] = useState(false)
  const [customName, setCustomName] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Menubar icon preview
  const [menubarIconPreview, setMenubarIconPreview] = useState<string | null>(null)

  const { updateMenubar } = useDesktopContext()

  useEffect(() => {
    if (currentPortfolioId) void getDesktopData(currentPortfolioId)
  }, [currentPortfolioId])

  useEffect(() => {
    if (pendingWallpaperFile) {
      const url = URL.createObjectURL(pendingWallpaperFile)
      setPreviewUrl(url)
      setWallpaper(url)
    }
  }, [pendingWallpaperFile, setWallpaper])

  useEffect(() => {
    if (pendingMenubarIconFile) {
      const url = URL.createObjectURL(pendingMenubarIconFile)
      setMenubarIconPreview(url)
      setMenubarIcon(url)
    }
  }, [pendingMenubarIconFile, setMenubarIcon])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      if (menubarIconPreview) URL.revokeObjectURL(menubarIconPreview)
    }
  }, [previewUrl, menubarIconPreview])

  const onUploadWallpaper = (file: File) => {
    const base = file.name.replace(/\.[^/.]+$/, "")
    setPendingWallpaperFile(file)
    setCustomName(base)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setWallpaper(url)
  }

  const onUploadMenubarIcon = (file: File) => {
    setPendingMenubarIconFile(file)
    const url = URL.createObjectURL(file)
    setMenubarIconPreview(url)
    setMenubarIcon(url)
    // Save immediately or wait? Let's save on button click for consistency or add a save button
    // We'll reuse the pattern: show preview and have a "SAVE SETTINGS" button later or per section
  }

  const handleSaveWallpaper = () => {
    if (pendingWallpaperFile) {
      setRenameOpen(true)
    }
  }

  // Simplified save for menubar for now
  const handleSaveMenubar = async () => {
    if (!currentPortfolioId) return

    let assetId = data?.menubarIconAssetId || null

    if (pendingMenubarIconFile) {
      const result = await uploadFile(pendingMenubarIconFile, 'icon', 'menubar-icon')
      if (result?.success && result.data?.id) {
        assetId = result.data.id
      } else {
        return // Error is handled by hooks or should be shown
      }
    }

    await updateMenubar(currentPortfolioId, assetId, menubarText)
    setPendingMenubarIconFile(null)
    setMenubarIconPreview(null)
  }

  const confirmUploadWallpaper = async () => {
    if (!pendingWallpaperFile || !currentPortfolioId) return
    const name = customName.trim() || pendingWallpaperFile.name.replace(/\.[^/.]+$/, "")
    const result = await uploadFile(pendingWallpaperFile, 'wallpaper', name)
    if (result?.success && result.data?.id) {
      await updateWallpaper(currentPortfolioId, result.data.id)
      setRenameOpen(false)
      setPendingWallpaperFile(null)
      setCustomName("")
      setPreviewUrl(null)
    } else if (!result?.success) {
      alert(result?.error || 'Upload failed')
    }
  }

  return (
    <PixelCard>
      <div className="space-y-6">
        {/* WALLPAPER SECTION */}
        <div className="space-y-4">
          <h3 className="text-sm dashboard-pixel-text-shadow">DESKTOP WALLPAPER</h3>
          <FileUpload
            accept="image/*"
            onFileSelect={onUploadWallpaper}
            preview={previewUrl || data?.wallpaperUrl || ''}
            label=""
            maxSize={10}
          />
          {pendingWallpaperFile && (
            <PixelButton
              className="w-full text-[10px]"
              onClick={handleSaveWallpaper}
            >
              SAVE WALLPAPER
            </PixelButton>
          )}
        </div>

        <div className="h-[1px] bg-border w-full" />

        {/* MENU BAR SECTION */}
        <div className="space-y-4">
          <h3 className="text-sm dashboard-pixel-text-shadow">MENU BAR SETTINGS</h3>

          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase">Menu Bar Icon</p>
            <FileUpload
              accept="image/*"
              onFileSelect={onUploadMenubarIcon}
              preview={menubarIconPreview || data?.menubarIconUrl || ''}
              label=""
              maxSize={2}
            />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-muted-foreground uppercase">Menu Bar Name</p>
            <PixelInput
              value={menubarText}
              onChange={(e) => setMenubarText(e.target.value)}
              placeholder="e.g. Ahmad kanaan"
            />
          </div>

          <PixelButton
            className="w-full text-[10px]"
            onClick={handleSaveMenubar}
            disabled={uploading}
          >
            {uploading ? 'SAVING...' : 'SAVE MENU BAR SETTINGS'}
          </PixelButton>
        </div>

      </div>

      <PixelModal isOpen={renameOpen} onClose={() => !uploading && setRenameOpen(false)} title="RENAME WALLPAPER">
        <div className="space-y-4">
          <p className="text-[10px] text-muted-foreground">SET A NAME FOR YOUR WALLPAPER</p>
          <PixelInput value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter name" />
          <div className="flex gap-3 pt-2">
            <PixelButton variant="secondary" className="flex-1 text-[10px]" onClick={() => setRenameOpen(false)} disabled={uploading}>CANCEL</PixelButton>
            <PixelButton className="flex-1 text-[10px]" onClick={confirmUploadWallpaper} disabled={uploading || !pendingWallpaperFile}>{uploading ? 'UPLOADING…' : 'UPLOAD'}</PixelButton>
          </div>
        </div>
      </PixelModal>
    </PixelCard>
  )
}
