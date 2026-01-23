"use client"

import { useAIChat } from "./ai-chat-provider"
import { X, Send, Loader2, Sparkles, RotateCcw } from "lucide-react"
import { useRef, useEffect, type FormEvent } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

export function AIChatPanel() {
    const {
        isOpen,
        setIsOpen,
    } = useAIChat()

    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        if (!isOpen) return null
        return (
            <div
                className="
          fixed bottom-20 right-4 z-50
          w-[360px] max-w-[calc(100vw-2rem)]
          h-[500px] max-h-[calc(100vh-8rem)]
          bg-white
          border-4 border-foreground
          shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]
          flex flex-col
          animate-in slide-in-from-bottom-5 fade-in duration-200
        "
            >
                <ChatContent onClose={() => setIsOpen(false)} />
            </div>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent className="bg-white">
                <DrawerHeader className="border-b pb-2">
                    <DrawerTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        PORTAGEN AI
                    </DrawerTitle>
                    <DrawerDescription>
                        Your pixel-perfect portfolio assistant
                    </DrawerDescription>
                </DrawerHeader>
                <div className="h-[50vh] flex flex-col">
                    <ChatContent onClose={() => setIsOpen(false)} isMobile />
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function ChatContent({ onClose, isMobile = false }: { onClose: () => void, isMobile?: boolean }) {
    const {
        messages,
        input,
        setInput,
        handleSubmit,
        isLoading,
        error,
        regenerate,
    } = useAIChat()

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Focus input when mounted (only on desktop to avoid keyboard popping up on mobile instantly)
    useEffect(() => {
        if (!isMobile) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isMobile])

    const onSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        handleSubmit(e)
    }

    // Helper to extract text content from message parts
    const getMessageText = (message: typeof messages[0]) => {
        if ('parts' in message && Array.isArray(message.parts)) {
            return message.parts
                .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
                .map(part => part.text)
                .join('')
        }
        // Fallback for content property
        if ('content' in message && typeof message.content === 'string') {
            return message.content
        }
        return ''
    }

    return (
        <>
            {/* Header - Only for Desktop (Mobile uses DrawerHeader) */}
            {!isMobile && (
                <div className="flex items-center justify-between p-3 border-b-4 border-foreground bg-primary shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                        <span className="text-sm font-bold text-primary-foreground tracking-wide">
                            PORTAGEN AI
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="
              w-6 h-6 
              bg-destructive hover:bg-destructive/80
              border-2 border-foreground
              flex items-center justify-center
              transition-colors
            "
                        aria-label="Close chat"
                    >
                        <X className="w-4 h-4 text-destructive-foreground" />
                    </button>
                </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 min-h-0">
                <div className="space-y-3 pb-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`
                  max-w-[85%] p-3 text-xs leading-relaxed
                  border-2 border-foreground overflow-hidden
                  ${message.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-foreground"
                                    }
                `}
                            >
                                <div className="whitespace-pre-wrap break-words">
                                    {getMessageText(message)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-muted border-2 border-foreground p-3">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-start">
                            <div className="bg-destructive/20 border-2 border-destructive p-3 text-xs">
                                <p className="text-destructive mb-2">Something went wrong</p>
                                <button
                                    onClick={() => regenerate()}
                                    className="flex items-center gap-1 text-foreground hover:text-primary"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={onSubmit} className={cn("p-3 border-t-4 border-foreground shrink-0", isMobile ? "pb-6" : "")}>
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your portfolio..."
                        disabled={isLoading}
                        className="
              flex-1 px-3 py-2
              text-xs
              bg-white
              border-2 border-foreground
              focus:outline-none focus:ring-2 focus:ring-primary
              placeholder:text-muted-foreground
              disabled:opacity-50
            "
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="
              px-3 py-2
              bg-primary hover:bg-primary/90
              border-2 border-foreground
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
                        aria-label="Send message"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" />
                        ) : (
                            <Send className="w-4 h-4 text-primary-foreground" />
                        )}
                    </button>
                </div>
                <p className="mt-2 text-[10px] text-muted-foreground text-center">
                    I help with bios, projects & PortaGen tips only
                </p>
            </form>
        </>
    )
}
