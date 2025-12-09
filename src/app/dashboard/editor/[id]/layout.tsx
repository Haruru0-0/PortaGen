"use client"

import { EditorProvider } from "@/contexts/editorContext"
import { LockScreenProvider } from "@/contexts/lockScreenContext"
import { DesktopProvider } from "@/contexts/desktopContext"
import { IconProvider } from "@/contexts/iconContext"
import { WindowsProvider } from "@/contexts/windowsContext"
import { SoundProvider } from "@/contexts/sound-context"
import { AudioProvider } from "@/contexts/audio-context"
import { ThemeProvider } from "@/contexts/theme-context"

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    return (
        <SoundProvider>
            <AudioProvider>
                <EditorProvider>
                    <ThemeProvider>
                        <DesktopProvider>
                            <LockScreenProvider>
                                <IconProvider>
                                    <WindowsProvider>
                                        {children}
                                    </WindowsProvider>
                                </IconProvider>
                            </LockScreenProvider>
                        </DesktopProvider>
                    </ThemeProvider>
                </EditorProvider>
            </AudioProvider>
        </SoundProvider>
    )
}
