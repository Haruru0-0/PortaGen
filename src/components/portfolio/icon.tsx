"use client"
import { useDraggable } from "@dnd-kit/core"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import { useAppSound } from "./sound-context"
import Image, { StaticImageData } from "next/image"

export function DesktopIcon({
  id,
  label,
  icon,
  onDoubleClick,
}: { id: string; label: string; icon: string | StaticImageData; onDoubleClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const { playClickSound, playHoverSound } = useAppSound()

  const handleDoubleClick = () => {
    playClickSound()
    onDoubleClick()
  }

  const handleMouseEnter = () => {
    playHoverSound()
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.1,
        rotation: 5,
        duration: 0.2,
        ease: "power2.out"
      })
    }

    if (textRef.current) {
      gsap.to(textRef.current, {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseLeave = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.2,
        ease: "power2.out"
      })
    }

    if (textRef.current) {
      gsap.to(textRef.current, {
        backgroundColor: "transparent",
        duration: 0.2,
        ease: "power2.out"
      })
    }
  }

  const handleMouseDown = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.out"
      })
    }
  }

  const handleMouseUp = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 0.1,
        ease: "power2.out"
      })
    }
  }

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (iconRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(iconRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.3 }
        );
      } else {
        gsap.fromTo(iconRef.current, 
          { scale: 0.8, opacity: 0, y: 10 }, 
          { 
            scale: 1, 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            delay: Math.random() * 0.3,
            ease: "back.out(1.7)" 
          }
        );
      }
    }
  }, []);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined }}
      className="desktop-icon flex flex-col items-center justify-center w-16 sm:w-18 md:w-20 cursor-pointer select-none mb-2 pointer-events-auto transition-transform"
    >
      <div
        ref={iconRef}
        className="w-12 h-12 flex items-center justify-center"
      >
        <Image
          src={icon || "/placeholder.svg"}
          alt={label}
          width={48}
          height={48}
          className="max-w-full max-h-full object-contain drop-shadow-md"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
      <span 
        ref={textRef}
        className="desktop-icon-text"
      >
        {label}
      </span>
    </div>
  )
}
