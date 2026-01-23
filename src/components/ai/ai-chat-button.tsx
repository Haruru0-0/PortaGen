"use client"

import { useAIChat } from "./ai-chat-provider"
import { Sparkles } from "lucide-react"

export function AIChatButton() {
    const { isOpen, setIsOpen } = useAIChat()

    return (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
        fixed bottom-4 right-4 z-50
        w-14 h-14
        bg-primary hover:bg-primary/90
        border-4 border-foreground
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        hover:translate-x-[2px] hover:translate-y-[2px]
        transition-all duration-150
        flex items-center justify-center
        group
        ${isOpen ? 'rotate-12' : ''}
      `}
            aria-label={isOpen ? 'Close AI assistant' : 'Open AI assistant'}
        >
            <Sparkles
                className={`
          w-6 h-6 text-primary-foreground
          ${!isOpen ? 'animate-pulse' : ''}
          group-hover:scale-110 transition-transform
        `}
            />

            {/* Pixel corner decorations */}
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-foreground" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-foreground" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-foreground" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-foreground" />
        </button>
    )
}
