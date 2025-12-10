import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskbarStyleProps } from "./types"
import styles from "./WindowXpStyle.module.css"

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
            className={embedded ? `absolute bottom-0 left-0 right-0 z-[60] flex h-[30px] ${className}` : `fixed bottom-0 left-0 right-0 z-[60] flex h-[30px] ${className}`}
            style={{
                background: "linear-gradient(to bottom,#3168d5 2%,#4993e6 8%,#245dd7 17%,#2257d5 30%,#2663e0 89%,#1941a5 98%)",
            }}
        >
            {/* Start Button */}
            <div className={styles.startbtn}></div>

            {/* Quick Launch / Apps */}
            <div className={styles.taskarea}>
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
                                            ${styles.task}
                                            ${isRunning && !isMinimized
                                                ? 'active'
                                                : ''}
                                        `}
                                        onClick={() => onAppClick(app.label)}
                                        onMouseEnter={handleMouseEnter}
                                    >
                                        <div className="relative w-4 h-4 shrink-0 mr-1">
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
        </div>
    )
}
