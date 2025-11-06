"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { LockScreen } from "@/components/portfolio/lock-screen"
import { SoundProvider } from "@/components/portfolio/sound-context"
import { ThemeProvider } from "@/components/theme-provider"

const Desktop = dynamic(() => import("@/components/portfolio/desktop"), { ssr: false })

export default function PortfolioPreviewPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  const portfolioSettings = {
    password: "demo123",
    hint: "The password is 'demo123'",
    lockWallpaper: "/beautiful-pastel-gradient-wallpaper.jpg",
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <SoundProvider>
        {!isUnlocked ? (
          <LockScreen
            password={portfolioSettings.password}
            hint={portfolioSettings.hint}
            wallpaper={portfolioSettings.lockWallpaper}
            onUnlock={() => setIsUnlocked(true)}
          />
        ) : (
          <Desktop />
        )}
      </SoundProvider>
    </ThemeProvider>
  )
}
