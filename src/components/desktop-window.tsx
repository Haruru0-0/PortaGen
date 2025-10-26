"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Minus, Square } from "lucide-react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

interface DesktopWindowProps {
  id: string
  title: string
  icon: string
  children: React.ReactNode
  onClose: () => void
  initialPosition?: { x: number; y: number }
  zIndex: number
  onFocus: () => void
}

export function DesktopWindow({
  id,
  title,
  icon,
  children,
  onClose,
  initialPosition = { x: 100, y: 100 },
  zIndex,
  onFocus,
}: DesktopWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (windowRef.current) {
      gsap.from(windowRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.out(1.7)",
      })
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls")) return

    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
    onFocus()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, isMaximized])

  const handleClose = () => {
    if (windowRef.current) {
      gsap.to(windowRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: "back.in(1.7)",
        onComplete: onClose,
      })
    }
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
  }

  if (isMinimized) return null

  return (
    <div
      ref={windowRef}
      className="absolute bg-card border-4 border-border shadow-lg"
      style={{
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? "100%" : "auto",
        height: isMaximized ? "100%" : "auto",
        minWidth: "400px",
        maxWidth: isMaximized ? "100%" : "800px",
        zIndex,
        cursor: isDragging ? "grabbing" : "default",
      }}
      onClick={onFocus}
    >
      {/* Window Title Bar */}
      <div
        className="bg-primary text-primary-foreground px-3 py-2 flex items-center justify-between border-b-4 border-border cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-[10px]">{title}</span>
        </div>
        <div className="flex gap-2 window-controls">
          <button
            onClick={handleMinimize}
            className="w-6 h-6 bg-accent border-2 border-border hover:bg-accent/80 flex items-center justify-center"
            aria-label="Minimize"
          >
            <Minus className="h-3 w-3" />
          </button>
          <button
            onClick={handleMaximize}
            className="w-6 h-6 bg-secondary border-2 border-border hover:bg-secondary/80 flex items-center justify-center"
            aria-label="Maximize"
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            onClick={handleClose}
            className="w-6 h-6 bg-destructive border-2 border-border hover:bg-destructive/80 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-6 overflow-auto max-h-[600px]">{children}</div>
    </div>
  )
}
