"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useAchievements } from "./achievement-context"
import { DEFAULT_TERMINAL_DATA } from "@/lib/portfolio-extras"
import type { TerminalData } from "@/lib/types"

type HistoryEntry = {
    type: "input" | "output" | "error" | "success"
    content: string
}

const toEntries = (lines: string[], type: HistoryEntry["type"] = "output"): HistoryEntry[] =>
    lines.map((content) => ({ type, content }))

export default function Terminal({ data }: { data?: TerminalData }) {
    const config = useMemo<TerminalData>(() => ({ ...DEFAULT_TERMINAL_DATA, ...(data ?? {}) }), [data])
    const promptUser = `${config.username || "visitor"}@${config.hostname || "portfolio"}`
    const files = config.files ?? []
    const customCommands = config.commands ?? []

    const { emit, unlock } = useAchievements()
    const [history, setHistory] = useState<HistoryEntry[]>(() => [...toEntries(config.welcomeLines ?? []), { type: "output", content: "" }])
    const [input, setInput] = useState("")
    const [cmdHistory, setCmdHistory] = useState<string[]>([])
    const [historyIdx, setHistoryIdx] = useState(-1)
    const [focused, setFocused] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        emit({ type: "terminal_open" })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }, [history, input])

    const helpLines = () => {
        const rows: string[][] = [
            ["help", "show this message"],
            ["ls / dir", "list files"],
            ["cat <file>", "read a file"],
            ["whoami", "about you"],
            ["neofetch", "system info"],
            ["date", "current date & time"],
            ["echo <text>", "print text"],
            ["clear", "clear terminal"],
            ...customCommands.map((c) => [c.command, "custom command"]),
        ]
        const width = Math.max(...rows.map(([c]) => c.length)) + 2
        return rows.map(([cmd, desc]) => `  ${cmd.padEnd(width)}${desc}`)
    }

    const processCommand = (raw: string) => {
        const trimmed = raw.trim()
        if (!trimmed) {
            setHistory((prev) => [...prev, { type: "input", content: "" }])
            return
        }

        const [first, ...args] = trimmed.split(/\s+/)
        const cmd = first.toLowerCase()
        const entries: HistoryEntry[] = [{ type: "input", content: trimmed }]

        if (cmd === "clear") {
            setHistory([])
            setCmdHistory((prev) => [trimmed, ...prev])
            setHistoryIdx(-1)
            return
        }

        // Owner-defined commands win over built-ins, matching the full typed text
        const custom = customCommands.find((c) => c.command.trim().toLowerCase() === trimmed.toLowerCase())

        if (custom) {
            entries.push(...toEntries(custom.output, custom.style ?? "output"))
            if (custom.unlocks) unlock(custom.unlocks)
        } else if (cmd === "help") {
            entries.push(...toEntries(helpLines()))
        } else if (cmd === "ls" || cmd === "dir") {
            entries.push({ type: "output", content: files.map((f) => f.name).join("    ") || "(empty)" })
        } else if (cmd === "cat") {
            const file = args[0]
            const found = files.find((f) => f.name === file)
            if (!file) entries.push({ type: "error", content: "Usage: cat <filename>" })
            else if (found) entries.push(...toEntries(found.lines))
            else entries.push({ type: "error", content: `cat: ${file}: No such file or directory` })
        } else if (cmd === "whoami") {
            entries.push({ type: "output", content: config.whoami || promptUser })
        } else if (cmd === "echo") {
            entries.push({ type: "output", content: args.join(" ") })
        } else if (cmd === "date") {
            entries.push({ type: "output", content: new Date().toString() })
        } else if (cmd === "neofetch") {
            const rows = config.infoRows ?? []
            const width = Math.max(0, ...rows.map((r) => r.label.length)) + 2
            entries.push({ type: "output", content: promptUser })
            entries.push({ type: "output", content: "─".repeat(promptUser.length) })
            entries.push(...toEntries(rows.map((r) => `${(r.label + ":").padEnd(width)}${r.value}`)))
        } else {
            entries.push({ type: "error", content: `command not found: ${cmd}` })
            entries.push({ type: "output", content: 'Type "help" for available commands.' })
        }

        emit({ type: "terminal_command", command: trimmed })
        entries.push({ type: "output", content: "" })
        setHistory((prev) => [...prev, ...entries])
        setCmdHistory((prev) => [trimmed, ...prev])
        setHistoryIdx(-1)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            processCommand(input)
            setInput("")
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
            setHistoryIdx(next)
            setInput(cmdHistory[next] ?? "")
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            const next = Math.max(historyIdx - 1, -1)
            setHistoryIdx(next)
            setInput(next === -1 ? "" : cmdHistory[next])
        }
    }

    const entryColor = (type: HistoryEntry["type"]) => {
        if (type === "error") return "text-red-400"
        if (type === "success") return "text-yellow-300"
        return "text-[#74defc]"
    }

    return (
        <>
            <style>{`
        @keyframes pg-term-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .pg-term-cursor { animation: pg-term-blink 1s step-end infinite; }
      `}</style>

            <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{ position: "fixed", left: "-9999px", top: 0, opacity: 0, width: 1, height: 1 }}
                autoComplete="off"
                spellCheck={false}
                aria-label="Terminal input"
            />

            <div
                ref={scrollRef}
                className="flex flex-col bg-[#0d1117] font-mono text-sm overflow-y-auto select-text h-full min-h-[320px] p-4"
                onClick={() => inputRef.current?.focus()}
            >
                {history.map((entry, i) => (
                    <div key={i} className="leading-relaxed whitespace-pre-wrap break-all min-h-[1.5em]">
                        {entry.type === "input" ? (
                            <>
                                <span className="text-green-400">{promptUser}</span>
                                <span className="text-white/70">:~$</span>
                                <span className="text-white"> {entry.content}</span>
                            </>
                        ) : (
                            <span className={entryColor(entry.type)}>{entry.content || " "}</span>
                        )}
                    </div>
                ))}

                <div className="leading-relaxed whitespace-pre-wrap break-all flex items-center min-h-[1.5em]">
                    <span className="text-green-400">{promptUser}</span>
                    <span className="text-white/70">:~$</span>
                    <span className="text-white"> {input}</span>
                    <span
                        className="pg-term-cursor inline-block w-[0.55em] h-[1.1em] bg-[#74defc] ml-px align-text-bottom flex-shrink-0"
                        style={{ opacity: focused ? undefined : 0.3 }}
                    />
                </div>
            </div>
        </>
    )
}
