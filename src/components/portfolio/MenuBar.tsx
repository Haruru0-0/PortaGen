"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/theme-context"
import { getMenubarComponent } from "./menubar-styles"

export default function MenuBar({ embedded = false, previewMode }: { embedded?: boolean; previewMode?: "desktop" | "mobile" }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { activeTheme } = useTheme()
  const styleId = activeTheme.menubarStyleId || "liquid-glass"

  const MenubarComponent = getMenubarComponent(styleId)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <MenubarComponent
      embedded={embedded}
      previewMode={previewMode}
      currentTime={currentTime}
    />
  )
}