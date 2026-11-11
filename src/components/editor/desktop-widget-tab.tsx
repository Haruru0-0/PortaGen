import { WorkspacePanel as PixelCard } from "@/components/workspace/workspace-primitives"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { FileUpload } from "@/components/file-upload"
import { PixelModal } from "@/components/editor/editor-modal"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { Library } from "lucide-react"
import { useDesktopContext } from "@/contexts/desktopContext"
import { useDesktopStore } from "@/lib/stores/desktop-store"
import { useEffect, useState } from "react"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useParams } from "next/navigation";
import { AssetPicker } from "@/components/common/asset-picker"
import { Asset } from "@/lib/types"
import Image from "next/image"
import { assetUrl } from "@/lib/asset-url"
import { useAssetCleanup } from "@/hooks/use-asset-cleanup"

export function DesktopWidgetTab() {
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { data, getDesktopData, updateGif } = useDesktopContext()
  const { setDesktopGif, pendingGifFile, setPendingGifFile } = useDesktopStore()
  const { uploadFile, uploading } = useFileUpload()
  const { cleanupAsset, cleanupDialog } = useAssetCleanup()
  const [renameOpen, setRenameOpen] = useState(false)
  const [customName, setCustomName] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [urlInput, setUrlInput] = useState("")
  const [assetPickerOpen, setAssetPickerOpen] = useState(false)

  useEffect(() => {
    if (currentPortfolioId) void getDesktopData(currentPortfolioId)
  }, [currentPortfolioId])

  useEffect(() => {
    if (data && data.desktopGifUrl) {
      setUrlInput(data.desktopGifUrl)
    }
  }, [data])

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

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value)
    if (e.target.value) {
      setPendingGifFile(null)
    }
  }

  const handleSaveUrl = async () => {
    if (!currentPortfolioId || !urlInput) return
    await updateGif(currentPortfolioId, null, urlInput)
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

  const handleRemoveGif = async () => {
    if (!currentPortfolioId) return
    // Back to the default greeting animation. The uploaded file stays in the library.
    const asset = data?.desktopGifAsset
    if (asset || data?.desktopGifUrl) await updateGif(currentPortfolioId, null)
    await cleanupAsset(asset)
    setDesktopGif("")
    setUrlInput("")
    setPendingGifFile(null)
    setPreviewUrl(null)
  }

  const handleAssetSelect = async (asset: Asset) => {
    if (!currentPortfolioId) return
    await updateGif(currentPortfolioId, asset.id)
    setDesktopGif(assetUrl(asset, "thumbnail"))
    setPendingGifFile(null)
    setPreviewUrl(null)
  }

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-sm workspace-editor-title">DESKTOP Gif</h3>

        <div className="space-y-2">
          <FileUpload
            accept="image/gif,image/*"
            onFileSelect={onUploadGif}
            preview={previewUrl || assetUrl(data?.desktopGifAsset) || data?.desktopGifUrl || ''}
            onRemove={handleRemoveGif}
            removeLabel="REMOVE GIF"
            label=""
            maxSize={10}
          />
          <PixelButton
            variant="secondary"
            className="w-full text-xs flex items-center justify-center gap-2"
            onClick={() => setAssetPickerOpen(true)}
          >
            <Library className="w-3 h-3" />
            SELECT FROM LIBRARY
          </PixelButton>

          <div className="pt-2 space-y-2">
            <p className="text-xs text-muted-foreground uppercase">OR IMAGE LINK</p>
            <div className="flex gap-2">
              <PixelInput
                placeholder="https://..."
                value={urlInput}
                onChange={handleUrlInputChange}
              />
              <PixelButton className="text-xs" onClick={handleSaveUrl} disabled={!urlInput}>SAVE</PixelButton>
            </div>
            {urlInput && (
              <div className="relative w-full h-32 border border-border rounded overflow-hidden">
                <Image
                  src={urlInput}
                  alt="GIF Preview"
                  fill
                  className="object-cover"
                  onError={() => setPreviewUrl(null)}
                />
              </div>
            )}
          </div>
        </div>

        {pendingGifFile && (
          <PixelButton
            className="w-full text-xs"
            onClick={handleSave}
          >
            SAVE GIF
          </PixelButton>
        )}
      </div>
      <PixelModal isOpen={renameOpen} onClose={() => !uploading && setRenameOpen(false)} title="RENAME GIF">
        <div className="space-y-4">
          <p className="font-dialogue text-sm text-muted-foreground">SET A NAME FOR YOUR GIF</p>
          <PixelInput value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="Enter name" />
          <div className="flex gap-3 pt-2">
            <PixelButton variant="secondary" className="flex-1 text-xs" onClick={() => setRenameOpen(false)} disabled={uploading}>CANCEL</PixelButton>
            <PixelButton className="flex-1 text-xs" onClick={confirmUpload} disabled={uploading || !pendingGifFile}>{uploading ? 'UPLOADING…' : 'UPLOAD'}</PixelButton>
          </div>
        </div>
      </PixelModal>
      {cleanupDialog}
      <AssetPicker
        isOpen={assetPickerOpen}
        onClose={() => setAssetPickerOpen(false)}
        onSelect={handleAssetSelect}
        type="image"
      />
    </PixelCard>
  )
}
