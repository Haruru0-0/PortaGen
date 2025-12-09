"use client"

import type React from "react"
import { useTheme } from "@/contexts/theme-context"
import { getTaskbarComponent } from "./taskbar-styles"
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
  const { activeTheme } = useTheme()
  const styleId = activeTheme.taskbarStyleId || "liquid-glass"

  const TaskbarComponent = getTaskbarComponent(styleId)

  return (
    <TaskbarComponent
      {...props}
      handleMouseEnter={playHoverSound}
    />
  )
}
