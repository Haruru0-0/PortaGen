import React from "react"
import { WindowStyleProps } from "./types"
import { LiquidGlassWindow } from "./LiquidGlassWindow"
import { RetroWindow } from "./RetroWindow"
import { PixelWindow } from "./PixelWindow"
import { WindowWindow } from "./WindowWindow"
import { WindowsXPWindow } from "./WindowsXPWindow"
import { Windows7Window } from "./Windows7Window"

// Map specific style IDs to components
export const WINDOW_COMPONENTS: Record<string, React.ComponentType<WindowStyleProps>> = {
    "liquid-glass": LiquidGlassWindow,
    "retro": RetroWindow,
    "pixel": PixelWindow,
    "window": WindowWindow,
    "windows-xp": WindowsXPWindow,
    "windows-7": Windows7Window,
    // Legacy mappings
    "solid": WindowWindow,
    "glass": LiquidGlassWindow,
    "classic": RetroWindow,
    "macos": LiquidGlassWindow,
}

export function getWindowComponent(styleId: string) {
    return WINDOW_COMPONENTS[styleId] || LiquidGlassWindow
}