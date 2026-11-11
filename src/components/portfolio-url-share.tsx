"use client"

import { useState, useEffect } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { WorkspaceAction as PixelButton, WorkspacePanel, WorkspaceInput } from "./workspace/workspace-primitives"
import { createClient } from "@/utils/supabase/client"
import { useParams } from "next/navigation"

export function PortfolioUrlShare() {
  const [copied, setCopied] = useState(false)
  const [identity, setIdentity] = useState<{ username: string; origin: string } | null>(null)
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const portfolioUrl = identity && Number.isFinite(currentPortfolioId)
    ? `${identity.origin}/portfolio/${encodeURIComponent(identity.username)}/${currentPortfolioId}`
    : ""

  useEffect(() => {
    let active = true
    const getUser = async () => {
      const { data: { user } } = await createClient().auth.getUser()
      const username = user?.user_metadata?.username || user?.email?.split('@')[0]
      if (active && typeof username === "string" && username) {
        setIdentity({ username, origin: window.location.origin })
      }
    }
    void getUser()
    return () => { active = false }
  }, [])

  const handleCopy = async () => {
    try {
      if (!portfolioUrl) return
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleOpen = () => {
    if (portfolioUrl) window.open(portfolioUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <WorkspacePanel>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <h2 className="font-bold text-lg">Share Your Portfolio</h2>
      </div>

      <p className="font-dialogue text-base text-muted-foreground mb-4">
        Share your portfolio link so others can explore your work.
      </p>

      <div className="ws-share-row flex gap-3 mb-4">
        <WorkspaceInput aria-label="Portfolio share link" value={portfolioUrl} placeholder="Your link will appear when your account is ready" readOnly onFocus={event => event.currentTarget.select()} />
        <PixelButton type="button" disabled={!portfolioUrl} onClick={handleCopy} variant="secondary" className="shrink-0 flex items-center justify-center">
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

      <PixelButton type="button" disabled={!portfolioUrl} onClick={handleOpen} variant="primary" className="w-full flex items-center justify-center">
        <ExternalLink className="w-4 h-4 mr-2" />
        Open Portfolio in New Tab
      </PixelButton>
    </WorkspacePanel>
  )
}
