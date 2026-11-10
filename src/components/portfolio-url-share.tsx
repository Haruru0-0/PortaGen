"use client"

import { useState, useEffect } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { WorkspaceAction as PixelButton } from "./workspace/workspace-primitives"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"

export function PortfolioUrlShare() {
  const [copied, setCopied] = useState(false)
  const [portfolioUrl, setPortfolioUrl] = useState("/portfolio/preview")
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const username = user?.user_metadata?.username || user?.email?.split('@')[0]
    setPortfolioUrl(`${window.location.origin}/portfolio/${username}/${currentPortfolioId}`)
  }, [user, currentPortfolioId])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleOpen = () => {
    window.open(portfolioUrl, "_blank")
  }

  return (
    <div
      className="ws-panel"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <h2 className="font-bold text-lg">Share Your Portfolio</h2>
      </div>

      <p className="font-dialogue text-base text-muted-foreground mb-4">
        Your portfolio is live! Share this link with others to showcase your work.
      </p>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-background border-2 border-foreground rounded px-4 py-2 font-[family-name:var(--font-workspace-body)] text-sm truncate w-20">
          {portfolioUrl}
        </div>
        <PixelButton onClick={handleCopy} variant="secondary" className="shrink-0 flex items-center justify-center">
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </>
          )}
        </PixelButton>
      </div>

      <PixelButton onClick={handleOpen} variant="primary" className="w-full flex items-center justify-center">
        <ExternalLink className="w-4 h-4 mr-2" />
        Open Portfolio in New Tab
      </PixelButton>
    </div>
  )
}
