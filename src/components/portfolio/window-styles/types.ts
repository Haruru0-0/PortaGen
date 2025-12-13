import React from "react"

export interface WindowStyleProps {
    title: string
    children: React.ReactNode
    onClose?: () => void
    onMinimize?: () => void
    isMobile?: boolean
    isMinimized?: boolean
    className?: string
}