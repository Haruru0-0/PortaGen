"use client"

import { PixelCharacter } from "@/components/pixel-character"

interface AboutWindowProps {
  data?: {
    name?: string
    title?: string
    bio?: string
    avatar?: string
  }
}

export function AboutWindow({ data }: AboutWindowProps) {
  const name = data?.name || "PLAYER_ONE"
  const title = data?.title || "PIXEL ART DEVELOPER"
  const bio =
    data?.bio ||
    "HELLO! I'M A CREATIVE DEVELOPER WHO LOVES BUILDING RETRO-INSPIRED WEB EXPERIENCES. CHECK OUT MY PROJECTS AND LET'S CONNECT!"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <PixelCharacter color="#8B5CF6" size={60} />
        <div>
          <h2 className="text-sm pixel-text-shadow mb-2">{name}</h2>
          <p className="text-[10px] text-muted-foreground">{title}</p>
        </div>
      </div>
      <p className="text-[10px] leading-relaxed">{bio}</p>
    </div>
  )
}
