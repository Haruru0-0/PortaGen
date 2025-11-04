import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelButton } from "@/components/pixel-button"

interface LockScreenSettingsTabProps {
    lockScreenEnabled: boolean
    lockScreenPassword: string
    lockScreenHint: string
    mobileWidget1: string
    mobileWidget2: string
    musicPlayerIcon: string
    onToggleLockScreen: () => void
    onPasswordChange: (value: string) => void
    onHintChange: (value: string) => void
    onWidget1Upload: (file: File) => void
    onWidget2Upload: (file: File) => void
    onMusicPlayerIconUpload: (file: File) => void
    onSave: () => void
}

export function LockScreenSettingsTab({
                                          lockScreenEnabled,
                                          lockScreenPassword,
                                          lockScreenHint,
                                          onToggleLockScreen,
                                          onPasswordChange,
                                          onHintChange,
                                          onSave,
                                      }: LockScreenSettingsTabProps) {
    return (
        <PixelCard>
            <div className="space-y-4">
                <h3 className="text-sm pixel-text-shadow">LOCK SCREEN SETTINGS</h3>

                <div className="flex items-center justify-between p-3 border-2 border-border bg-muted">
                    <span className="text-[10px]">ENABLE LOCK SCREEN</span>
                    <button
                        onClick={onToggleLockScreen}
                        className={`w-12 h-6 rounded-full border-2 border-border transition-colors ${
                            lockScreenEnabled ? "bg-primary" : "bg-muted-foreground"
                        }`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                lockScreenEnabled ? "translate-x-6" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>

                {lockScreenEnabled && (
                    <>
                        <PixelInput
                            label="PASSWORD"
                            type="password"
                            value={lockScreenPassword}
                            onChange={(e) => onPasswordChange(e.target.value)}
                            placeholder="Enter password"
                        />

                        <PixelInput
                            label="PASSWORD HINT"
                            value={lockScreenHint}
                            onChange={(e) => onHintChange(e.target.value)}
                            placeholder="Enter hint"
                        />
                    </>
                )}
            </div>
            <div className="mt-6">
                <PixelButton onClick={onSave} className="w-full text-[10px]">
                    SAVE
                </PixelButton>
            </div>
        </PixelCard>
    )
}