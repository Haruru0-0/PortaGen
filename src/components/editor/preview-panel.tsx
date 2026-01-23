import { Suspense, useRef, useState } from "react"
import { PixelCard } from "@/components/pixel-card"
import { Monitor, Smartphone, Lock, Unlock, Maximize2, Minimize2 } from "lucide-react"
import { LockScreen } from "@/components/portfolio/lock-screen"
import Desktop from "@/components/portfolio/desktop"
import { CuteSuspenseFallback } from "@/components/portfolio/suspense-fallback"
import { useResizeObserver } from "@/hooks/use-resize-observer"
import { useEditorUIStore } from "@/lib/stores/ui-store"
import { useLockScreenStore } from "@/lib/stores/lock-screen-store"
import { useThemeStore } from "@/lib/stores/theme-store"
import { PORTFOLIO_FONTS } from "@/lib/fonts"


export function PreviewPanel() {
    const [isFullScreen, setIsFullScreen] = useState(false)
    const stageContainerRef = useRef<HTMLDivElement>(null)
    const { width: containerWidth } = useResizeObserver(stageContainerRef)
    const isNarrow = (containerWidth || 0) < 738
    const {
        previewMode,
        setPreviewMode,
    } = useEditorUIStore()
    const {
        isLocked,
        setIsLocked
    } = useLockScreenStore()
    const font = useThemeStore((state) => state.font)

    // Get the font class based on the selected font name
    const selectedFont = PORTFOLIO_FONTS.find((f) => f.name === font)
    const fontClass = selectedFont?.className || ""

    return (
        <PixelCard className={`transition-all duration-300 ${isFullScreen ? "fixed inset-0 z-50 m-0 rounded-none w-screen h-screen border-0" : ""}`}>
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center justify-between flex-wrap gap-4">
                    <h3 className="text-sm dashboard-pixel-text-shadow">LIVE PREVIEW</h3>
                    <div className="flex gap-3 flex-col md:flex-row flex-wrap md:items-center">
                        {/* Screen Size Toggle */}
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <span className="text-[9px] text-muted-foreground font-bold uppercase">View:</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPreviewMode("desktop")}
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
                                    onClick={() => setPreviewMode("mobile")}
                                    className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${previewMode === "mobile"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-muted"
                                        }`}
                                >
                                    <Smartphone className="w-3 h-3" />
                                    MOBILE
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            {/* Page Toggle */}
                            <span className="text-[9px] text-muted-foreground font-bold uppercase">Page:</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsLocked(true)}
                                    className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${isLocked
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-muted"
                                        }`}
                                >
                                    <Lock className="w-3 h-3" />
                                    LOCK
                                </button>
                                <button
                                    onClick={() => setIsLocked(false)}
                                    className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${!isLocked
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-muted"
                                        }`}
                                >
                                    <Unlock className="w-3 h-3" />
                                    HOME
                                </button>
                            </div>
                        </div>

                        {/* Full Screen Toggle */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 bg-card hover:bg-muted`}
                                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
                            >
                                {isFullScreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                                {isFullScreen ? "EXIT" : "MAXIMIZE"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 border-4 border-border relative bg-muted overflow-hidden" style={{ zIndex: 1 }}>
                    <div ref={stageContainerRef} className={`w-full h-full ${fontClass}`}>
                        {previewMode === "mobile" ? (
                            <div className="mx-auto max-w-[375px] h-[800px]">
                                <Suspense fallback={<CuteSuspenseFallback />}>
                                    {isLocked ? (
                                        <LockScreen
                                            preview={true}
                                            onUnlock={() => setIsLocked(false)}
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
                                            {isLocked ? (
                                                <LockScreen
                                                    preview={true}
                                                    onUnlock={() => setIsLocked(false)}
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
            </div>
        </PixelCard>
    )
}
