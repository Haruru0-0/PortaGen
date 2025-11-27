"use client"

import { SoundSettings } from "./sound-settings"
import { ModeToggle } from "./mode-toggle"

export function MobileSettingsBar({ previewMode, embedded = false }: { previewMode?: "desktop" | "mobile"; embedded?: boolean }) {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="liquidGlass-wrapper rounded-2xl">
                <div className="liquidGlass-effect"></div>
                <div className="liquidGlass-tint"></div>
                <div className="liquidGlass-shine"></div>
                <div className="liquidGlass-content">
                    <div className="flex items-center gap-3 p-4">
                        <SoundSettings previewMode={previewMode} embedded={embedded} />
                        <div className="w-px h-8 bg-white/30" /> {/* Divider */}
                        <ModeToggle previewMode={previewMode} embedded={embedded} />
                    </div>
                </div>
            </div>
        </div>
    )
}
