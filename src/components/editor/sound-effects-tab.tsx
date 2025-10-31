import { PixelCard } from "@/components/pixel-card"
import { SoundEditor } from "@/components/sound-editor"
import { Volume2 } from "lucide-react"

interface SoundEffect {
    id: string
    name: string
    url: string
    volume: number
}

interface SoundEffectsTabProps {
    soundEffects: SoundEffect[]
    onSoundsChange: (sounds: SoundEffect[]) => void
}

export function SoundEffectsTab({ soundEffects, onSoundsChange }: SoundEffectsTabProps) {
    return (
        <PixelCard>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <h3 className="text-sm pixel-text-shadow">SOUND EFFECTS</h3>
                </div>

                <p className="text-[10px] text-muted-foreground">
                    Customize sound effects for different interactions in your portfolio
                </p>

                <SoundEditor sounds={soundEffects} onSoundsChange={onSoundsChange} />

                <div className="border-t-2 border-border pt-4">
                    <div className="text-[10px] text-muted-foreground space-y-2">
                        <p><strong>Tips:</strong></p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Use short sound effects for better performance</li>
                            <li>Test volume levels to ensure they're not too loud</li>
                            <li>Consider users who may have sound sensitivity</li>
                            <li>Supported formats: MP3, WAV, OGG</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PixelCard>
    )
}