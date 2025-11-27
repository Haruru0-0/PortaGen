import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { useDesktopContext } from "@/contexts/desktopContext"
import { useEffect, useState } from "react"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { useFileUpload } from "@/hooks/use-file-upload"
import { useParams } from "next/navigation";

export function MobileWidgetsTab() {
    const params = useParams<{ id: string }>()
    const currentPortfolioId = Number(params?.id)
    const { data, getDesktopData, updateWidget } = useDesktopContext()
    const { uploadFile, uploading } = useFileUpload()

    const [renameOpen, setRenameOpen] = useState(false)
    const [pendingFile, setPendingFile] = useState<File | null>(null)
    const [pendingIndex, setPendingIndex] = useState<1 | 2 | null>(null)
    const [customName, setCustomName] = useState("")

    useEffect(() => {
        if (currentPortfolioId) void getDesktopData(currentPortfolioId)
    }, [currentPortfolioId])

    const beginWidgetUpload = (file: File, index: 1 | 2) => {
        if (!currentPortfolioId) return
        const base = file.name.replace(/\.[^/.]+$/, "")
        setPendingFile(file)
        setPendingIndex(index)
        setCustomName(base)
        setRenameOpen(true)
    }
    const onUploadWidget1 = async (file: File) => beginWidgetUpload(file, 1)
    const onUploadWidget2 = async (file: File) => beginWidgetUpload(file, 2)

    const confirmUpload = async () => {
        if (!pendingFile || !currentPortfolioId || !pendingIndex) return
        const name = customName.trim() || pendingFile.name.replace(/\.[^/.]+$/, "")
        // Use 'icon' category for widget images
        const result = await uploadFile(pendingFile, 'icon', name)
        if (result?.success && result.data?.id) {
            await updateWidget(currentPortfolioId, pendingIndex, result.data.id)
            setRenameOpen(false)
            setPendingFile(null)
            setPendingIndex(null)
            setCustomName("")
        } else if (!result?.success) {
            alert(result?.error || 'Upload failed')
        }
    }

    const onSave = async () => undefined

    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm dashboard-pixel-text-shadow">MOBILE WIDGETS</h3>
                <FileUpload accept="image/*" onFileSelect={onUploadWidget1} label="WIDGET 1"
                    preview={data?.widget1Url || ''} maxSize={5} />
                <FileUpload accept="image/*" onFileSelect={onUploadWidget2} label="WIDGET 2"
                    preview={data?.widget2Url || ''} maxSize={5} />
            </div>
            <div className="mt-6">
                <PixelButton onClick={onSave} className="w-full text-[10px]"
                    disabled={uploading}>{uploading ? 'UPLOADING…' : 'SAVE'}</PixelButton>
            </div>

            <PixelModal isOpen={renameOpen} onClose={() => !uploading && setRenameOpen(false)} title="RENAME WIDGET">
                <div className="space-y-4">
                    <p className="text-[10px] text-muted-foreground">SET A NAME FOR YOUR WIDGET IMAGE</p>
                    <PixelInput value={customName} onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Enter name" />
                    <div className="flex gap-3 pt-2">
                        <PixelButton variant="secondary" className="flex-1 text-[10px]"
                            onClick={() => setRenameOpen(false)} disabled={uploading}>CANCEL</PixelButton>
                        <PixelButton className="flex-1 text-[10px]" onClick={confirmUpload}
                            disabled={uploading || !pendingFile}>{uploading ? 'UPLOADING…' : 'UPLOAD'}</PixelButton>
                    </div>
                </div>
            </PixelModal>
        </PixelCard>
    )
}
