"use client"

import { useMemo } from "react"
import { useAchievements } from "./achievement-context"
import AnimatedContent from "./AnimatedContent"
import { DEFAULT_ACHIEVEMENTS_DATA } from "@/lib/portfolio-extras"
import type { AchievementsData } from "@/lib/types"

export default function Achievements({ data }: { data?: AchievementsData }) {
    const { unlocked } = useAchievements()
    const config = useMemo(() => ({ ...DEFAULT_ACHIEVEMENTS_DATA, ...(data ?? {}) }), [data])
    const items = config.achievements ?? []
    const total = items.length
    const count = items.filter((a) => unlocked.has(a.id)).length
    const pct = total ? Math.round((count / total) * 100) : 0

    return (
        <div className="min-h-full p-4 space-y-5">
            <AnimatedContent scale={0.82} ease="back.out(1.7)" className="relative p-5 text-center border-4 border-foreground bg-card shadow-[7px_7px_0_currentColor]">
                <h1 className="text-3xl font-bold tracking-widest mb-1">★ {config.title || "ACHIEVEMENTS"} ★</h1>
                {config.subtitle && <p className="text-[11px] tracking-wider opacity-55 mb-4">{config.subtitle}</p>}
                <div className="flex justify-center gap-3 flex-wrap">
                    <div className="px-3 py-1 text-xs font-bold tracking-wider border-2 border-foreground bg-foreground text-background">
                        SCORE: {count} / {total}
                    </div>
                    <div className="px-3 py-1 text-xs font-bold tracking-wider border-2 border-foreground bg-muted">{pct}% COMPLETE</div>
                </div>
            </AnimatedContent>

            {total > 0 && (
                <AnimatedContent distance={55} ease="back.out(1.4)">
                    <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-bold tracking-widest">▸ EXP POINTS</span>
                        <span className="text-[11px] font-bold opacity-50">
                            {count} / {total}
                        </span>
                    </div>
                    <div className="flex gap-0.5 p-0.5 border-2 border-foreground bg-card">
                        {items.map((a, i) => (
                            <div
                                key={a.id}
                                className={`h-4 flex-1 transition-colors ${i < count ? "bg-foreground" : "bg-muted"}`}
                                style={{ transitionDelay: `${i * 35}ms` }}
                            />
                        ))}
                    </div>
                </AnimatedContent>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((a, index) => {
                    const isUnlocked = unlocked.has(a.id)
                    return (
                        <AnimatedContent
                            key={a.id}
                            delay={index * 0.05}
                            distance={18}
                            scale={0.78}
                            ease="back.out(1.7)"
                            className={`relative h-full border-[3px] border-foreground ${isUnlocked ? "bg-muted shadow-[4px_4px_0_currentColor]" : "bg-card opacity-55"}`}
                        >
                            {isUnlocked && (
                                <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-[10px] font-bold z-10 bg-foreground text-background border-2 border-card">
                                    ★
                                </div>
                            )}
                            <div className="p-2.5 flex items-center gap-2.5">
                                <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0 border-2 border-foreground bg-card">
                                    {isUnlocked ? a.icon : "🔒"}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-[11px] leading-tight tracking-wide truncate">{isUnlocked ? a.name.toUpperCase() : "??? ??? ???"}</p>
                                    <p className="text-[10px] opacity-60 mt-0.5 leading-tight line-clamp-2">{isUnlocked ? a.description : "Keep exploring..."}</p>
                                </div>
                            </div>
                        </AnimatedContent>
                    )
                })}
            </div>

            {config.footer && (
                <AnimatedContent distance={0} className="text-center py-2 text-[9px] tracking-[0.35em] uppercase opacity-35 border-t-2 border-foreground">
                    {config.footer}
                </AnimatedContent>
            )}
        </div>
    )
}
