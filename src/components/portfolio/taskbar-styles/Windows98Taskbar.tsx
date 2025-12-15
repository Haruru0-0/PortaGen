import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskbarStyleProps } from "./types"

export function Windows98Taskbar({ apps, openWindows, onAppClick, handleMouseEnter, className = "", embedded = false }: TaskbarStyleProps) {
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
            <div className="h-10 bg-[#c0c0c0] border-t-2 border-white shadow-[inset_0_1px_0_#dfdfdf] flex items-center justify-center px-2">
                <div className="flex items-center gap-2">
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
                                                flex items-center px-2 py-1 min-w-[60px]
                                                border-2 
                                                ${isRunning && !isMinimized
                                                    ? 'border-l-black border-t-black border-r-white border-b-white bg-[#e0e0e0]'
                                                    : 'border-l-white border-t-white border-r-black border-b-black bg-[#c0c0c0] hover:bg-[#d0d0d0]'
                                                }
                                                active:border-l-black active:border-t-black active:border-r-white active:border-b-white
                                            `}
                                            onClick={() => onAppClick(app.label)}
                                            onMouseEnter={handleMouseEnter}
                                        >
                                            <div className="relative w-6 h-6 shrink-0">
                                                <Image
                                                    src={app.icon || "/placeholder.svg"}
                                                    alt={app.label}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
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
            </div>
        </div>
    )
}
