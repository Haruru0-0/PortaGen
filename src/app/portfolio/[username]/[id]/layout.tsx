"use client"

import { LockScreenProvider } from "@/contexts/lockScreenContext"
import { DesktopProvider } from "@/contexts/desktopContext"
import { IconProvider } from "@/contexts/iconContext"
import { WindowsProvider } from "@/contexts/windowsContext"
import { SoundProvider } from "@/contexts/sound-context"
import { AudioProvider } from "@/contexts/audio-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SoundEffectProvider } from "@/contexts/soundEffectContext"
import { useThemeStore } from "@/lib/stores/theme-store"
import { PORTFOLIO_FONTS } from "@/lib/fonts"

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const font = useThemeStore((state) => state.font)
    const selectedFont = PORTFOLIO_FONTS.find(f => f.name === font) || PORTFOLIO_FONTS[0]

    return (
        <SoundProvider>
            <AudioProvider>
                <LockScreenProvider>
                    <DesktopProvider>
                        <IconProvider>
                            <WindowsProvider>
                                <ThemeProvider>
                                    <SoundEffectProvider>
                                        <div className={selectedFont.className}>
                                            {children}
                                        </div>
                                    </SoundEffectProvider>
                                </ThemeProvider>
                            </WindowsProvider>
                        </IconProvider>
                    </DesktopProvider>
                </LockScreenProvider>
            </AudioProvider>
        </SoundProvider>
    )
}