"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useChat, type UIMessage } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

interface AIChatContextType {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    messages: UIMessage[]
    input: string
    setInput: (input: string) => void
    handleSubmit: (e: React.FormEvent) => void
    isLoading: boolean
    error: Error | undefined
    regenerate: () => void
    stop: () => void
}

const AIChatContext = createContext<AIChatContextType | null>(null)

export function useAIChat() {
    const context = useContext(AIChatContext)
    if (!context) {
        throw new Error("useAIChat must be used within an AIChatProvider")
    }
    return context
}

interface AIChatProviderProps {
    children: ReactNode
}

export function AIChatProvider({ children }: AIChatProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState("")

    const {
        messages,
        sendMessage,
        status,
        error,
        regenerate,
        stop,
    } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/ai/chat",
        }),
    })

    const isLoading = status === "streaming" || status === "submitted"

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || status !== "ready") return

        sendMessage({ text: input.trim() })
        setInput("")
    }

    return (
        <AIChatContext.Provider
            value={{
                isOpen,
                setIsOpen,
                messages,
                input,
                setInput,
                handleSubmit,
                isLoading,
                error,
                regenerate,
                stop,
            }}
        >
            {children}
        </AIChatContext.Provider>
    )
}
