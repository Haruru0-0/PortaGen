import { useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TaskbarStyleProps } from "./types"
import styles from './Window7Style.module.css'

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
            id={styles.taskbar}
            className={`${embedded ? "absolute" : "fixed"} h-[40px] flex items-center bottom-0 left-0 right-0 z-[60] ${className}`}
            style={{
                backgroundImage: "linear-gradient(90deg,rgba(0,0,0,.1333333333) 50px,transparent 80px),linear-gradient(270deg,rgba(0,0,0,.1333333333) 200px,transparent 230px)",
                backgroundColor: "rgba(170,209,251,0.65)",
                backdropFilter: "blur(4px)",
            }}

        >
            {/* Start Orb */}
            <div id={styles.startButton}>
                <span></span>
            </div>

            {/* Pinned/Running Apps */}
            <div className="flex items-center gap-1 flex-1 px-1 h-full">
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
                                                ${styles.taskbarItem}
                                                ${isRunning && (!isMinimized ? (styles.opened + " " + styles.active) : styles.opened)}
                                            `}
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
        </div>
    )
}
