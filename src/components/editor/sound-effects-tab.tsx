import { PixelCard } from "@/components/pixel-card"
import { Volume2, Play } from "lucide-react"
import { useAppSound } from "@/contexts/sound-context"
import { useSoundEffects } from "@/contexts/soundEffectContext"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PixelButton } from "../pixel-button"

export function SoundEffectsTab() {
    const { presets, currentPreset, playClickSound, setPreset } = useAppSound()
    const { soundEffects, isLoading, error, fetchSoundEffects, updateSoundEffects } = useSoundEffects()

    // Get portfolioId from URL like other tabs
    const params = useParams<{ id: string }>()
    const currentPortfolioId = Number(params?.id)

    // Track selected preset for saving
    const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null)

    const handlePreview = (presetId: string) => {
        // Find the preset to preview
        const presetToPreview = presets.find(preset => preset.id === presetId)
        if (!presetToPreview) return

        // Create a temporary audio context for preview without changing state
        const tempAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

        // Play the preview sound directly without changing the current preset
        const oscillator = tempAudioContext.createOscillator()
        const gainNode = tempAudioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(tempAudioContext.destination)

        // Use the preset's click sound settings for preview
        const clickSound = presetToPreview.sounds.click
        oscillator.frequency.setValueAtTime(clickSound.frequency, tempAudioContext.currentTime)
        oscillator.type = clickSound.type

        // Apply envelope if available
        const env = clickSound.envelope || {}
        const attack = env.attack || 0.01
        const decay = env.decay || 0.02
        const sustain = env.sustain || 0.7
        const release = env.release || 0.1
        const sustainLevel = 0.3 * sustain
        const sustainTime = clickSound.duration - attack - decay - release

        gainNode.gain.setValueAtTime(0, tempAudioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, tempAudioContext.currentTime + attack)
        gainNode.gain.linearRampToValueAtTime(sustainLevel, tempAudioContext.currentTime + attack + decay)
        gainNode.gain.setValueAtTime(sustainLevel, tempAudioContext.currentTime + attack + decay + Math.max(0, sustainTime))
        gainNode.gain.linearRampToValueAtTime(0.001, tempAudioContext.currentTime + clickSound.duration)

        oscillator.start(tempAudioContext.currentTime)
        oscillator.stop(tempAudioContext.currentTime + clickSound.duration)

        // Clean up the temporary audio context after playback
        setTimeout(() => {
            tempAudioContext.close()
        }, clickSound.duration * 1000 + 100)
    }

    const handleSelect = (presetId: string) => {
        setSelectedPresetId(presetId)
        setPreset(presetId) // Update sound context for immediate audio feedback
    }

    const handleSave = async () => {
        if (selectedPresetId && currentPortfolioId) {
            try {
                await updateSoundEffects(currentPortfolioId, selectedPresetId)
                // Reset selected preset after saving
                setSelectedPresetId(null)
            } catch (error) {
                console.error('Failed to save sound effects:', error)
                // Toast notifications are now handled by the context
            }
        }
    }

    // Fetch sound effects when component mounts
    useEffect(() => {
        if (currentPortfolioId) {
            fetchSoundEffects(currentPortfolioId)
        }
    }, [currentPortfolioId, fetchSoundEffects])

    return (
        <PixelCard>
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <h3 className="text-sm dashboard-pixel-text-shadow">SOUND PRESETS</h3>
                </div>

                <p className="text-[10px] text-muted-foreground">
                    Choose from different 8-bit sound presets for your portfolio
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presets.map((preset) => (
                        <div
                            key={preset.id}
                            className={`border-2 border-border p-3 rounded-lg pixel-retro-card ${currentPreset === preset.id ? 'pixel-retro-card-selected' : 'pixel-retro-card-white'}`}
                            onClick={() => handleSelect(preset.id)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-medium text-sm pixel-retro-text">{preset.name}</h4>
                                    <p className="text-xs text-muted-foreground pixel-retro-description">{preset.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePreview(preset.id)
                                        }}
                                        className="p-1 hover:bg-accent rounded pixel-retro-button"
                                        title="Preview"
                                    >
                                        <Play className="w-4 h-4 pixel-retro-icon" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <PixelButton
                    onClick={handleSave}
                    className="w-full text-[10px]"
                    disabled={isLoading}
                >
                    {isLoading ? 'SAVING…' : 'SAVE'}
                </PixelButton>

                <div className="border-t-2 border-border pt-4">
                    <div className="text-[10px] text-muted-foreground space-y-2">
                        <p><strong>Tips:</strong></p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Click the play button to preview a preset's sounds</li>
                            <li>Click a preset to select it</li>
                            <li>Click "Save" to save your selection</li>
                            <li>Each preset has unique sounds for different interactions</li>
                        </ul>
                    </div>
                </div>
            </div>
        </PixelCard>
    )
}