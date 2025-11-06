import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { Library } from "lucide-react"
import { useEditorContext } from "@/contexts/editorContext"
import { useDesktopContext } from "@/contexts/desktopContext"
import { useEffect } from "react"

export function DesktopWallpaperTab() {
  const { uploadAsset, currentPortfolioId } = useEditorContext() as any
  const { data, load, updateGif, updateWallpaper } = useDesktopContext()

  useEffect(() => {
    if (currentPortfolioId) void load(currentPortfolioId)
  }, [currentPortfolioId])

  const onUploadWallpaper = async (file: File) => {
    if (!currentPortfolioId) return
    const { asset } = await uploadAsset(file, 'wallpaper', currentPortfolioId)
    await updateWallpaper(currentPortfolioId, asset.id)
  }

  const onUploadGif = async (file: File) => {
    if (!currentPortfolioId) return
    const { asset } = await uploadAsset(file, 'gif', currentPortfolioId)
    await updateGif(currentPortfolioId, asset.id)
  }

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-sm pixel-text-shadow">DESKTOP WALLPAPER</h3>

        <FileUpload
          accept="image/gif,image/*"
          onFileSelect={onUploadGif}
          preview={data?.desktopGifUrl || ''}
          label="DESKTOP GIF/IMAGE"
          maxSize={10}
        />

        <FileUpload
          accept="image/*"
          onFileSelect={onUploadWallpaper}
          preview={data?.wallpaperUrl || ''}
          label="WALLPAPER IMAGE"
          maxSize={10}
        />

        <PixelButton variant="secondary" className="w-full text-[10px] flex items-center justify-center gap-2" disabled>
          <Library className="w-4 h-4" /> CHOOSE FROM LIBRARY
        </PixelButton>
      </div>
      <div className="mt-6">
        <PixelButton className="w-full text-[10px]" onClick={() => undefined}>
          SAVE
        </PixelButton>
      </div>
    </PixelCard>
  )
}
