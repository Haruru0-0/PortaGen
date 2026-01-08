"use client"

import { useState, useEffect } from "react"
import { useDesktopStore } from "@/lib/stores/desktop-store"
import { useThemeStore } from "@/lib/stores/theme-store"
import { LiquidGlassMenubar } from "./menubar-styles/LiquidGlassMenubar"
import { Windows98Menubar } from "./menubar-styles/Windows98Menubar"
import { PixelMenubar } from "./menubar-styles/PixelMenubar"
import { WindowMenubar } from "./menubar-styles/WindowMenubar"
import { WindowsXPMenubar } from "./menubar-styles/WindowsXPMenubar"
import { Windows7Menubar } from "./menubar-styles/Windows7Menubar"

export default function MenuBar({ embedded = false, previewMode }: { embedded?: boolean; previewMode?: "desktop" | "mobile" }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { menubarStyleId } = useThemeStore()
  const { menubarIcon, menubarText } = useDesktopStore()
  const styleId = menubarStyleId || "liquid-glass"

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const commonProps = {
    embedded,
    previewMode,
    currentTime,
    menubarIcon,
    menubarText
  }

  let content
  switch (styleId) {
    case "liquid-glass":
      content = <LiquidGlassMenubar {...commonProps} />
      break
    case "windows-98":
      content = <Windows98Menubar {...commonProps} />
      break
    case "pixel":
      content = <PixelMenubar {...commonProps} />
      break
    case "window":
      content = <WindowMenubar {...commonProps} />
      break
    case "windows-xp":
      content = <WindowsXPMenubar {...commonProps} />
      break
    case "windows-7":
      content = <Windows7Menubar {...commonProps} />
      break
    default:
      content = <LiquidGlassMenubar {...commonProps} />
  }

  return content
}