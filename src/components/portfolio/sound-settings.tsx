"use client"

import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppSound } from "./sound-context"

export function SoundSettings() {
  const { isMuted, toggleMute } = useAppSound()

  return (
    <Button variant="ghost" size="icon" onClick={toggleMute} className="h-6 w-6 bg-transparent hover:bg-white/10">
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span className="sr-only">Toggle sound</span>
    </Button>
  )
}
