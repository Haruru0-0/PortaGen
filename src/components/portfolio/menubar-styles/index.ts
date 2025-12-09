import React from "react"
import { MenubarStyleProps } from "./types"
import { LiquidGlassMenubar } from "./LiquidGlassMenubar"
import { RetroMenubar } from "./RetroMenubar"
import { PixelMenubar } from "./PixelMenubar"
import { WindowMenubar } from "./WindowMenubar"
import { WindowsXPMenubar } from "./WindowsXPMenubar"
import { Windows7Menubar } from "./Windows7Menubar"

// Map specific style IDs to components
export const MENUBAR_COMPONENTS: Record<string, React.ComponentType<MenubarStyleProps>> = {
    "liquid-glass": LiquidGlassMenubar,
    "retro": RetroMenubar,
    "pixel": PixelMenubar,
    "window": WindowMenubar,
    "windows-xp": WindowsXPMenubar,
    "windows-7": Windows7Menubar,
    // Legacy mappings
    "solid": WindowMenubar,
    "classic": RetroMenubar,
    "transparent": WindowMenubar,
}

export function getMenubarComponent(styleId: string) {
    return MENUBAR_COMPONENTS[styleId] || LiquidGlassMenubar
}
