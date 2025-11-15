"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useWindowsContext } from "@/contexts/windowsContext"
import { WindowContentEditor } from "@/components/editor/window-content-editor"
import type { WindowContent } from "@/types/window-content"

export default function EditWindowPage() {
  const router = useRouter()
  const params = useParams<{ id: string; windowId: string }>() // Use windowId here
  const { getWindow, updateWindow, deleteWindow } = useWindowsContext()
  const [windowContent, setWindowContent] = useState<WindowContent | null>(null)

  const portfolioId = Number(params.id)
  const windowId = params.windowId // Use windowId here

  useEffect(() => {
    if (portfolioId && windowId) {
      getWindow(portfolioId, windowId).then(data => {
        setWindowContent(data || null)
      })
    }
  }, [portfolioId, windowId, getWindow])

  const handleSave = async (content: WindowContent) => {
    if (portfolioId && windowId) {
      await updateWindow(portfolioId, windowId, content)
      router.push(`/dashboard/editor/${portfolioId}`)
    }
  }

  const handleCancel = () => {
    router.push(`/dashboard/editor/${portfolioId}`)
  }

  const handleDelete = async (id: string) => {
    if (portfolioId && id) {
      await deleteWindow(portfolioId, id)
      router.push(`/dashboard/editor/${portfolioId}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <WindowContentEditor
        windowContent={windowContent}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={handleDelete}
      />
    </div>
  )
}