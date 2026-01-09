"use client"

import type React from "react"
import { X } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface PixelModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function PixelModal({ isOpen, onClose, title, children }: PixelModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="bg-card border-4 border-border shadow-pixel max-w-lg w-full max-h-[90vh] overflow-y-auto p-0"
          showCloseButton={false}
        >
          <DialogHeader className="sticky top-0 bg-primary text-primary-foreground px-4 py-3 flex flex-row items-center justify-between border-b-4 border-border z-50 space-y-0">
            <DialogTitle className="text-sm dashboard-pixel-text-shadow">{title}</DialogTitle>
            <button
              onClick={onClose}
              className="w-6 h-6 border-2 border-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogHeader>
          <div className="p-6">{children}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-card border-4 border-t-border border-x-0 border-b-0 max-h-[90vh]">
        <div className="p-6 overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
