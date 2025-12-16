"use client"

import { useState, useEffect } from "react"
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
  const styleId = menubarStyleId || "liquid-glass"

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  let content
  switch (styleId) {
    case "liquid-glass":
      content = <LiquidGlassMenubar embedded={embedded} previewMode={previewMode} currentTime={currentTime} />
      break
    case "windows-98":
      content = <Windows98Menubar embedded={embedded} previewMode={previewMode} currentTime={currentTime} />
      break
    case "pixel":
      content = <PixelMenubar embedded={embedded} previewMode={previewMode} currentTime={currentTime} />
      break
    case "window":
      content = <WindowMenubar embedded={embedded} previewMode={previewMode} currentTime={currentTime} />
      break
    case "windows-xp":
      content = <WindowsXPMenubar embedded={embedded} previewMode={previewMode} currentTime={currentTime} />
      break
    case "windows-7":
      content = <Windows7Menubar embedded={embedded} previewMode={previewMode} currentTime={currentTime} />
      break
    default:
      content = <LiquidGlassMenubar embedded={embedded} previewMode={previewMode} currentTime={currentTime} />
  }

  return content
}