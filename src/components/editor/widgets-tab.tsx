import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { useEditorContext } from "@/contexts/editorContext"
import { useDesktopContext } from "@/contexts/desktopContext"
import { useEffect } from "react"

export function WidgetsTab() {
  const { currentPortfolioId, uploadAsset } = useEditorContext() as any
  const { data, load, updateWidget } = useDesktopContext()

  useEffect(() => { if (currentPortfolioId) void load(currentPortfolioId) }, [currentPortfolioId])

  const onUploadWidget1 = async (file: File) => {
    if (!currentPortfolioId) return
    const { asset } = await uploadAsset(file, 'widget', currentPortfolioId)
    await updateWidget(currentPortfolioId, 1, asset.id)
  }
  const onUploadWidget2 = async (file: File) => {
    if (!currentPortfolioId) return
    const { asset } = await uploadAsset(file, 'widget', currentPortfolioId)
    await updateWidget(currentPortfolioId, 2, asset.id)
  }

  const onSave = async () => undefined

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-sm pixel-text-shadow">MOBILE WIDGETS</h3>
        <FileUpload accept="image/*" onFileSelect={onUploadWidget1} label="WIDGET 1" maxSize={5} />
        <FileUpload accept="image/*" onFileSelect={onUploadWidget2} label="WIDGET 2" maxSize={5} />
      </div>
      <div className="mt-6">
        <PixelButton onClick={onSave} className="w-full text-[10px]">SAVE</PixelButton>
      </div>
    </PixelCard>
  )
}
