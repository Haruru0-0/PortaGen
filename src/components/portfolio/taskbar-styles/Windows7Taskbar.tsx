import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskbarStyleProps } from "./types"

export function Windows7Taskbar({ apps, openWindows, onAppClick, handleMouseEnter, className = "", embedded = false }: TaskbarStyleProps) {
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
            {/* Windows 7 Aero Glass Taskbar */}
            <div
                className="h-12 flex items-center px-1 backdrop-blur-md"
                style={{
                    background: "linear-gradient(to bottom, rgba(80,120,180,0.75) 0%, rgba(40,70,130,0.85) 50%, rgba(20,45,100,0.9) 100%)",
                    borderTop: "1px solid rgba(255,255,255,0.3)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)"
                }}
            >
                {/* Start Orb */}
                <button
                    className="relative flex items-center justify-center w-12 h-12 -ml-1 mr-1"
                    style={{
                        background: "radial-gradient(ellipse at center, #4a9eff 0%, #2a6adb 50%, #1a4ab0 100%)",
                        borderRadius: "50%",
                        boxShadow: "0 0 10px rgba(74,158,255,0.5), inset 0 2px 4px rgba(255,255,255,0.3)"
                    }}
                >
                    <span className="text-white text-2xl font-bold" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>⊞</span>
                </button>

                {/* Pinned/Running Apps */}
                <div className="flex items-center gap-1 flex-1 px-1">
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
                                                relative flex items-center justify-center w-12 h-10 rounded
                                                transition-all duration-200
                                                ${isRunning
                                                    ? 'bg-white/20 shadow-lg'
                                                    : 'hover:bg-white/10'
                                                }
                                            `}
                                            style={{
                                                boxShadow: isRunning ? "inset 0 0 10px rgba(255,255,255,0.3), 0 0 5px rgba(0,0,0,0.3)" : "none"
                                            }}
                                            onClick={() => onAppClick(app.label)}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            <div className="relative w-8 h-8">
                                                <Image
                                                    src={app.icon || "/placeholder.svg"}
                                                    alt={app.label}
                                                    fill
                                                    className="object-contain drop-shadow-md"
                                                />
                                            </div>
                                            {/* Running indicator */}
                                            {isRunning && (
                                                <div
                                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 rounded-t"
                                                    style={{
                                                        background: isMinimized
                                                            ? "linear-gradient(to right, transparent, rgba(255,255,255,0.5), transparent)"
                                                            : "linear-gradient(to right, transparent, rgba(120,180,255,0.9), transparent)"
                                                    }}
                                                />
                                            )}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="top"
                                        className="bg-white/90 backdrop-blur-sm text-black border border-gray-300 shadow-xl"
                                    >
                                        <p>{app.label}</p>
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </TooltipProvider>
                </div>

                {/* System Tray */}
                <div
                    className="flex items-center gap-3 h-full px-4 text-white text-xs border-l border-white/20"
                    style={{
                        background: "linear-gradient(to bottom, rgba(60,100,160,0.5) 0%, rgba(30,60,120,0.5) 100%)"
                    }}
                >
                    <span className="opacity-80">▲</span>
                    <span className="text-sm">5:19 PM</span>
                    <span className="text-[10px] opacity-70">1/16/2011</span>
                </div>
            </div>
        </div>
    )
}
