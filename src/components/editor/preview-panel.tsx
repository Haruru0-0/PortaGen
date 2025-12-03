import { Suspense, useRef } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { Monitor, Smartphone, Lock, Unlock } from "lucide-react"
import { LockScreen } from "@/components/portfolio/lock-screen"
import Desktop from "@/components/portfolio/desktop"
import { CuteSuspenseFallback } from "@/components/portfolio/suspense-fallback"
import { SoundProvider } from "@/contexts/sound-context"
import { AudioProvider } from "@/contexts/audio-context"
import { PortfolioTheme } from "@/lib/portfolio-theme"
import { useResizeObserver } from "@/hooks/use-resize-observer"

interface Icon {
    id: number
    name: string
    icon: string
    url?: string
}

interface PreviewPanelProps {
    previewMode: "desktop" | "mobile"
    isLocked: boolean
    lockScreenEnabled: boolean
    desktopGif: string
    wallpaper: string
    mobileWidget1: string
    mobileWidget2: string
    musicPlayerIcon: string
    spotifyPlaylistUrl?: string
    icons: Icon[]
    theme: PortfolioTheme
    onPreviewModeChange: (mode: "desktop" | "mobile") => void
    onLockChange: (locked: boolean) => void
}

export function PreviewPanel({
    previewMode,
    isLocked,
    lockScreenEnabled,
    onPreviewModeChange,
    onLockChange,
}: PreviewPanelProps) {
    const stageContainerRef = useRef<HTMLDivElement>(null)
    const { width: containerWidth } = useResizeObserver(stageContainerRef)
    const isNarrow = (containerWidth || 0) < 738
    return (
        <PixelCard className="">
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-sm dashboard-pixel-text-shadow">LIVE PREVIEW</h3>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => onPreviewModeChange("desktop")}
                            className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${previewMode === "desktop"
                                ? "bg-primary text-primary-foreground"
                                : "bg-card hover:bg-muted"
                                } ${isNarrow ? "opacity-60 cursor-not-allowed" : ""}`}
                            disabled={isNarrow}
                            title={isNarrow ? "Desktop preview is available on larger screens" : undefined}
                        >
                            <Monitor className="w-3 h-3" />
                            DESKTOP
                        </button>
                        <button
                            onClick={() => onPreviewModeChange("mobile")}
                            className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${previewMode === "mobile"
                                ? "bg-primary text-primary-foreground"
                                : "bg-card hover:bg-muted"
                                }`}
                        >
                            <Smartphone className="w-3 h-3" />
                            MOBILE
                        </button>

                        {lockScreenEnabled && (
                            <>
                                <button
                                    onClick={() => onLockChange(true)}
                                    className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${isLocked
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-muted"
                                        }`}
                                >
                                    <Lock className="w-3 h-3" />
                                    LOCK
                                </button>
                                <button
                                    onClick={() => onLockChange(false)}
                                    className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${!isLocked
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-muted"
                                        }`}
                                >
                                    <Unlock className="w-3 h-3" />
                                    DESKTOP
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-1 border-4 border-border relative bg-muted overflow-hidden" style={{ zIndex: 1 }}>
                    <div ref={stageContainerRef} className="w-full h-full">
                        {previewMode === "mobile" ? (
                            <div className="mx-auto max-w-[375px] h-[800px]">
                                <Suspense fallback={<CuteSuspenseFallback />}>
                                    {lockScreenEnabled && isLocked ? (
                                        <LockScreen
                                            preview={true}
                                            onUnlock={() => onLockChange(false)}
                                        />
                                    ) : (
                                        <div className="w-full h-full relative" style={{ zIndex: 1 }}>
                                            <Desktop preview={true} previewMode={previewMode} />
                                        </div>
                                    )}
                                </Suspense>
                            </div>
                        ) : (
                            <div className="mx-auto w-full" style={{ aspectRatio: "16/9" }}>
                                {isNarrow ? (
                                    <div className="w-full h-full flex items-center justify-center p-4 text-center text-[10px] sm:text-xs">
                                        Desktop preview is available on larger screens. Switch to Mobile view or widen your window.
                                    </div>
                                ) : (
                                    <div className="w-full h-full">
                                        <Suspense fallback={<CuteSuspenseFallback />}>
                                            {lockScreenEnabled && isLocked ? (
                                                <LockScreen
                                                    preview={true}
                                                    onUnlock={() => onLockChange(false)}
                                                />
                                            ) : (
                                                <div className="w-full h-full relative" style={{ zIndex: 1 }}>
                                                    <Desktop preview={true} previewMode={previewMode} />
                                                </div>
                                            )}
                                        </Suspense>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 md:gap-3 flex-wrap">
                    <PixelButton variant="secondary" className="text-[10px] flex-1 sm:flex-none">
                        ↶ UNDO
                    </PixelButton>
                    <PixelButton variant="secondary" className="text-[10px] flex-1 sm:flex-none">
                        ↷ REDO
                    </PixelButton>
                    <div className="hidden sm:block flex-1" />
                    <PixelButton variant="accent" className="text-[10px] flex-1 sm:flex-none">
                        SAVE
                    </PixelButton>
                    <PixelButton variant="primary" className="text-[10px] flex-1 sm:flex-none">
                        PUBLISH
                    </PixelButton>
                </div>
            </div>
        </PixelCard>
    )
}
