"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { PixelButton } from "./pixel-button"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message }: DeleteConfirmationModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" },
      )
    }
  }, [isOpen])

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 20,
      duration: 0.2,
      onComplete: onClose,
    })
  }

  const handleConfirm = () => {
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 20,
      duration: 0.2,
      onComplete: onConfirm,
    })
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className="bg-card border-4 border-border max-w-md w-full p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-3">
          <h3 className="text-sm pixel-text-shadow text-destructive">{title}</h3>
          <p className="text-[10px] text-muted-foreground leading-relaxed">{message}</p>
        </div>

        <div className="flex gap-3">
          <PixelButton variant="secondary" onClick={handleClose} className="flex-1 text-[10px]">
            CANCEL
          </PixelButton>
          <PixelButton
            variant="primary"
            onClick={handleConfirm}
            className="flex-1 text-[10px] bg-destructive border-destructive hover:bg-destructive/90"
          >
            DELETE
          </PixelButton>
        </div>
      </div>
    </div>
  )
}
