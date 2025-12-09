import React from "react"
import { TaskbarStyleProps } from "./types"
import { LiquidGlassTaskbar } from "./LiquidGlassTaskbar"
import { RetroTaskbar } from "./RetroTaskbar"
import { PixelTaskbar } from "./PixelTaskbar"
import { WindowTaskbar } from "./WindowTaskbar"
import { WindowsXPTaskbar } from "./WindowsXPTaskbar"
import { Windows7Taskbar } from "./Windows7Taskbar"

// Map specific style IDs to components
export const TASKBAR_COMPONENTS: Record<string, React.ComponentType<TaskbarStyleProps>> = {
    "liquid-glass": LiquidGlassTaskbar,
    "retro": RetroTaskbar,
    "pixel": PixelTaskbar,
    "window": WindowTaskbar,
    "windows-xp": WindowsXPTaskbar,
    "windows-7": Windows7Taskbar,
    // Legacy mappings
    "solid": WindowTaskbar,
    "glass": LiquidGlassTaskbar,
    "classic": RetroTaskbar,
    "macos": LiquidGlassTaskbar,
}

export function getTaskbarComponent(styleId: string) {
    return TASKBAR_COMPONENTS[styleId] || LiquidGlassTaskbar
}
