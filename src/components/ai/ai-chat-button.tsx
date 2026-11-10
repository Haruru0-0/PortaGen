"use client"
import { useAIChat } from "./ai-chat-provider"
import { Sparkles } from "lucide-react"
export function AIChatButton() {
  const { isOpen, setIsOpen } = useAIChat()
  return <button type="button" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
    className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-4 right-4 z-50 size-14 flex items-center justify-center bg-[#0755d8] text-[#fffef5] border border-[#44e4ff] shadow-[0_8px_24px_rgba(0,0,0,.25)] hover:bg-[#1246ac] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#44e4ff]">
    <Sparkles className="size-6" />
  </button>
}
