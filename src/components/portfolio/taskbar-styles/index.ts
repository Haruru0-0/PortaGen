import React from "react"
import { TaskbarStyleProps } from "./types"
import { LiquidGlassTaskbar } from "./LiquidGlassTaskbar"
import { Windows98Taskbar } from "./Windows98Taskbar"
import { PixelTaskbar } from "./PixelTaskbar"
import { WindowTaskbar } from "./WindowTaskbar"
import { WindowsXPTaskbar } from "./WindowsXPTaskbar"
import { Windows7Taskbar } from "./Windows7Taskbar"

// Map specific style IDs to components
export const TASKBAR_COMPONENTS: Record<string, React.ComponentType<TaskbarStyleProps>> = {
    "liquid-glass": LiquidGlassTaskbar,
    "windows-98": Windows98Taskbar,
    "pixel": PixelTaskbar,
    "window": WindowTaskbar,
    "windows-xp": WindowsXPTaskbar,
    "windows-7": Windows7Taskbar,
}

export function getTaskbarComponent(styleId: string) {
    return TASKBAR_COMPONENTS[styleId] || LiquidGlassTaskbar
}
