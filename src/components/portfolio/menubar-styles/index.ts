import React from "react"
import { MenubarStyleProps } from "./types"
import { LiquidGlassMenubar } from "./LiquidGlassMenubar"
import { Windows98Menubar } from "./Windows98Menubar"
import { PixelMenubar } from "./PixelMenubar"
import { WindowMenubar } from "./WindowMenubar"
import { WindowsXPMenubar } from "./WindowsXPMenubar"
import { Windows7Menubar } from "./Windows7Menubar"

// Map specific style IDs to components
export const MENUBAR_COMPONENTS: Record<string, React.ComponentType<MenubarStyleProps>> = {
    "liquid-glass": LiquidGlassMenubar,
    "windows-98": Windows98Menubar,
    "pixel": PixelMenubar,
    "window": WindowMenubar,
    "windows-xp": WindowsXPMenubar,
    "windows-7": Windows7Menubar,
}

export function getMenubarComponent(styleId: string) {
    return MENUBAR_COMPONENTS[styleId] || LiquidGlassMenubar
}

export function getMenubarJSX(styleId: string, props: MenubarStyleProps): React.JSX.Element {
    const Component = getMenubarComponent(styleId)
    return React.createElement(Component, props)
}
