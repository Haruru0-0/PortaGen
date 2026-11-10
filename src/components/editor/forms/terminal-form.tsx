"use client"

import { useMemo } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/editor/editor-form-controls"
import { Input } from "@/components/editor/editor-form-controls"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/editor/editor-form-controls"
import { DEFAULT_TERMINAL_DATA } from "@/lib/portfolio-extras"
import type { TerminalCustomCommand, TerminalData, TerminalFile, TerminalInfoRow } from "@/lib/types"

interface TerminalFormProps {
    initialData: TerminalData
    onChange: (data: TerminalData) => void
}

const toLines = (text: string) => text.split("\n")
const fromLines = (lines?: string[]) => (lines ?? []).join("\n")

export function TerminalForm({ initialData, onChange }: TerminalFormProps) {
    const data = useMemo<TerminalData>(() => ({ ...DEFAULT_TERMINAL_DATA, ...initialData }), [initialData])

    const update = (patch: Partial<TerminalData>) => {
        onChange({ ...data, ...patch })
    }

    const files = data.files ?? []
    const infoRows = data.infoRows ?? []
    const commands = data.commands ?? []

    const updateFile = (i: number, patch: Partial<TerminalFile>) =>
        update({ files: files.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) })
    const updateRow = (i: number, patch: Partial<TerminalInfoRow>) =>
        update({ infoRows: infoRows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) })
    const updateCommand = (i: number, patch: Partial<TerminalCustomCommand>) =>
        update({ commands: commands.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) })

    return (
        <div className="space-y-6">
            <section className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider">Prompt</h4>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <Label>Username</Label>
                        <Input value={data.username ?? ""} onChange={(e) => update({ username: e.target.value })} placeholder="visitor" />
                    </div>
                    <div className="space-y-1">
                        <Label>Hostname</Label>
                        <Input value={data.hostname ?? ""} onChange={(e) => update({ hostname: e.target.value })} placeholder="my-portfolio" />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label>Welcome message (one line per row)</Label>
                    <Textarea rows={4} value={fromLines(data.welcomeLines)} onChange={(e) => update({ welcomeLines: toLines(e.target.value) })} />
                </div>
                <div className="space-y-1">
                    <Label>Output of &quot;whoami&quot;</Label>
                    <Input value={data.whoami ?? ""} onChange={(e) => update({ whoami: e.target.value })} />
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider">Files (ls / cat)</h4>
                    <Button type="button" size="sm" variant="outline" onClick={() => update({ files: [...files, { name: "new-file.txt", lines: [""] }] })}>
                        <Plus className="h-3 w-3 mr-1" /> Add file
                    </Button>
                </div>
                {files.map((file, i) => (
                    <div key={i} className="space-y-2 border-2 border-border p-3">
                        <div className="flex gap-2">
                            <Input value={file.name} onChange={(e) => updateFile(i, { name: e.target.value.replace(/\s+/g, "-") })} />
                            <Button type="button" size="icon" variant="outline" onClick={() => update({ files: files.filter((_, idx) => idx !== i) })} aria-label="Remove file">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Textarea rows={4} value={fromLines(file.lines)} onChange={(e) => updateFile(i, { lines: toLines(e.target.value) })} />
                    </div>
                ))}
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider">System info (neofetch)</h4>
                    <Button type="button" size="sm" variant="outline" onClick={() => update({ infoRows: [...infoRows, { label: "Label", value: "Value" }] })}>
                        <Plus className="h-3 w-3 mr-1" /> Add row
                    </Button>
                </div>
                {infoRows.map((row, i) => (
                    <div key={i} className="flex gap-2">
                        <Input value={row.label} onChange={(e) => updateRow(i, { label: e.target.value })} className="w-1/3" />
                        <Input value={row.value} onChange={(e) => updateRow(i, { value: e.target.value })} />
                        <Button type="button" size="icon" variant="outline" onClick={() => update({ infoRows: infoRows.filter((_, idx) => idx !== i) })} aria-label="Remove row">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider">Custom commands</h4>
                    <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => update({ commands: [...commands, { command: "hello", output: ["Hello there!"], style: "output" }] })}
                    >
                        <Plus className="h-3 w-3 mr-1" /> Add command
                    </Button>
                </div>
                {commands.map((cmd, i) => (
                    <div key={i} className="space-y-2 border-2 border-border p-3">
                        <div className="flex gap-2">
                            <Input value={cmd.command} onChange={(e) => updateCommand(i, { command: e.target.value })} placeholder="command text" />
                            <select
                                value={cmd.style ?? "output"}
                                onChange={(e) => updateCommand(i, { style: e.target.value as TerminalCustomCommand["style"] })}
                                className="border-2 border-border bg-card px-2 text-xs"
                                aria-label="Output style"
                            >
                                <option value="output">Normal</option>
                                <option value="success">Success</option>
                                <option value="error">Error</option>
                            </select>
                            <Button type="button" size="icon" variant="outline" onClick={() => update({ commands: commands.filter((_, idx) => idx !== i) })} aria-label="Remove command">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Textarea rows={3} value={fromLines(cmd.output)} onChange={(e) => updateCommand(i, { output: toLines(e.target.value) })} placeholder="Output (one line per row)" />
                        <Input
                            value={cmd.unlocks ?? ""}
                            onChange={(e) => updateCommand(i, { unlocks: e.target.value || undefined })}
                            placeholder="Achievement id to unlock (optional)"
                        />
                    </div>
                ))}
            </section>
        </div>
    )
}
