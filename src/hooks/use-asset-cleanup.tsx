"use client"

import { useCallback, useState } from "react"
import { DeleteConfirmationModal } from "@/components/delete-confirmation-modal"
import { useFileUpload } from "@/hooks/use-file-upload"

interface CleanupAsset {
  id: number
  fileId: string
  name?: string
}

interface PendingCleanup {
  asset: CleanupAsset
  usedIn: string[]
  resolve: (deleteIt: boolean) => void
}

/**
 * After a setting stops using an uploaded file, delete the file too (from UploadThing and the database).
 * If something else still uses it, ask first and name where. The check runs after the setting was cleared,
 * so anything it finds is a different place.
 *
 * Render `cleanupDialog` once in the component that calls `cleanupAsset`.
 */
export function useAssetCleanup() {
  const { deleteFile } = useFileUpload()
  const [pending, setPending] = useState<PendingCleanup | null>(null)

  const cleanupAsset = useCallback(async (asset?: CleanupAsset | null) => {
    if (!asset) return
    let usedIn: string[] = []
    try {
      const response = await fetch(`/api/assets/usage?assetId=${asset.id}`)
      // If we cannot tell whether it is used, keep the file rather than risk breaking another portfolio.
      if (!response.ok) return
      usedIn = (await response.json()).usedIn ?? []
    } catch {
      return
    }
    if (usedIn.length) {
      const confirmed = await new Promise<boolean>((resolve) => setPending({ asset, usedIn, resolve }))
      if (!confirmed) return
    }
    await deleteFile(asset.fileId)
  }, [deleteFile])

  const cleanupDialog = (
    <DeleteConfirmationModal
      isOpen={!!pending}
      onClose={() => {
        pending?.resolve(false)
        setPending(null)
      }}
      onConfirm={() => {
        pending?.resolve(true)
      }}
      title="FILE IS USED ELSEWHERE"
      message={pending
        ? `"${pending.asset.name || "This file"}" is also used in ${pending.usedIn.join(", ")}. Delete it anyway? Those places will go back to their default and the file is deleted for good.`
        : ""}
    />
  )

  return { cleanupAsset, cleanupDialog }
}
