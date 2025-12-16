"use client"


import { LockScreenProvider } from "@/contexts/lockScreenContext"
import { DesktopProvider } from "@/contexts/desktopContext"
import { IconProvider } from "@/contexts/iconContext"
import { WindowsProvider } from "@/contexts/windowsContext"
import { SoundProvider } from "@/contexts/sound-context"
import { AudioProvider } from "@/contexts/audio-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SoundEffectProvider } from "@/contexts/soundEffectContext"

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    return (
        <SoundProvider>
            <AudioProvider>
                <ThemeProvider>
                    <DesktopProvider>
                        <LockScreenProvider>
                            <IconProvider>
                                <WindowsProvider>
                                    <SoundEffectProvider>
                                        {children}
                                    </SoundEffectProvider>
                                </WindowsProvider>
                            </IconProvider>
                        </LockScreenProvider>
                    </DesktopProvider>
                </ThemeProvider>
            </AudioProvider>
        </SoundProvider>
    )
}
