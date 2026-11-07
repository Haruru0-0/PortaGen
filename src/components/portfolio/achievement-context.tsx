"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { gsap } from "gsap"
import { useWindowsContext } from "@/contexts/windowsContext"
import type { AchievementItem, AchievementsData, WindowContent } from "@/lib/types"

export type AchievementEvent =
    | { type: "window_opened"; windowName: string }
    | { type: "windows_open"; count: number }
    | { type: "music_play" }
    | { type: "minimize" }
    | { type: "time"; hour: number }
    | { type: "terminal_open" }
    | { type: "terminal_command"; command: string }

type AchievementContextType = {
    achievements: AchievementItem[]
    unlocked: Set<string>
    unlock: (id: string) => void
    emit: (event: AchievementEvent) => void
}

const noop = () => { }
const AchievementContext = createContext<AchievementContextType | undefined>(undefined)

const MOBILE_BREAKPOINT = 650
const TOAST_MS = 3500

// ── Toasts ───────────────────────────────────────────────────────────────────

function DesktopToastContent({ toastId, achievement }: { toastId: string | number; achievement: AchievementItem }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        gsap.fromTo(el, { x: 140, opacity: 0, scale: 0.88 }, { x: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" })

        const timer = setTimeout(() => {
            if (!ref.current) {
                toast.dismiss(toastId)
                return
            }
            gsap.to(ref.current, {
                x: 140,
                opacity: 0,
                scale: 0.88,
                duration: 0.4,
                ease: "back.in(1.7)",
                onComplete: () => {
                    toast.dismiss(toastId)
                },
            })
        }, TOAST_MS)

        return () => clearTimeout(timer)
    }, [toastId])

    return (
        <div ref={ref} className="w-72" style={{ willChange: "transform, opacity" }}>
            <div className="liquidGlass-wrapper" style={{ borderRadius: "1rem" }}>
                <div className="liquidGlass-effect" style={{ borderRadius: "1rem" }} />
                <div className="liquidGlass-tint" style={{ borderRadius: "1rem" }} />
                <div className="liquidGlass-shine" style={{ borderRadius: "1rem" }} />
                <div className="liquidGlass-content p-3 flex items-center gap-3">
                    <span className="text-3xl flex-shrink-0">{achievement.icon}</span>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-[#74defc] uppercase tracking-widest mb-0.5">✨ Achievement Unlocked!</p>
                        <p className="font-bold text-sm text-white leading-tight">{achievement.name}</p>
                        <p className="text-xs text-white/70 leading-snug line-clamp-2">{achievement.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MobileDynamicToast({ achievement, onDone }: { achievement: AchievementItem; onDone: () => void }) {
    const pillRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const expandedWidth = Math.min(300, window.innerWidth - 32)

    useEffect(() => {
        const pill = pillRef.current
        const content = contentRef.current
        if (!pill || !content) return

        gsap.set(pill, { width: 110, height: 34, borderRadius: 100 })
        gsap.set(content, { opacity: 0 })

        const tl = gsap.timeline()
        tl.to(pill, { width: expandedWidth, height: 78, borderRadius: 22, duration: 0.55, ease: "back.out(1.7)" }).to(
            content,
            { opacity: 1, duration: 0.25, ease: "power2.out" },
            "-=0.1",
        )

        const timer = setTimeout(() => {
            gsap.timeline()
                .to(content, { opacity: 0, duration: 0.2 })
                .to(pill, { width: 110, height: 34, borderRadius: 100, duration: 0.4, ease: "back.in(1.7)" })
                .to(pill, { y: -60, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: onDone })
        }, TOAST_MS)

        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div
            style={{
                position: "fixed",
                top: 12,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 99999,
                display: "flex",
                justifyContent: "center",
                pointerEvents: "none",
            }}
        >
            <div ref={pillRef} className="liquidGlass-wrapper" style={{ willChange: "width, height, border-radius, opacity, transform" }}>
                <div className="liquidGlass-effect" style={{ borderRadius: "inherit" }} />
                <div className="liquidGlass-tint" style={{ borderRadius: "inherit" }} />
                <div className="liquidGlass-shine" style={{ borderRadius: "inherit" }} />
                <div ref={contentRef} className="liquidGlass-content flex items-center gap-3 px-4" style={{ width: expandedWidth, minHeight: 78 }}>
                    <span className="text-2xl flex-shrink-0">{achievement.icon}</span>
                    <div className="min-w-0">
                        <p className="text-[9px] font-bold text-[#74defc] uppercase tracking-widest mb-0.5">✨ Achievement Unlocked!</p>
                        <p className="font-bold text-sm text-white leading-tight">{achievement.name}</p>
                        <p className="text-[11px] text-white/60 leading-snug line-clamp-1">{achievement.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ── Trigger matching ─────────────────────────────────────────────────────────

function inHourRange(hour: number, from = 0, to = 24) {
    // from > to wraps past midnight (e.g. 22 → 4)
    return from <= to ? hour >= from && hour < to : hour >= from || hour < to
}

function matches(a: AchievementItem, event: AchievementEvent, ctx: { openedApps: Set<string>; windowNames: string[] }) {
    const t = a.trigger
    switch (event.type) {
        case "window_opened":
            if (t.type === "first_window") return ctx.openedApps.size === 1
            if (t.type === "window_opened") return !!t.windowName && t.windowName === event.windowName
            if (t.type === "all_windows") {
                return ctx.windowNames.length > 0 && ctx.windowNames.every((n) => ctx.openedApps.has(n))
            }
            return false
        case "windows_open":
            return t.type === "windows_open" && event.count >= (t.count ?? 3)
        case "music_play":
            return t.type === "music_play"
        case "minimize":
            return t.type === "minimize"
        case "time":
            return t.type === "time_range" && inHourRange(event.hour, t.fromHour, t.toHour)
        case "terminal_open":
            return t.type === "terminal_open"
        case "terminal_command":
            return t.type === "terminal_command" && !!t.command && t.command.toLowerCase() === event.command.toLowerCase()
    }
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function AchievementProvider({ children }: { children: React.ReactNode }) {
    const params = useParams<{ id?: string }>()
    const { windows } = useWindowsContext()
    const storageKey = `portagen-achievements-${params?.id ?? "preview"}`

    const achievements = useMemo(() => {
        const win = windows.find((w: WindowContent) => w.data?.type === "achievements")
        const content = (win?.data?.content ?? win?.data) as AchievementsData | undefined
        return content?.achievements ?? []
    }, [windows])

    const windowNames = useMemo(
        () => windows.filter((w: WindowContent) => w.data?.type !== "achievements").map((w: WindowContent) => w.name),
        [windows],
    )

    const [unlocked, setUnlocked] = useState<Set<string>>(new Set())
    const [mobileQueue, setMobileQueue] = useState<AchievementItem[]>([])
    const [ready, setReady] = useState(false)
    const openedApps = useRef<Set<string>>(new Set())
    const announced = useRef<Set<string>>(new Set())

    // Load saved progress (client only, so SSR markup stays stable)
    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey)
            const ids: string[] = saved ? JSON.parse(saved) : []
            announced.current = new Set(ids)
            // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with browser storage after mount keeps SSR markup stable
            setUnlocked(new Set(ids))
        } catch {
            // storage unavailable: progress lasts for this visit only
        }
        setReady(true)
    }, [storageKey])

    const unlock = useCallback(
        (id: string) => {
            if (!ready || !achievements.some((a) => a.id === id)) return
            setUnlocked((prev) => {
                if (prev.has(id)) return prev
                const next = new Set(prev)
                next.add(id)
                try {
                    localStorage.setItem(storageKey, JSON.stringify([...next]))
                } catch {
                    // ignore storage errors
                }
                return next
            })
        },
        [achievements, ready, storageKey],
    )

    // Show a toast once for each newly unlocked achievement
    useEffect(() => {
        unlocked.forEach((id) => {
            if (announced.current.has(id)) return
            announced.current.add(id)
            const a = achievements.find((x) => x.id === id)
            if (!a) return
            if (window.innerWidth < MOBILE_BREAKPOINT) {
                setMobileQueue((q) => [...q, a])
            } else {
                toast.custom((toastId) => <DesktopToastContent toastId={toastId} achievement={a} />, { duration: Infinity })
            }
        })
    }, [unlocked, achievements])

    const emit = useCallback(
        (event: AchievementEvent) => {
            if (!achievements.length) return
            if (event.type === "window_opened") openedApps.current.add(event.windowName)
            for (const a of achievements) {
                if (matches(a, event, { openedApps: openedApps.current, windowNames })) unlock(a.id)
            }
        },
        [achievements, windowNames, unlock],
    )

    // Time-of-day achievements are checked once saved progress and the window list are available
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- emitting a clock event once data is ready; unlock() updates state
        if (ready && achievements.length) emit({ type: "time", hour: new Date().getHours() })
    }, [ready, achievements, emit])

    const current = mobileQueue[0]

    return (
        <AchievementContext.Provider value={{ achievements, unlocked, unlock, emit }}>
            {children}
            {current && <MobileDynamicToast key={current.id} achievement={current} onDone={() => setMobileQueue((q) => q.slice(1))} />}
        </AchievementContext.Provider>
    )
}

const FALLBACK: AchievementContextType = { achievements: [], unlocked: new Set(), unlock: noop, emit: noop }

/** Safe outside a provider (e.g. the editor preview): every call is a no-op. */
export function useAchievements(): AchievementContextType {
    return useContext(AchievementContext) ?? FALLBACK
}
