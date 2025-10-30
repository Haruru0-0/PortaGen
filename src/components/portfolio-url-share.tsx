"use client"

import { useState } from "react"
import { Copy, Check, ExternalLink } from "lucide-react"
import { PixelButton } from "./pixel-button"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"

interface PortfolioUrlShareProps {
  username?: string
}

export function PortfolioUrlShare({ username = "demo-user" }: PortfolioUrlShareProps) {
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const portfolioUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/portfolio/preview`

  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
      )
    }
  }, [])

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
      ref={containerRef}
      className="bg-gradient-to-br from-primary/10 to-secondary/10 border-4 border-foreground rounded-lg p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
        <h3 className="font-bold text-lg">Share Your Portfolio</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Your portfolio is live! Share this link with others to showcase your work.
      </p>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-background border-2 border-foreground rounded px-4 py-2 font-mono text-sm truncate w-20">
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
