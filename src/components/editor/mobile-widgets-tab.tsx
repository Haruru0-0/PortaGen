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

export function MobileWidgetsTab() {
    const params = useParams<{ id: string }>()
    const currentPortfolioId = Number(params?.id)
    const { data, getDesktopData, updateWidget } = useDesktopContext()
    const { mobileWidget1, mobileWidget2, setMobileWidget1, setMobileWidget2, pendingWidget1File, setPendingWidget1File, pendingWidget2File, setPendingWidget2File } = useDesktopStore()
    const { uploadFile, uploading } = useFileUpload()

    const [renameOpen1, setRenameOpen1] = useState(false)
    const [renameOpen2, setRenameOpen2] = useState(false)
    const [customName1, setCustomName1] = useState("")
    const [customName2, setCustomName2] = useState("")
    const [previewUrl1, setPreviewUrl1] = useState<string | null>(null)
    const [previewUrl2, setPreviewUrl2] = useState<string | null>(null)

    useEffect(() => {
        if (currentPortfolioId) void getDesktopData(currentPortfolioId)
    }, [currentPortfolioId])


    useEffect(() => {
        return () => {
            if (previewUrl1) URL.revokeObjectURL(previewUrl1)
            if (previewUrl2) URL.revokeObjectURL(previewUrl2)
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

    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm dashboard-pixel-text-shadow">MOBILE WIDGETS</h3>
                <div className="space-y-2">
                    <FileUpload accept="image/*" onFileSelect={onUploadWidget1} label="WIDGET 1"
                        preview={previewUrl1 || data?.widget1Url || ''} maxSize={5} />
                    {pendingWidget1File && (
                        <PixelButton
                            className="w-full text-[10px]"
                            onClick={handleSave1}
                        >
                            SAVE WIDGET 1
                        </PixelButton>
                    )}
                </div>
                <div className="space-y-2">
                    <FileUpload accept="image/*" onFileSelect={onUploadWidget2} label="WIDGET 2"
                        preview={previewUrl2 || data?.widget2Url || ''} maxSize={5} />
                    {pendingWidget2File && (
                        <PixelButton
                            className="w-full text-[10px]"
                            onClick={handleSave2}
                        >
                            SAVE WIDGET 2
                        </PixelButton>
                    )}
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
        </PixelCard>
    )
}
