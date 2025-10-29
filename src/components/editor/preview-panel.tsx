import { Suspense } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { Monitor, Smartphone, Lock, Unlock } from "lucide-react"
import { LockScreen } from "@/components/portfolio/lock-screen"
import Desktop from "@/components/portfolio/desktop"
import { CuteSuspenseFallback } from "@/components/portfolio/suspense-fallback"
import { SoundProvider } from "@/components/portfolio/sound-context"
import { AudioProvider } from "@/components/portfolio/audio-context"
import { PortfolioTheme } from "@/lib/portfolio-theme"

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
    lockScreenPassword: string
    lockScreenHint: string
    lockScreenImage: string
    desktopGif: string
    wallpaper: string
    mobileWidget1: string
    mobileWidget2: string
    musicPlayerIcon: string
    icons: Icon[]
    theme: PortfolioTheme
    onPreviewModeChange: (mode: "desktop" | "mobile") => void
    onLockChange: (locked: boolean) => void
}

export function PreviewPanel({
                                 previewMode,
                                 isLocked,
                                 lockScreenEnabled,
                                 lockScreenPassword,
                                 lockScreenHint,
                                 lockScreenImage,
                                 desktopGif,
                                 wallpaper,
                                 mobileWidget1,
                                 mobileWidget2,
                                 musicPlayerIcon,
                                 icons,
                                 theme,
                                 onPreviewModeChange,
                                 onLockChange,
                             }: PreviewPanelProps) {
    return (
        <PixelCard className="">
            <div className="space-y-4 h-full flex flex-col">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-sm pixel-text-shadow">LIVE PREVIEW</h3>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={() => onPreviewModeChange("desktop")}
                            className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${
                                previewMode === "desktop"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card hover:bg-muted"
                            }`}
                        >
                            <Monitor className="w-3 h-3" />
                            DESKTOP
                        </button>
                        <button
                            onClick={() => onPreviewModeChange("mobile")}
                            className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${
                                previewMode === "mobile"
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
                                    className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${
                                        isLocked
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-card hover:bg-muted"
                                    }`}
                                >
                                    <Lock className="w-3 h-3" />
                                    LOCK
                                </button>
                                <button
                                    onClick={() => onLockChange(false)}
                                    className={`px-3 py-2 text-[10px] border-2 border-border flex items-center gap-1 ${
                                        !isLocked
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

                <div className="flex-1 border-4 border-border relative bg-muted" style={{ zIndex: 1 }}>
                    <div
                        className={`mx-auto h-full transition-all duration-300 overflow-hidden ${
                            previewMode === "mobile" ? "max-w-[375px]" : "w-full"
                        }`}
                        style={{
                            aspectRatio: previewMode === "mobile" ? "9/16" : "auto",
                        }}
                    >
                        <SoundProvider>
                            <AudioProvider>
                                <Suspense fallback={<CuteSuspenseFallback />}>
                                    {lockScreenEnabled && isLocked ? (
                                        <LockScreen
                                            password={lockScreenPassword}
                                            hint={lockScreenHint}
                                            wallpaper={lockScreenImage || "/beautiful-pastel-gradient-wallpaper.jpg"}
                                            onUnlock={() => onLockChange(false)}
                                        />
                                    ) : (
                                        <div className="w-full h-full relative" style={{ zIndex: 1 }}>
                                            <Desktop
                                                mobileWidget1={mobileWidget1 || "/water-cd.jpg"}
                                                mobileWidget2={mobileWidget2 || "/cute-puppy.png"}
                                                musicPlayerIcon={musicPlayerIcon}
                                                desktopGif={desktopGif || "/cute-greeting-gif.jpg"}
                                                wallpaper={wallpaper || "/beautiful-pastel-gradient-wallpaper.jpg"}
                                                icons={icons}
                                                theme={theme}
                                            />
                                        </div>
                                    )}
                                </Suspense>
                            </AudioProvider>
                        </SoundProvider>
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