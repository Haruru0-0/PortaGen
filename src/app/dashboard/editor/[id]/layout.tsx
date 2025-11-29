"use client"

import { EditorProvider } from "@/contexts/editorContext"
import { LockScreenProvider } from "@/contexts/lockScreenContext"
import { DesktopProvider } from "@/contexts/desktopContext"
import { IconProvider } from "@/contexts/iconContext"
import { WindowsProvider } from "@/contexts/windowsContext"

export default function EditorLayout({ children }: { children: React.ReactNode }) {
    return (
        <EditorProvider>
            <DesktopProvider>
                <LockScreenProvider>
                    <IconProvider>
                        <WindowsProvider>
                            {children}
                        </WindowsProvider>
                    </IconProvider>
                </LockScreenProvider>
            </DesktopProvider>
        </EditorProvider>
    )
}
