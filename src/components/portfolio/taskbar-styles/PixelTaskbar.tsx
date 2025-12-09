import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskbarStyleProps } from "./types"

export function PixelTaskbar({ apps, openWindows, onAppClick, handleMouseEnter, className = "", embedded = false }: TaskbarStyleProps) {
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
            className={embedded ? `absolute bottom-4 left-4 right-4 z-[60] ${className}` : `fixed bottom-4 left-4 right-4 z-[60] ${className}`}
        >
            <div className="bg-[#0f380f] border-4 border-[#8bac0f] p-2 flex justify-center">
                <div className="flex gap-4">
                    <TooltipProvider>
                        {apps.map((app) => {
                            const win = openWindows.find((w) => w.name === app.label)
                            const isRunning = !!win

                            return (
                                <Tooltip key={app.id}>
                                    <TooltipTrigger asChild>
                                        <button
                                            className={`
                                                relative p-2 border-2 transition-transform hover:-translate-y-1
                                                ${isRunning ? 'border-[#9bbc0f] bg-[#306230]' : 'border-[#0f380f] hover:border-[#8bac0f]'}
                                            `}
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
                                    <TooltipContent side="top" className="font-pixel text-xs bg-[#0f380f] text-[#9bbc0f] border-2 border-[#8bac0f]">
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
