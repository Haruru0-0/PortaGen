import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskbarStyleProps } from "./types"

export function WindowsXPTaskbar({ apps, openWindows, onAppClick, handleMouseEnter, className = "", embedded = false }: TaskbarStyleProps) {
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
            {/* Windows XP Blue gradient taskbar */}
            <div
                className="h-10 flex items-center px-1"
                style={{
                    background: "linear-gradient(to bottom, #3168d5 0%, #4285f4 3%, #2a5dc8 5%, #2252b7 50%, #1941a5 51%, #1941a5 100%)",
                    borderTop: "1px solid #6699ff"
                }}
            >
                {/* Start Button */}
                <button
                    className="flex items-center h-8 px-3 mr-2 rounded-r-xl text-white font-bold text-sm shadow-md"
                    style={{
                        background: "linear-gradient(to bottom, #3c9a3c 0%, #6cc06c 15%, #3a983a 30%, #2d8b2d 50%, #2d8b2d 100%)",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
                    }}
                >
                    <span className="text-lg mr-1">⊞</span>
                    start
                </button>

                {/* Quick Launch / Apps */}
                <div className="flex items-center gap-1 flex-1 px-2">
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
                                                flex items-center gap-2 h-7 px-2 min-w-[120px] max-w-[180px] rounded
                                                text-white text-xs font-medium truncate
                                                ${isRunning && !isMinimized
                                                    ? 'bg-[#1c4abd] shadow-inner'
                                                    : 'bg-[#3d86e5] hover:bg-[#4a90e8]'
                                                }
                                            `}
                                            style={{
                                                background: isRunning && !isMinimized
                                                    ? "linear-gradient(to bottom, #1c4abd 0%, #3d70d8 50%, #1c4abd 100%)"
                                                    : "linear-gradient(to bottom, #3d86e5 0%, #5aaef8 50%, #3d86e5 100%)"
                                            }}
                                            onClick={() => onAppClick(app.label)}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            <div className="relative w-4 h-4 shrink-0">
                                                <Image
                                                    src={app.icon || "/placeholder.svg"}
                                                    alt={app.label}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                            <span className="truncate">{app.label}</span>
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-[#ffffe1] text-black border border-black text-xs">
                                        <p>{app.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </TooltipProvider>
                </div>

                {/* System Tray */}
                <div
                    className="flex items-center gap-2 h-full px-3 text-white text-xs"
                    style={{
                        background: "linear-gradient(to bottom, #0f8ded 0%, #0978d4 50%, #0869c1 100%)"
                    }}
                >
                    <span>3:19 AM</span>
                </div>
            </div>
        </div>
    )
}
