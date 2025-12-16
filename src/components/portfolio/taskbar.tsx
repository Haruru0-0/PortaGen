"use client"

import type React from "react"
import { useThemeStore } from "@/lib/stores/theme-store"
import { LiquidGlassTaskbar } from "./taskbar-styles/LiquidGlassTaskbar"
import { Windows98Taskbar } from "./taskbar-styles/Windows98Taskbar"
import { PixelTaskbar } from "./taskbar-styles/PixelTaskbar"
import { WindowTaskbar } from "./taskbar-styles/WindowTaskbar"
import { WindowsXPTaskbar } from "./taskbar-styles/WindowsXPTaskbar"
import { Windows7Taskbar } from "./taskbar-styles/Windows7Taskbar"
import { useAppSound } from "../../contexts/sound-context"

interface TaskbarProps {
  apps: {
    id: string
    label: string
    icon: string
  }[]
  openWindows: {
    name: string
    minimized: boolean
    component?: React.ReactNode
  }[]
  onAppClick: (label: string) => void
  className?: string
  embedded?: boolean
}

export function Taskbar(props: TaskbarProps) {
  const { playHoverSound } = useAppSound()
  const { taskbarStyleId } = useThemeStore()
  const styleId = taskbarStyleId || "liquid-glass"

  let content
  switch (styleId) {
    case "liquid-glass":
      content = <LiquidGlassTaskbar {...props} handleMouseEnter={playHoverSound} />
      break
    case "windows-98":
      content = <Windows98Taskbar {...props} handleMouseEnter={playHoverSound} />
      break
    case "pixel":
      content = <PixelTaskbar {...props} handleMouseEnter={playHoverSound} />
      break
    case "window":
      content = <WindowTaskbar {...props} handleMouseEnter={playHoverSound} />
      break
    case "windows-xp":
      content = <WindowsXPTaskbar {...props} handleMouseEnter={playHoverSound} />
      break
    case "windows-7":
      content = <Windows7Taskbar {...props} handleMouseEnter={playHoverSound} />
      break
    default:
      content = <LiquidGlassTaskbar {...props} handleMouseEnter={playHoverSound} />
  }

  return content
}
