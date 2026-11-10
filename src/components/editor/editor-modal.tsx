"use client"

import { WorkspaceModal } from "@/components/workspace/workspace-modal"
import type { ReactNode } from "react"

/** Keep the existing editor modal contract while scoping the portal to the workspace. */
export function PixelModal({ isOpen, onClose, title, children }: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  return <WorkspaceModal open={isOpen} onOpenChange={(open) => { if (!open) onClose() }} title={title}>
    <div className="workspace-controls">{children}</div>
  </WorkspaceModal>
}
