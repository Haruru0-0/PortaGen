"use client"

import { useState, useEffect } from "react"
import { PixelButton } from "@/components/pixel-button"
import { PixelInput } from "@/components/pixel-input"
import { PixelClouds } from "@/components/pixel-clouds"
import { useRouter } from "next/navigation"
import gsap from "gsap"

export default function PortfolioLockPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showHint, setShowHint] = useState(false)

  // Mock data - in real app, this would come from user settings
  const portfolioPassword = "1234"
  const passwordHint = "MY FAVORITE NUMBER"

  useEffect(() => {
    // GSAP entrance animation
    gsap.from(".lock-container", {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
    })
  }, [])

  const handleUnlock = () => {
    if (password === portfolioPassword) {
      gsap.to(".lock-container", {
        scale: 1.2,
        opacity: 0,
        duration: 0.4,
        onComplete: () => {
          router.push("/portfolio/preview")
        },
      })
    } else {
      setError("INCORRECT PASSWORD")
      gsap.fromTo(
        ".lock-container",
        { x: -10 },
        {
          x: 10,
          duration: 0.1,
          repeat: 5,
          yoyo: true,
          onComplete: () => {
            gsap.set(".lock-container", { x: 0 })
          },
        },
      )
      setTimeout(() => setError(""), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#87CEEB] to-[#E0BBE4] relative overflow-hidden flex items-center justify-center p-4">
      <PixelClouds />

      <div className="lock-container w-full max-w-md relative z-10">
        <div className="bg-card border-4 border-border p-8 space-y-6">
          {/* Lock Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-primary border-4 border-border flex items-center justify-center text-5xl">
              🔒
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-xl pixel-text-shadow">PORTFOLIO LOCKED</h1>
            <p className="text-[10px] text-muted-foreground">ENTER PASSWORD TO CONTINUE</p>
          </div>

          {/* Password Input */}
          <div className="space-y-4">
            <PixelInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="****"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUnlock()
              }}
            />

            {error && (
              <div className="bg-destructive/20 border-2 border-destructive p-3 text-center">
                <p className="text-[10px] text-destructive pixel-text-shadow">{error}</p>
              </div>
            )}

            <PixelButton variant="primary" className="w-full" onClick={handleUnlock}>
              UNLOCK
            </PixelButton>
          </div>

          {/* Hint */}
          <div className="space-y-3">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full text-[10px] text-muted-foreground hover:text-foreground transition-colors underline"
            >
              {showHint ? "HIDE HINT" : "SHOW HINT"}
            </button>

            {showHint && (
              <div className="bg-accent border-2 border-border p-4 text-center">
                <p className="text-[10px] pixel-text-shadow">{passwordHint}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
