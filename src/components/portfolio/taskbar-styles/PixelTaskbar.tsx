import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskbarStyleProps } from "./types"
import { useThemeStore } from "@/lib/stores/theme-store"

export function PixelTaskbar({ apps, openWindows, onAppClick, handleMouseEnter, className = "", embedded = false }: TaskbarStyleProps) {
    const taskbarRef = useRef<HTMLDivElement>(null)
    const { colors } = useThemeStore()

    useGSAP(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (taskbarRef.current && !prefersReducedMotion) {
            gsap.fromTo(taskbarRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, delay: 0.8, ease: "back.out(1.7)" }
            )
        }
    }, [])

    return (
        <div
            ref={taskbarRef}
            className={embedded ? `absolute bottom-4 left-4 right-4 z-[60] ${className}` : `fixed bottom-4 left-4 right-4 z-[60] ${className}`}
        >
            <div
                className="border-4 p-2 flex justify-center"
                style={{
                    backgroundColor: colors.background,
                    borderColor: colors.accent
                }}
            >
                <div className="flex gap-4">
                    <TooltipProvider>
                        {apps.map((app) => {
                            const win = openWindows.find((w) => w.name === app.label)
                            const isRunning = !!win

                            return (
                                <Tooltip key={app.id}>
                                    <TooltipTrigger asChild>
                                        <button
                                            className="relative p-2 border-2 transition-transform hover:-translate-y-1"
                                            style={{
                                                borderColor: isRunning ? colors.text : colors.background,
                                                backgroundColor: isRunning ? `${colors.accent}40` : 'transparent'
                                            }}
                                            onClick={() => onAppClick(app.label)}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            <div className="relative w-8 h-8">
                                                <Image
                                                    src={app.icon || "/placeholder.svg"}
                                                    alt={app.label}
                                                    width={32}
                                                    height={32}
                                                    className="pixelated"
                                                />
                                            </div>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        className="font-pixel text-xs border-2"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.text,
                                            borderColor: colors.accent
                                        }}
                                    >
                                        <p>{app.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
}
