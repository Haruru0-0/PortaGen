import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { FileUpload } from "@/components/file-upload"
import { Trash2, Library } from "lucide-react"

interface Music {
    id: number
    name: string
    url: string
    type: "spotify" | "upload"
}

interface MusicTabProps {
    musicTracks: Music[]
    uploadedMusic: string
    onUpload: (file: File) => void
    onDelete: (id: number) => void
    onOpenLibrary: () => void
    onSave: () => void
}

export function MusicTab({
                             musicTracks,
                             uploadedMusic,
                             onUpload,
                             onDelete,
                             onOpenLibrary,
                             onSave,
                         }: MusicTabProps) {
    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm pixel-text-shadow">MUSIC</h3>

                <FileUpload
                    accept="audio/*"
                    onFileSelect={onUpload}
                    preview={uploadedMusic}
                    label="UPLOAD AUDIO"
                    maxSize={10}
                />

                <PixelButton
                    variant="secondary"
                    className="w-full text-[10px] flex items-center justify-center gap-2"
                    onClick={onOpenLibrary}
                >
                    <Library className="w-4 h-4" />
                    CHOOSE FROM LIBRARY
                </PixelButton>

                <div className="space-y-3">
                    <p className="text-[10px]">TRACKS ({musicTracks.length})</p>
                    {musicTracks.map((track) => (
                        <div key={track.id} className="border-2 border-border p-3 bg-muted">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="w-8 h-8 bg-primary flex items-center justify-center text-xs">
                                        ♪
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] truncate">{track.name}</p>
                                        <p className="text-[8px] text-muted-foreground">
                                            {track.type.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDelete(track.id)}
                                    className="w-8 h-8 border-2 border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center ml-2"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-6">
                <PixelButton onClick={onSave} className="w-full text-[10px]">
                    SAVE
                </PixelButton>
            </div>
        </PixelCard>
    )
}