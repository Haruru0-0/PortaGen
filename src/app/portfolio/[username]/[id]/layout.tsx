"use client"

import { LockScreenProvider } from "@/contexts/lockScreenContext"
import { DesktopProvider } from "@/contexts/desktopContext"
import { IconProvider } from "@/contexts/iconContext"
import { WindowsProvider } from "@/contexts/windowsContext"
import { SoundProvider } from "@/contexts/sound-context"
import { AudioProvider } from "@/contexts/audio-context"
import { ThemeProvider } from "@/contexts/theme-context"

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SoundProvider>
            <AudioProvider>
                <LockScreenProvider>
                    <DesktopProvider>
                        <IconProvider>
                            <WindowsProvider>
                                <ThemeProvider>
                                    {children}
                                </ThemeProvider>
                            </WindowsProvider>
                        </IconProvider>
                    </DesktopProvider>
                </LockScreenProvider>
            </AudioProvider>
        </SoundProvider>
    )
}