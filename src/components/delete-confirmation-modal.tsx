"use client"

import { useState } from "react"
import { WorkspaceAction } from "@/components/workspace/workspace-primitives"
import { WorkspaceModal } from "@/components/workspace/workspace-modal"

interface DeleteConfirmationModalProps {
  isOpen: boolean; onClose: () => void; onConfirm: () => Promise<void> | void; title: string; message: string
}
export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message }: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const handleConfirm = async () => {
    if (isDeleting) return
    setIsDeleting(true)
    setError("")
    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("Delete failed:", error)
      setError("Could not delete. Please try again.")
    } finally { setIsDeleting(false) }
  }
  return <WorkspaceModal isOpen={isOpen} onClose={() => { if (!isDeleting) { setError(""); onClose() } }} title={title}>
    <div className="space-y-6">
      <p className="text-base leading-relaxed text-muted-foreground">{message}</p>
      {error && <p role="alert" className="text-[#ffb2c5]">{error}</p>}
      <div className="flex flex-wrap justify-end gap-3">
        <WorkspaceAction variant="secondary" onClick={onClose} disabled={isDeleting}>Cancel</WorkspaceAction>
        <WorkspaceAction onClick={handleConfirm} disabled={isDeleting} className="bg-[#bc174c] text-white">{isDeleting ? "Deleting…" : "Delete"}</WorkspaceAction>
      </div>
    </div>
  </WorkspaceModal>
}
