import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { Library } from "lucide-react"
import { useLockScreenContext } from "@/contexts/lockScreenContext"
import { useEditorContext } from "@/contexts/editorContext"
import { useEffect } from "react"

export function LockScreenWallpaperTab() {
  const { data, updateWallpaper, load } = useLockScreenContext()
  const { uploadAsset, currentPortfolioId } = useEditorContext()

  useEffect(() => {
    if (currentPortfolioId) {
      void load(currentPortfolioId)
    }
  }, [currentPortfolioId])

  const onUpload = async (file: File) => {
    if (!currentPortfolioId) return
    const { asset } = await uploadAsset(file, 'wallpaper', currentPortfolioId)
    await updateWallpaper(currentPortfolioId, asset.id)
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
      <div className="mt-6">
        <PixelButton className="w-full text-[10px]" onClick={() => undefined}>
          SAVE
        </PixelButton>
      </div>
    </PixelCard>
  )
}
