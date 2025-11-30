"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useWindowsContext } from "@/contexts/windowsContext"
import { WindowContentEditor } from "@/components/editor/window-content-editor"
import { WindowContent } from "@/lib/types";

export default function EditWindowPage() {
  const router = useRouter()
  const params = useParams<{ id: string; windowId: string }>() // Use windowId here
  const { getWindow, updateWindow } = useWindowsContext()
  const [windowContent, setWindowContent] = useState<WindowContent | null>(null)

  const portfolioId = Number(params.id)
  const windowId = Number(params.windowId) // Use windowId here

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

  return (
    <div className="container mx-auto p-4">
      <WindowContentEditor
        windowContent={windowContent}
        portfolioId={portfolioId}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
}