"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ModeToggle } from "@/components/portfolio/mode-toggle"
import { SoundSettings } from "@/components/portfolio/sound-settings"

export default function MenuBar({ className = "" }: { className?: string }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={`absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-4 text-sm z-20 ${className}`}
      style={{
        backgroundColor: "var(--theme-background, rgba(255, 255, 255, 0.2))",
        backdropFilter: "blur(10px)",
        color: "var(--theme-text, white)",
        fontFamily: "var(--theme-font, inherit)",
      }}
    >
      <div className="flex items-center gap-4">
        <div className="font-bold flex items-center">
          <span className="mr-1">dYO,</span> Portfolio
        </div>
      </div>
      <div className="flex items-center gap-3">
        <SoundSettings />
        <ModeToggle />
        <span>{format(currentTime, "EEE d MMM h:mm a")}</span>
      </div>
    </div>
  )
}

