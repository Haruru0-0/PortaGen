import React from "react"
import { WindowStyleProps } from "./types"
import { LiquidGlassWindow } from "./LiquidGlassWindow"
import { Window98Window } from "./Window98Window"
import { PixelWindow } from "./PixelWindow"
import { WindowWindow } from "./WindowWindow"
import { WindowsXPWindow } from "./WindowsXPWindow"
import { Windows7Window } from "./Windows7Window"

// Map specific style IDs to components
export const WINDOW_COMPONENTS: Record<string, React.ComponentType<WindowStyleProps>> = {
    "liquid-glass": LiquidGlassWindow,
    "windows-98": Window98Window,
    "pixel": PixelWindow,
    "window": WindowWindow,
    "windows-xp": WindowsXPWindow,
    "windows-7": Windows7Window,
}

export function getWindowComponent(styleId: string) {
    return WINDOW_COMPONENTS[styleId] || LiquidGlassWindow
}