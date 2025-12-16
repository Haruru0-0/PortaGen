"use client"

import { useThemeStore } from "@/lib/stores/theme-store"
import { LiquidGlassWindow } from "./window-styles/LiquidGlassWindow"
import { Window98Window } from "./window-styles/Window98Window"
import { PixelWindow } from "./window-styles/PixelWindow"
import { WindowWindow } from "./window-styles/WindowWindow"
import { WindowsXPWindow } from "./window-styles/WindowsXPWindow"
import { Windows7Window } from "./window-styles/Windows7Window"

export function Window({
  title,
  children,
  onClose,
  onMinimize,
  isMobile = false,
  isMinimized = false,
}: {
  title: string
  children: React.ReactNode
  onClose?: () => void
  onMinimize?: () => void
  isMobile?: boolean
  isMinimized?: boolean
}) {
  const { windowStyleId } = useThemeStore()
  const styleId = windowStyleId || "liquid-glass"

  let content
  switch (styleId) {
    case "liquid-glass":
      content = <LiquidGlassWindow title={title} onClose={onClose} onMinimize={onMinimize} isMobile={isMobile} isMinimized={isMinimized}>{children}</LiquidGlassWindow>
      break
    case "windows-98":
      content = <Window98Window title={title} onClose={onClose} onMinimize={onMinimize} isMobile={isMobile} isMinimized={isMinimized}>{children}</Window98Window>
      break
    case "pixel":
      content = <PixelWindow title={title} onClose={onClose} onMinimize={onMinimize} isMobile={isMobile} isMinimized={isMinimized}>{children}</PixelWindow>
      break
    case "window":
      content = <WindowWindow title={title} onClose={onClose} onMinimize={onMinimize} isMobile={isMobile} isMinimized={isMinimized}>{children}</WindowWindow>
      break
    case "windows-xp":
      content = <WindowsXPWindow title={title} onClose={onClose} onMinimize={onMinimize} isMobile={isMobile} isMinimized={isMinimized}>{children}</WindowsXPWindow>
      break
    case "windows-7":
      content = <Windows7Window title={title} onClose={onClose} onMinimize={onMinimize} isMobile={isMobile} isMinimized={isMinimized}>{children}</Windows7Window>
      break
    default:
      content = <LiquidGlassWindow title={title} onClose={onClose} onMinimize={onMinimize} isMobile={isMobile} isMinimized={isMinimized}>{children}</LiquidGlassWindow>
  }

  return content
}
