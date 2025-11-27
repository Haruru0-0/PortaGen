"use client"

import { useState } from "react"
import { PixelButton } from "@/components/pixel-button"
import { PixelCharacter } from "@/components/pixel-character"

export default function PortfolioPreviewPage() {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")
  const [isPublic, setIsPublic] = useState(true)

  const desktopIcons = [
    { id: 1, name: "ABOUT.TXT", icon: "📄", x: 20, y: 20 },
    { id: 2, name: "PROJECTS", icon: "💼", x: 20, y: 120 },
    { id: 3, name: "CONTACT.EXE", icon: "📧", x: 20, y: 220 },
    { id: 4, name: "RESUME.PDF", icon: "📋", x: 140, y: 20 },
    { id: 5, name: "GITHUB", icon: "🔗", x: 140, y: 120 },
  ] 

  return (
    <div className="min-h-screen bg-background">
      {/* Control Bar */}
      <div className="border-b-4 border-border bg-card sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-sm pixel-text-shadow">PORTFOLIO PREVIEW</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("desktop")}
                className={`px-3 py-2 text-[10px] border-2 border-border ${viewMode === "desktop" ? "bg-primary text-primary-foreground" : "bg-card"}`}
              >
                DESKTOP
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`px-3 py-2 text-[10px] border-2 border-border ${viewMode === "mobile" ? "bg-primary text-primary-foreground" : "bg-card"}`}
              >
                MOBILE
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Public/Private Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[10px]">{isPublic ? "PUBLIC" : "PRIVATE"}</span>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className={`w-12 h-6 border-2 border-border ${isPublic ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`w-4 h-4 bg-card border-2 border-border transition-transform ${isPublic ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
            </div>

            <PixelButton variant="secondary" className="text-[10px]">
              SHARE
            </PixelButton>
            <PixelButton variant="primary" className="text-[10px]">
              EDIT
            </PixelButton>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="container mx-auto px-4 py-8">
        <div
          className={`mx-auto border-4 border-border ${viewMode === "desktop" ? "max-w-6xl" : "max-w-sm"} transition-all`}
        >
          {/* Desktop Simulation */}
          <div className="aspect-video bg-gradient-to-br from-[#87CEEB] to-[#E0BBE4] relative overflow-hidden">
            {/* Desktop Icons */}
            {desktopIcons.map((icon) => (
              <div
                key={icon.id}
                className="absolute flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 group"
                style={{ left: `${icon.x}px`, top: `${icon.y}px` }}
              >
                <div className="w-16 h-16 bg-card border-4 border-border flex items-center justify-center text-2xl group-hover:bg-accent transition-colors">
                  {icon.icon}
                </div>
                <span className="text-[10px] text-white pixel-text-shadow bg-black/30 px-2 py-1">{icon.name}</span>
              </div>
            ))}

            {/* Window Example */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-card border-4 border-border">
              {/* Window Title Bar */}
              <div className="bg-primary text-primary-foreground px-3 py-2 flex items-center justify-between border-b-4 border-border">
                <span className="text-[10px]">ABOUT.TXT</span>
                <div className="flex gap-2">
                  <button className="w-4 h-4 bg-accent border-2 border-border" />
                  <button className="w-4 h-4 bg-secondary border-2 border-border" />
                  <button className="w-4 h-4 bg-destructive border-2 border-border" />
                </div>
              </div>

              {/* Window Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <PixelCharacter color="#8B5CF6" size={60} />
                  <div>
                    <h2 className="text-sm pixel-text-shadow mb-2">PLAYER_ONE</h2>
                    <p className="text-[10px] text-muted-foreground">PIXEL ART DEVELOPER</p>
                  </div>
                </div>
                <p className="text-[10px] leading-relaxed">
                  HELLO! I'M A CREATIVE DEVELOPER WHO LOVES BUILDING RETRO-INSPIRED WEB EXPERIENCES. CHECK OUT MY
                  PROJECTS AND LET'S CONNECT!
                </p>
              </div>
            </div>

            {/* Taskbar */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-card border-t-4 border-border flex items-center px-4 gap-2">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <PixelCharacter color="#FFFFFF" size={20} />
              </div>
              <div className="flex-1 flex gap-2">
                {["ABOUT.TXT", "PROJECTS"].map((app) => (
                  <div key={app} className="px-3 py-1 bg-muted border-2 border-border text-[10px]">
                    {app}
                  </div>
                ))}
              </div>
              <div className="text-[10px]">12:34 PM</div>
            </div>

            {/* Music Player */}
            <div className="absolute top-4 right-4 bg-card border-4 border-border p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary flex items-center justify-center text-xs">♪</div>
                <span className="text-[10px]">NOW PLAYING</span>
              </div>
              <div className="flex gap-1">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-primary" style={{ height: `${Math.random() * 16 + 4}px` }} />
                ))}
              </div>
              <div className="flex gap-2">
                <button className="w-6 h-6 border-2 border-border bg-muted text-[10px]">⏮</button>
                <button className="w-6 h-6 border-2 border-border bg-primary text-[10px]">▶</button>
                <button className="w-6 h-6 border-2 border-border bg-muted text-[10px]">⏭</button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Preview Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="space-y-3">
            <h3 className="text-sm pixel-text-shadow">TWITTER PREVIEW</h3>
            <div className="border-4 border-border bg-card p-4 space-y-3">
              <div className="aspect-video bg-gradient-to-br from-[#87CEEB] to-[#E0BBE4] border-2 border-border" />
              <div className="space-y-1">
                <p className="text-[10px] pixel-text-shadow">PLAYER_ONE'S PORTFOLIO</p>
                <p className="text-[10px] text-muted-foreground">PIXEL ART DEVELOPER & CREATIVE CODER</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm pixel-text-shadow">FACEBOOK PREVIEW</h3>
            <div className="border-4 border-border bg-card p-4 space-y-3">
              <div className="aspect-video bg-gradient-to-br from-[#87CEEB] to-[#E0BBE4] border-2 border-border" />
              <div className="space-y-1">
                <p className="text-[10px] pixel-text-shadow">PLAYER_ONE'S PORTFOLIO</p>
                <p className="text-[10px] text-muted-foreground">PIXEL ART DEVELOPER & CREATIVE CODER</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
