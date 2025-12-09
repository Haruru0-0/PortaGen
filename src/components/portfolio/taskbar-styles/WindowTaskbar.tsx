import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskbarStyleProps } from "./types"

export function WindowTaskbar({ apps, openWindows, onAppClick, handleMouseEnter, className = "", embedded = false }: TaskbarStyleProps) {
    const taskbarRef = useRef<HTMLDivElement>(null)

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
            className={embedded ? `absolute bottom-0 left-0 right-0 z-[60] ${className}` : `fixed bottom-0 left-0 right-0 z-[60] ${className}`}
        >
            <div className="h-12 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-2">
                <TooltipProvider>
                    {apps.map((app) => {
                        const win = openWindows.find((w) => w.name === app.label)
                        const isRunning = !!win
                        const isMinimized = win?.minimized

                        return (
                            <Tooltip key={app.id}>
                                <TooltipTrigger asChild>
                                    <button
                                        className={`
                                            group relative p-2 rounded-md transition-all duration-200
                                            ${isRunning ? 'bg-white/10' : 'hover:bg-white/5'}
                                        `}
                                        onClick={() => onAppClick(app.label)}
                                        onMouseEnter={handleMouseEnter}
                                    >
                                        <div className="relative w-8 h-8 transition-transform group-hover:scale-110">
                                            <Image
                                                src={app.icon || "/placeholder.svg"}
                                                alt={app.label}
                                                width={32}
                                                height={32}
                                                className="drop-shadow-md"
                                            />
                                        </div>
                                        {isRunning && (
                                            <div className={`
                                                absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary 
                                                transition-all duration-300
                                                ${isMinimized ? 'w-8 h-[2px] rounded-none opacity-50' : 'opacity-100'}
                                            `} />
                                        )}
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-popover text-popover-foreground">
                                    <p>{app.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        )
                    })}
                </TooltipProvider>
            </div>
        </div>
    )
}
