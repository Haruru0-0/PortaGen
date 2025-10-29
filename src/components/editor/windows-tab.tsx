import { PixelCard } from "@/components/pixel-card"
import { SoundEditor } from "@/components/sound-editor"
import { Edit2 } from "lucide-react"

interface WindowContent {
    id: string
    name: string
    enabled: boolean
    data: any
}

interface SoundEffect {
    id: string
    name: string
    url: string
    volume: number
}

interface WindowsTabProps {
    windowContents: WindowContent[]
    soundEffects: SoundEffect[]
    onToggleWindow: (id: string) => void
    onEditWindow: (window: WindowContent) => void
    onSoundsChange: (sounds: SoundEffect[]) => void
}

export function WindowsTab({
                               windowContents,
                               soundEffects,
                               onToggleWindow,
                               onEditWindow,
                               onSoundsChange,
                           }: WindowsTabProps) {
    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm pixel-text-shadow">WINDOW CONTENT</h3>
                <p className="text-[10px] text-muted-foreground">
                    Manage which windows appear and edit their content
                </p>

                <div className="space-y-3">
                    {windowContents.map((window) => (
                        <div
                            key={window.id}
                            className="flex items-center justify-between p-3 border-2 border-border bg-muted hover:bg-accent transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={window.enabled}
                                    onChange={() => onToggleWindow(window.id)}
                                    className="w-4 h-4"
                                />
                                <span className="text-[10px]">{window.name}</span>
                            </div>
                            <button
                                onClick={() => onEditWindow(window)}
                                className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                            >
                                <Edit2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t-2 border-border">
                    <SoundEditor sounds={soundEffects} onSoundsChange={onSoundsChange} />
                </div>
            </div>
        </PixelCard>
    )
}