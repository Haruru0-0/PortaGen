import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { useDesktopContext } from "@/contexts/desktopContext"
import { useDesktopStore } from "@/lib/stores/desktop-store"
import { useEffect, useState } from "react"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useParams } from "next/navigation";
import { AssetPicker } from "@/components/common/asset-picker"
import { Library } from "lucide-react"
import { Asset } from "@/lib/types"
import Image from "next/image"

export function MobileWidgetsTab() {
    const params = useParams<{ id: string }>()
    const currentPortfolioId = Number(params?.id)
    const { data, getDesktopData, updateWidget } = useDesktopContext()
    const { setMobileWidget1, setMobileWidget2, pendingWidget1File, setPendingWidget1File, pendingWidget2File, setPendingWidget2File } = useDesktopStore()
    const { uploadFile, uploading } = useFileUpload()

    const [renameOpen1, setRenameOpen1] = useState(false)
    const [renameOpen2, setRenameOpen2] = useState(false)
    const [customName1, setCustomName1] = useState("")
    const [customName2, setCustomName2] = useState("")
    const [previewUrl1, setPreviewUrl1] = useState<string | null>(null)
    const [previewUrl2, setPreviewUrl2] = useState<string | null>(null)
    const [urlInput1, setUrlInput1] = useState("")
    const [urlInput2, setUrlInput2] = useState("")
    const [assetPickerOpen, setAssetPickerOpen] = useState(false)
    const [assetPickerWidget, setAssetPickerWidget] = useState<1 | 2>(1)

    useEffect(() => {
        if (currentPortfolioId) void getDesktopData(currentPortfolioId)
    }, [currentPortfolioId])


    useEffect(() => {
        if (data) {
            if (data.widget1Url) {
                setUrlInput1(data.widget1Url)
            }
            if (data.widget2Url) {
                setUrlInput2(data.widget2Url)
            }
        }
    }, [data])

    useEffect(() => {
        return () => {
            if (previewUrl1 && !previewUrl1.startsWith('http')) URL.revokeObjectURL(previewUrl1)
            if (previewUrl2 && !previewUrl2.startsWith('http')) URL.revokeObjectURL(previewUrl2)
        }
    }, [previewUrl1, previewUrl2])

    const onUploadWidget1 = (file: File) => {
        const base = file.name.replace(/\.[^/.]+$/, "")
        setPendingWidget1File(file)
        setCustomName1(base)
        const url = URL.createObjectURL(file)
        setPreviewUrl1(url)
        setMobileWidget1(url) // Update store for immediate preview
    }
    const onUploadWidget2 = (file: File) => {
        const base = file.name.replace(/\.[^/.]+$/, "")
        setPendingWidget2File(file)
        setCustomName2(base)
        const url = URL.createObjectURL(file)
        setPreviewUrl2(url)
        setMobileWidget2(url) // Update store for immediate preview
    }

    const handleSave1 = () => {
        if (pendingWidget1File) {
            setRenameOpen1(true)
        }
    }

    const handleSave2 = () => {
        if (pendingWidget2File) {
            setRenameOpen2(true)
        }
    }

    const confirmUpload1 = async () => {
        if (!pendingWidget1File || !currentPortfolioId) return
        const name = customName1.trim() || pendingWidget1File.name.replace(/\.[^/.]+$/, "")
        const result = await uploadFile(pendingWidget1File, 'icon', name)
        if (result?.success && result.data?.id) {
            await updateWidget(currentPortfolioId, 1, result.data.id)
            setRenameOpen1(false)
            setPendingWidget1File(null)
            setCustomName1("")
            setPreviewUrl1(null)
            // The store will be updated via the context after updateWidget
        } else if (!result?.success) {
            alert(result?.error || 'Upload failed')
        }
    }

    const confirmUpload2 = async () => {
        if (!pendingWidget2File || !currentPortfolioId) return
        const name = customName2.trim() || pendingWidget2File.name.replace(/\.[^/.]+$/, "")
        const result = await uploadFile(pendingWidget2File, 'icon', name)
        if (result?.success && result.data?.id) {
            await updateWidget(currentPortfolioId, 2, result.data.id)
            setRenameOpen2(false)
            setPendingWidget2File(null)
            setCustomName2("")
            setPreviewUrl2(null)
            // The store will be updated via the context after updateWidget
        } else if (!result?.success) {
            alert(result?.error || 'Upload failed')
        }
    }

    const handleUrlInput1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrlInput1(e.target.value)
        if (e.target.value) {
            setMobileWidget1(e.target.value)
            setPendingWidget1File(null)
        }
    }

    const handleUrlInput2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrlInput2(e.target.value)
        if (e.target.value) {
            setMobileWidget2(e.target.value)
            setPendingWidget2File(null)
        }
    }

    const handleSaveUrl1 = async () => {
        if (!currentPortfolioId || !urlInput1) return
        await updateWidget(currentPortfolioId, 1, null, urlInput1)
        // Keep input and preview to show saved state, or clear? 
        // User asked for preview to show below it if fetched.
    }

    const handleSaveUrl2 = async () => {
        if (!currentPortfolioId || !urlInput2) return
        await updateWidget(currentPortfolioId, 2, null, urlInput2)
    }

    const handleAssetSelect = async (asset: Asset) => {
        if (!currentPortfolioId) return
        await updateWidget(currentPortfolioId, assetPickerWidget, asset.id)
        if (assetPickerWidget === 1) {
            setMobileWidget1(`https://drive.google.com/thumbnail?id=${asset.fileId}` || `https://drive.google.com/uc?id=${asset.fileId}`)
            setPendingWidget1File(null)
            setPreviewUrl1(null)
        } else {
            setMobileWidget2(`https://drive.google.com/thumbnail?id=${asset.fileId}` || `https://drive.google.com/uc?id=${asset.fileId}`)
            setPendingWidget2File(null)
            setPreviewUrl2(null)
        }
    }

    const openAssetPicker = (widgetNum: 1 | 2) => {
        setAssetPickerWidget(widgetNum)
        setAssetPickerOpen(true)
    }

    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm dashboard-pixel-text-shadow">MOBILE WIDGETS</h3>
                <div className="space-y-2">
                    <FileUpload accept="image/*" onFileSelect={onUploadWidget1} label="WIDGET 1"
                        preview={previewUrl1 || (data?.widget1Asset?.fileId ? `https://drive.google.com/uc?id=${data.widget1Asset.fileId}` : '')} maxSize={5} />
                    <PixelButton
                        variant="secondary"
                        className="w-full text-[10px] flex items-center justify-center gap-2"
                        onClick={() => openAssetPicker(1)}
                    >
                        <Library className="w-3 h-3" />
                        SELECT FROM LIBRARY
                    </PixelButton>
                    {pendingWidget1File && (
                        <PixelButton
                            className="w-full text-[10px]"
                            onClick={handleSave1}
                        >
                            SAVE WIDGET 1
                        </PixelButton>
                    )}
                    <div className="pt-2 space-y-2">
                        <p className="text-[10px] text-muted-foreground uppercase">OR IMAGE LINK</p>
                        <div className="flex gap-2">
                            <PixelInput
                                placeholder="https://..."
                                value={urlInput1}
                                onChange={handleUrlInput1Change}
                            />
                            <PixelButton className="text-[10px]" onClick={handleSaveUrl1} disabled={!urlInput1}>SAVE</PixelButton>
                        </div>
                        {urlInput1 && (
                            <div className="relative w-20 h-20 border border-border rounded overflow-hidden">
                                <Image
                                    src={urlInput1}
                                    alt="Widget 1 Preview"
                                    fill
                                    className="object-cover"
                                    onError={() => setPreviewUrl1(null)} // fallback or handle error
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <FileUpload accept="image/*" onFileSelect={onUploadWidget2} label="WIDGET 2"
                        preview={previewUrl2 || (data?.widget2Asset?.fileId ? `https://drive.google.com/uc?id=${data.widget2Asset.fileId}` : '')} maxSize={5} />
                    <PixelButton
                        variant="secondary"
                        className="w-full text-[10px] flex items-center justify-center gap-2"
                        onClick={() => openAssetPicker(2)}
                    >
                        <Library className="w-3 h-3" />
                        SELECT FROM LIBRARY
                    </PixelButton>
                    {pendingWidget2File && (
                        <PixelButton
                            className="w-full text-[10px]"
                            onClick={handleSave2}
                        >
                            SAVE WIDGET 2
                        </PixelButton>
                    )}
                    <div className="pt-2 space-y-2">
                        <p className="text-[10px] text-muted-foreground uppercase">OR IMAGE LINK</p>
                        <div className="flex gap-2">
                            <PixelInput
                                placeholder="https://..."
                                value={urlInput2}
                                onChange={handleUrlInput2Change}
                            />
                            <PixelButton className="text-[10px]" onClick={handleSaveUrl2} disabled={!urlInput2}>SAVE</PixelButton>
                        </div>
                        {urlInput2 && (
                            <div className="relative w-20 h-20 border border-border rounded overflow-hidden">
                                <Image
                                    src={urlInput2}
                                    alt="Widget 2 Preview"
                                    fill
                                    className="object-cover"
                                    onError={() => setPreviewUrl2(null)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PixelModal isOpen={renameOpen1} onClose={() => !uploading && setRenameOpen1(false)} title="RENAME WIDGET 1">
                <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground">SET A NAME FOR YOUR WIDGET</p>
                    <PixelInput
                        value={customName1}
                        onChange={(e) => setCustomName1(e.target.value)}
                        placeholder="Enter name"
                    />
                    <div className="flex gap-3 pt-2">
                        <PixelButton
                            variant="secondary"
                            className="flex-1 text-[10px]"
                            onClick={() => setRenameOpen1(false)}
                            disabled={uploading}
                        >
                            CANCEL
                        </PixelButton>
                        <PixelButton
                            className="flex-1 text-[10px]"
                            onClick={confirmUpload1}
                            disabled={uploading || !pendingWidget1File}
                        >
                            {uploading ? 'UPLOADING…' : 'UPLOAD'}
                        </PixelButton>
                    </div>
                </div>
            </PixelModal>

            <PixelModal isOpen={renameOpen2} onClose={() => !uploading && setRenameOpen2(false)} title="RENAME WIDGET 2">
                <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground">SET A NAME FOR YOUR WIDGET</p>
                    <PixelInput
                        value={customName2}
                        onChange={(e) => setCustomName2(e.target.value)}
                        placeholder="Enter name"
                    />
                    <div className="flex gap-3 pt-2">
                        <PixelButton
                            variant="secondary"
                            className="flex-1 text-[10px]"
                            onClick={() => setRenameOpen2(false)}
                            disabled={uploading}
                        >
                            CANCEL
                        </PixelButton>
                        <PixelButton
                            className="flex-1 text-[10px]"
                            onClick={confirmUpload2}
                            disabled={uploading || !pendingWidget2File}
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
                type="image"
            />
        </PixelCard>
    )
}
