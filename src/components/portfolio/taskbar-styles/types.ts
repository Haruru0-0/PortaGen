import React from "react"

export interface TaskbarStyleProps {
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
    handleMouseEnter?: () => void
    className?: string
    embedded?: boolean
}
