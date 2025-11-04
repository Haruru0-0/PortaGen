"use client"

import type React from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAppSound } from "./sound-context"
import Image, { StaticImageData } from "next/image"

interface TaskbarProps {
  apps: {
    id: string
    label: string
    icon: string | StaticImageData
  }[]
  openWindows: {
    name: string
    minimized: boolean
    component?: React.ReactNode
  }[]
  onAppClick: (label: string) => void
  className?: string
}

export function Taskbar({ apps, openWindows, onAppClick, className = "" }: TaskbarProps) {
  const { playClickSound, playHoverSound } = useAppSound()
  const taskbarRef = useRef<HTMLDivElement>(null)
  const iconsRef = useRef<HTMLDivElement[]>([])
  const dotsRef = useRef<HTMLDivElement[]>([])

  const handleAppClick = (label: string) => {
    playClickSound()
    onAppClick(label)
  }

  const handleMouseEnter = () => {
    playHoverSound()
  }

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Taskbar entrance animation
    if (taskbarRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(taskbarRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.3, delay: 0.8 }
        );
      } else {
        gsap.fromTo(taskbarRef.current, 
          { y: 50, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.5, 
            delay: 0.8, 
            ease: "back.out(1.7)" 
          }
        );
      }
    }

    // Icons entrance animation
    iconsRef.current.forEach((icon, index) => {
      if (icon) {
        if (prefersReducedMotion) {
          gsap.fromTo(icon, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.3, delay: 0.9 + index * 0.05 }
          );
        } else {
          gsap.fromTo(icon, 
            { opacity: 0, y: 20 }, 
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.3, 
              delay: 0.9 + index * 0.05, 
              ease: "back.out(1.7)" 
            }
          );
        }
      }
    });

    // Dots entrance animation
    dotsRef.current.forEach((dot) => {
      if (dot) {
        if (prefersReducedMotion) {
          gsap.fromTo(dot, 
            { scale: 0 }, 
            { scale: 1, duration: 0.2, ease: "power2.out" }
          );
        } else {
          gsap.fromTo(dot, 
            { scale: 0 }, 
            { scale: 1, duration: 0.2, ease: "back.out(1.7)" }
          );
        }
      }
    });

  }, []);

  const handleIconHover = (index: number) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const icon = iconsRef.current[index];
    if (icon) {
      gsap.to(icon, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleIconLeave = (index: number) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const icon = iconsRef.current[index];
    if (icon) {
      gsap.to(icon, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleIconClick = (index: number) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const icon = iconsRef.current[index];
    if (icon) {
      gsap.to(icon, {
        scale: 0.95,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }
  };

  return (
    <div
      ref={taskbarRef}
      className={`taskbar ${className}`}
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      <TooltipProvider>
        {apps.map((app, index) => {
          const win = openWindows.find((w) => w.name === app.label)
          const isRunning = !!win

          return (
            <Tooltip key={app.id}>
              <TooltipTrigger asChild>
                <div
                  ref={(el) => {
                    if (el) iconsRef.current[index] = el;
                  }}
                  className="relative flex flex-col items-center cursor-pointer group p-1"
                  onClick={() => {
                    handleAppClick(app.label);
                    handleIconClick(index);
                  }}
                  onMouseEnter={() => {
                    handleMouseEnter();
                    handleIconHover(index);
                  }}
                  onMouseLeave={() => handleIconLeave(index)}
                  style={{
                    willChange: "transform, opacity",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src={app.icon || "/placeholder.svg"}
                      alt={app.label}
                      width={32}
                      height={32}
                      className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110 drop-shadow-md"
                    />
                  </div>
                  {isRunning && (
                    <div
                      ref={(el) => {
                        if (el) dotsRef.current[index] = el;
                      }}
                      className="taskbar-indicator"
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{app.label}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </div>
  )
}
