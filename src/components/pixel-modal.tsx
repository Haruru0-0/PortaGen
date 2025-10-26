"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { gsap } from "gsap"

interface PixelModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function PixelModal({ isOpen, onClose, title, children }: PixelModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" },
      )
    }
  }, [isOpen])

  const handleClose = () => {
    if (modalRef.current && overlayRef.current) {
      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 20,
        duration: 0.2,
        onComplete: onClose,
      })
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div ref={overlayRef} className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div
        ref={modalRef}
        className="relative bg-card border-4 border-border shadow-pixel max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between border-b-4 border-border">
          <h3 className="text-sm pixel-text-shadow">{title}</h3>
          <button
            onClick={handleClose}
            className="w-6 h-6 border-2 border-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
