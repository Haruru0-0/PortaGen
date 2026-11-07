"use client"

import { useMemo } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEFAULT_ACHIEVEMENTS_DATA } from "@/lib/portfolio-extras"
import type { AchievementItem, AchievementTriggerType, AchievementsData } from "@/lib/types"

interface AchievementsFormProps {
    initialData: AchievementsData
    onChange: (data: AchievementsData) => void
}

const TRIGGER_LABELS: Record<AchievementTriggerType, string> = {
    first_window: "Opens the first window",
    window_opened: "Opens a specific window",
    all_windows: "Has opened every window",
    windows_open: "Has N windows open at once",
    music_play: "Plays music",
    minimize: "Minimizes a window",
    time_range: "Visits during a time range",
    terminal_open: "Opens the terminal",
    terminal_command: "Runs a terminal command",
    manual: "Only via a terminal command's unlock id",
}

export function AchievementsForm({ initialData, onChange }: AchievementsFormProps) {
    const data = useMemo<AchievementsData>(() => ({ ...DEFAULT_ACHIEVEMENTS_DATA, ...initialData }), [initialData])

    const update = (patch: Partial<AchievementsData>) => {
        onChange({ ...data, ...patch })
    }

    const items = data.achievements ?? []
    const updateItem = (i: number, patch: Partial<AchievementItem>) =>
        update({ achievements: items.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) })
    const updateTrigger = (i: number, patch: Partial<AchievementItem["trigger"]>) =>
        updateItem(i, { trigger: { ...items[i].trigger, ...patch } })

    const addItem = () => {
        const id = `achievement_${Date.now().toString(36)}`
        update({
            achievements: [...items, { id, name: "New achievement", description: "What the visitor did", icon: "⭐", trigger: { type: "first_window" } }],
        })
    }

    return (
        <div className="space-y-6">
            <section className="space-y-3">
                <div className="space-y-1">
                    <Label>Title</Label>
                    <Input value={data.title ?? ""} onChange={(e) => update({ title: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <Label>Subtitle</Label>
                    <Input value={data.subtitle ?? ""} onChange={(e) => update({ subtitle: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <Label>Footer (optional)</Label>
                    <Input value={data.footer ?? ""} onChange={(e) => update({ footer: e.target.value })} />
                </div>
            </section>

            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider">Achievements ({items.length})</h4>
                    <Button type="button" size="sm" variant="outline" onClick={addItem}>
                        <Plus className="h-3 w-3 mr-1" /> Add achievement
                    </Button>
                </div>

                {items.map((a, i) => (
                    <div key={a.id} className="space-y-2 border-2 border-border p-3">
                        <div className="flex gap-2">
                            <Input value={a.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} className="w-16 text-center" aria-label="Icon" />
                            <Input value={a.name} onChange={(e) => updateItem(i, { name: e.target.value })} aria-label="Name" />
                            <Button type="button" size="icon" variant="outline" onClick={() => update({ achievements: items.filter((_, idx) => idx !== i) })} aria-label="Remove achievement">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Input value={a.description} onChange={(e) => updateItem(i, { description: e.target.value })} aria-label="Description" />

                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <Label className="text-[10px]">Unlocked when the visitor…</Label>
                                <select
                                    value={a.trigger.type}
                                    onChange={(e) => updateTrigger(i, { type: e.target.value as AchievementTriggerType })}
                                    className="w-full border-2 border-border bg-card px-2 py-2 text-xs"
                                >
                                    {(Object.keys(TRIGGER_LABELS) as AchievementTriggerType[]).map((t) => (
                                        <option key={t} value={t}>
                                            {TRIGGER_LABELS[t]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {a.trigger.type === "window_opened" && (
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Window name (exact)</Label>
                                    <Input value={a.trigger.windowName ?? ""} onChange={(e) => updateTrigger(i, { windowName: e.target.value })} />
                                </div>
                            )}
                            {a.trigger.type === "windows_open" && (
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Number of windows</Label>
                                    <Input type="number" min={2} value={a.trigger.count ?? 3} onChange={(e) => updateTrigger(i, { count: Number(e.target.value) })} />
                                </div>
                            )}
                            {a.trigger.type === "terminal_command" && (
                                <div className="space-y-1">
                                    <Label className="text-[10px]">Command (exact text)</Label>
                                    <Input value={a.trigger.command ?? ""} onChange={(e) => updateTrigger(i, { command: e.target.value })} />
                                </div>
                            )}
                            {a.trigger.type === "time_range" && (
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-[10px]">From hour (0-23)</Label>
                                        <Input type="number" min={0} max={23} value={a.trigger.fromHour ?? 0} onChange={(e) => updateTrigger(i, { fromHour: Number(e.target.value) })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px]">To hour (0-24)</Label>
                                        <Input type="number" min={0} max={24} value={a.trigger.toHour ?? 5} onChange={(e) => updateTrigger(i, { toHour: Number(e.target.value) })} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            ID: <code>{a.id}</code>
                        </p>
                    </div>
                ))}
            </section>
        </div>
    )
}
