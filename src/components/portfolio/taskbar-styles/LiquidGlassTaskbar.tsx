import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { TaskbarStyleProps } from "./types"

export function LiquidGlassTaskbar({ apps, overflowApps, openWindows, onAppClick, handleMouseEnter, className = "", embedded = false }: TaskbarStyleProps) {
    const taskbarRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (taskbarRef.current && !prefersReducedMotion) {
            gsap.fromTo(taskbarRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.8,
                    ease: "back.out(1.7)"
                }
            )
        }
    }, [])

    return (
        <div
            ref={taskbarRef}
            className={embedded ? `absolute bottom-2 left-1/2 -translate-x-1/2 z-[60] ${className}` : `fixed bottom-2 left-1/2 -translate-x-1/2 z-[60] ${className}`}
            style={{ width: "auto" }}
        >
            <div className="liquidGlass-wrapper">
                <div className="liquidGlass-effect"></div>
                <div className="liquidGlass-tint"></div>
                <div className="liquidGlass-shine"></div>
                <div className="liquidGlass-content">
                    <div className="dock">
                        <TooltipProvider>
                            {apps.map((app) => {
                                const win = openWindows.find((w) => w.name === app.label)
                                const isRunning = !!win
                                const isMinimized = win?.minimized

                                return (
                                    <Tooltip key={app.id}>
                                        <TooltipTrigger asChild>
                                            <button
                                                className="dock-icon group relative"
                                                onClick={() => onAppClick(app.label)}
                                                onMouseEnter={handleMouseEnter}
                                            >
                                                <Image
                                                    src={app.icon || "/placeholder.svg"}
                                                    alt={app.label}
                                                    width={50}
                                                    height={50}
                                                    className="drop-shadow-lg"
                                                />
                                                {isRunning && (
                                                    <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm ${isMinimized ? 'opacity-50' : 'opacity-100'}`} />
                                                )}
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" sideOffset={8} className="taskbar-tooltip bg-sky-400/30 backdrop-blur-md text-black border-none shadow-lg rounded-lg" arrowClassName="bg-transparent fill-transparent">
                                            <p>{app.label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            })}

                            {overflowApps && overflowApps.length > 0 && (
                                <DropdownMenu>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="dock-icon group relative"
                                                    aria-label="More apps"
                                                    onMouseEnter={handleMouseEnter}
                                                >
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <span className="text-white/80 text-xl font-bold leading-none tracking-widest select-none pb-1">
                                                            ···
                                                        </span>
                                                    </div>
                                                </button>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" sideOffset={8} className="taskbar-tooltip bg-sky-400/30 backdrop-blur-md text-black border-none shadow-lg rounded-lg" arrowClassName="bg-transparent fill-transparent">
                                            <p>More</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <DropdownMenuContent
                                        side="top"
                                        sideOffset={12}
                                        align="center"
                                        className="!bg-transparent !border-none !p-0 !shadow-none !min-w-0 !overflow-visible"
                                    >
                                        <div className="liquidGlass-wrapper" style={{ borderRadius: "1.25rem" }}>
                                            <div className="liquidGlass-effect" style={{ borderRadius: "1.25rem" }} />
                                            <div className="liquidGlass-tint" style={{ borderRadius: "1.25rem" }} />
                                            <div className="liquidGlass-shine" style={{ borderRadius: "1.25rem" }} />
                                            <div className="liquidGlass-content">
                                                <div className="flex flex-col items-center gap-1 p-2">
                                                    {overflowApps.map((app) => {
                                                        const win = openWindows.find((w) => w.name === app.label)
                                                        return (
                                                            <Tooltip key={app.id}>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        className="dock-icon group relative"
                                                                        onClick={() => onAppClick(app.label)}
                                                                        onMouseEnter={handleMouseEnter}
                                                                    >
                                                                        <Image
                                                                            src={app.icon || "/placeholder.svg"}
                                                                            alt={app.label}
                                                                            width={50}
                                                                            height={50}
                                                                            className="drop-shadow-lg"
                                                                        />
                                                                        {win && (
                                                                            <div className={`absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm ${win.minimized ? 'opacity-50' : 'opacity-100'}`} />
                                                                        )}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="left" sideOffset={8} className="taskbar-tooltip bg-sky-400/30 backdrop-blur-md text-black border-none shadow-lg rounded-lg" arrowClassName="bg-transparent fill-transparent">
                                                                    <p>{app.label}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}
