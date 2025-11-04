import { type ReactNode, useRef, useEffect, useState } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type AnimationVariant =
  | "fadeIn"
  | "slideUp"
  | "slideRight"
  | "slideLeft"
  | "scale"
  | "stagger"
  | "rotate"
  | "flip"
  | "bounce"
  | "elastic"
  | "pulse"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  variant?: AnimationVariant
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  staggerChildren?: number
  priority?: boolean
}

export function AnimatedSection({
  children,
  className = "",
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  once = true,
  staggerChildren = 0.1,
  priority = false,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useGSAP(() => {
    if (!ref.current) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const skipAnimation = prefersReducedMotion || (priority === false && window?.innerWidth < 768)

    if (skipAnimation) {
      gsap.fromTo(ref.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3 }
      )
      return
    }

    const getAnimation = () => {
      switch (variant) {
        case "fadeIn":
          return { from: { opacity: 0 }, to: { opacity: 1, duration, delay } }
        
        case "slideUp":
          return { 
            from: { opacity: 0, y: 50 }, 
            to: { opacity: 1, y: 0, duration, delay, ease: "back.out(1.7)" } 
          }
        
        case "slideRight":
          return { 
            from: { opacity: 0, x: -50 }, 
            to: { opacity: 1, x: 0, duration, delay, ease: "back.out(1.7)" } 
          }
        
        case "slideLeft":
          return { 
            from: { opacity: 0, x: 50 }, 
            to: { opacity: 1, x: 0, duration, delay, ease: "back.out(1.7)" } 
          }
        
        case "scale":
          return { 
            from: { opacity: 0, scale: 0.8 }, 
            to: { opacity: 1, scale: 1, duration, delay, ease: "back.out(1.7)" } 
          }
        
        case "rotate":
          return { 
            from: { opacity: 0, rotation: -10, scale: 0.95 }, 
            to: { opacity: 1, rotation: 0, scale: 1, duration, delay, ease: "back.out(1.7)" } 
          }
        
        case "flip":
          return { 
            from: { opacity: 0, rotationY: 90 }, 
            to: { opacity: 1, rotationY: 0, duration, delay, ease: "back.out(1.7)" } 
          }
        
        case "bounce":
          return { 
            from: { opacity: 0, y: 50 }, 
            to: { opacity: 1, y: 0, duration, delay, ease: "bounce.out" } 
          }
        
        case "elastic":
          return { 
            from: { opacity: 0, scale: 0.5 }, 
            to: { opacity: 1, scale: 1, duration, delay, ease: "elastic.out(1, 0.3)" } 
          }
        
        case "pulse":
          return { 
            from: { opacity: 0, scale: 0.95 }, 
            to: { 
              opacity: 1, 
              scale: 1, 
              duration: duration * 1.5, 
              delay,
              keyframes: {
                "0%": { scale: 0.95 },
                "70%": { scale: 1.05 },
                "100%": { scale: 1 }
              }
            } 
          }
        
        case "stagger":
          return { 
            from: { opacity: 0 }, 
            to: { opacity: 1, delay } 
          }
        
        default:
          return { from: { opacity: 0 }, to: { opacity: 1, duration, delay } }
      }
    }

    const animation = getAnimation()

    if (variant === "stagger") {
      const children = ref.current.children
      gsap.fromTo(children, 
        { opacity: 0, y: 20 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration, 
          delay,
          stagger: staggerChildren,
          ease: "back.out(1.7)"
        }
      )
    } else {
      // Use ScrollTrigger for viewport-based animations
      ScrollTrigger.create({
        trigger: ref.current,
        start: `top ${100 - (threshold * 100)}%`,
        once,
        onEnter: () => {
          if (ref.current) {
            gsap.fromTo(ref.current, animation.from, animation.to)
          }
        },
        onEnterBack: () => {
          if (!once && ref.current) {
            gsap.fromTo(ref.current, animation.from, animation.to)
          }
        }
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [variant, delay, duration, threshold, once, staggerChildren, priority])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      {variant === "stagger" ? (
        <div
          style={{
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
          }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export function AnimatedItem({
  children,
  className = "",
  variant = "default",
}: {
  children: ReactNode
  className?: string
  variant?: "default" | "pop" | "slide" | "fade" | "bounce"
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      gsap.fromTo(ref.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.3 }
      )
      return
    }

    const getAnimation = () => {
      switch (variant) {
        case "pop":
          return { 
            from: { opacity: 0, scale: 0.8 }, 
            to: { opacity: 1, scale: 1, ease: "back.out(1.7)" } 
          }
        
        case "slide":
          return { 
            from: { opacity: 0, x: -20 }, 
            to: { opacity: 1, x: 0, ease: "back.out(1.7)" } 
          }
        
        case "fade":
          return { 
            from: { opacity: 0 }, 
            to: { opacity: 1 } 
          }
        
        case "bounce":
          return { 
            from: { opacity: 0, y: 20 }, 
            to: { opacity: 1, y: 0, ease: "bounce.out" } 
          }
        
        default:
          return { 
            from: { opacity: 0, y: 20 }, 
            to: { opacity: 1, y: 0, ease: "back.out(1.7)" } 
          }
      }
    }

    const animation = getAnimation()
    gsap.fromTo(ref.current, animation.from, animation.to)
  }, [variant])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: "transform, opacity",
        backfaceVisibility: "hidden",
      }}
    >
      {children}
    </div>
  )
}