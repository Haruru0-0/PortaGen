import { useEffect, useState } from "react"
import Image from "next/image"
import { Library } from "lucide-react"
import { WorkspaceAction as PixelButton, WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { FileUpload } from "@/components/file-upload"
import { AssetPicker } from "@/components/common/asset-picker"
import { useFileUpload } from "@/hooks/use-file-upload"
import type { Asset } from "@/lib/types"
import { assetUrl } from "@/lib/asset-url"
import { useAssetCleanup } from "@/hooks/use-asset-cleanup"

interface MobileWallpaperSectionProps {
  title: string
  savedUrl?: string
  /** Address of the saved wallpaper file, if one was uploaded or chosen from the library. */
  savedImageUrl?: string
  /** The saved wallpaper's stored file, so removing it can also delete the file. */
  savedAsset?: { id: number; fileId: string; name?: string } | null
  /** Persists the choice: an uploaded/library asset id, an image link, or both null to clear it. */
  onSave: (assetId: number | null, url?: string) => Promise<void>
  /** Shows the choice in the live preview before it is saved. */
  onPreview: (url: string) => void
}

/** Wallpaper used by the mobile layout. When none is set, the desktop wallpaper is used instead. */
export function MobileWallpaperSection({ title, savedUrl, savedImageUrl, savedAsset, onSave, onPreview }: MobileWallpaperSectionProps) {
  const { uploadFile, uploading } = useFileUpload()
  const { cleanupAsset, cleanupDialog } = useAssetCleanup()
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [typedUrl, setTypedUrl] = useState<string | null>(null)
  // Show what the user typed, otherwise the saved link
  const urlInput = typedUrl ?? savedUrl ?? ""
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onFileSelect = (file: File) => {
    const url = URL.createObjectURL(file)
    setPendingFile(file)
    setPreviewUrl(url)
    onPreview(url)
  }

  const saveUpload = async () => {
    if (!pendingFile) return
    const name = `mobile-${pendingFile.name.replace(/\.[^/.]+$/, "")}`
    const result = await uploadFile(pendingFile, "wallpaper", name)
    if (result?.success && result.data?.id) {
      await onSave(result.data.id)
      setPendingFile(null)
      setPreviewUrl(null)
    } else {
      alert(result?.error || "Upload failed")
    }
  }

  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedUrl(e.target.value)
    if (e.target.value) onPreview(e.target.value)
  }

  const onAssetSelect = async (asset: Asset) => {
    await onSave(asset.id)
    onPreview(assetUrl(asset, "thumbnail"))
    setPendingFile(null)
    setPreviewUrl(null)
  }

  const clear = async () => {
    await onSave(null)
    await cleanupAsset(savedAsset)
    onPreview("")
    setTypedUrl("")
    setPendingFile(null)
    setPreviewUrl(null)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm workspace-editor-title">{title}</h3>
      <p className="text-xs text-muted-foreground uppercase">
        Shown on phones and in the mobile preview. Without one, the desktop wallpaper is used.
      </p>
      <div className="space-y-2">
        <FileUpload
          accept="image/*"
          onFileSelect={onFileSelect}
          preview={previewUrl || savedImageUrl || savedUrl || ""}
          onRemove={clear}
          removeLabel="USE DESKTOP WALLPAPER"
          label=""
          maxSize={10}
        />
        <PixelButton
          variant="secondary"
          className="w-full text-xs flex items-center justify-center gap-2"
          onClick={() => setPickerOpen(true)}
        >
          <Library className="w-3 h-3" />
          SELECT FROM LIBRARY
        </PixelButton>

        <div className="pt-2 space-y-2">
          <p className="text-xs text-muted-foreground uppercase">OR IMAGE LINK</p>
          <div className="flex gap-2">
            <PixelInput placeholder="https://..." value={urlInput} onChange={onUrlChange} aria-label={`${title} image link`} />
            <PixelButton className="text-xs" onClick={() => onSave(null, urlInput)} disabled={!urlInput}>
              SAVE
            </PixelButton>
          </div>
          {urlInput && (
            <div className="relative w-24 h-40 border border-border rounded overflow-hidden">
              <Image src={urlInput} alt="Mobile wallpaper preview" fill className="object-cover" unoptimized />
            </div>
          )}
        </div>
      </div>

      {pendingFile && (
        <PixelButton className="w-full text-xs" onClick={saveUpload} disabled={uploading}>
          {uploading ? "UPLOADING…" : "SAVE MOBILE WALLPAPER"}
        </PixelButton>
      )}

      {cleanupDialog}
      <AssetPicker isOpen={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={onAssetSelect} type="wallpaper" />
    </div>
  )
}
