"use client"
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDraggable } from "@dnd-kit/core";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { useAppSound } from "./sound-context";

export function MobileIcon({
  id,
  label,
  icon,
  onClick,
}: {
  id: string;
  label: string;
  icon: string | StaticImageData;
  onClick: () => void;
}) {
  const isMobile = useMediaQuery("(max-width: 650px)");
  const { playClickSound, playHoverSound } = useAppSound();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled: isMobile,
  });
  
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onClick();
  };

  const handleMouseEnter = () => {
    playHoverSound();
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out"
      });
    }

    if (textRef.current) {
      gsap.to(textRef.current, {
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }

    if (textRef.current) {
      gsap.to(textRef.current, {
        backgroundColor: "transparent",
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  const handleMouseDown = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 0.9,
        duration: 0.1,
        ease: "power2.out"
      });
    }
  };

  const handleMouseUp = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 0.1,
        ease: "power2.out"
      });
    }
  };

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
          { scale: 0.8, opacity: 0 }, 
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.3, 
            delay: Math.random() * 0.2,
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
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
      }}
      className="desktop-icon flex flex-col items-center justify-center w-14 sm:w-18 md:w-20 cursor-pointer select-none transition-transform hover:scale-105"
    >
      <div
        ref={iconRef}
        className="w-10 h-10 flex items-center justify-center"
      >
        <Image
          src={icon || "/placeholder.svg"}
          alt={label}
          width={40}
          height={40}
          className="max-w-full max-h-full object-contain drop-shadow-md"
          style={{
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
      <span
        ref={textRef}
        className="desktop-icon-text text-xs md:text-sm"
      >
        {label}
      </span>
    </div>
  );
}
