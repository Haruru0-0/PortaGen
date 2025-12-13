"use client"

import { useTheme } from "@/contexts/theme-context"
import { getWindowComponent } from "./window-styles"

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
  const { activeTheme } = useTheme()
  const styleId = activeTheme.windowStyleId || "liquid-glass"

  const WindowComponent = getWindowComponent(styleId)

  return (
    <WindowComponent
      title={title}
      onClose={onClose}
      onMinimize={onMinimize}
      isMobile={isMobile}
      isMinimized={isMinimized}
    >
      {children}
    </WindowComponent>
  )
}
