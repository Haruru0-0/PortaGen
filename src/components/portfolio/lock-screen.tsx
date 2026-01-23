"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppSound } from "../../contexts/sound-context"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useLockScreenContext } from "@/contexts/lockScreenContext"
import { useLockScreenStore } from "@/lib/stores/lock-screen-store"
import { useParams } from "next/navigation"

interface LockScreenProps {
  onUnlock: () => void
  preview?: boolean
}

export function LockScreen({ onUnlock, preview = false }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { playClickSound, playErrorSound, playSuccessSound } = useAppSound()
  const {
    enabled,
    password,
    wallpaper,
    showLogin,
    setShowLogin,
    inputPassword,
    setInputPassword,
    isWrongPassword,
    setIsWrongPassword,
    setLockScreenState
  } = useLockScreenStore()

  const { data, getLockScreenData, displayLockScreenData } = useLockScreenContext()
  const params = useParams<{ username: string, id: string }>()
  const currentPortfolioId = Number(params?.id)

  useEffect(() => {
    if (currentPortfolioId && !data) {
      if (preview) {
        getLockScreenData(currentPortfolioId)
      } else {
        displayLockScreenData(params?.username, currentPortfolioId)
      }
    }
  }, [currentPortfolioId, data, getLockScreenData])

  useEffect(() => {
    if (data) {
      setLockScreenState({
        enabled: data.enabled,
        password: data.password || '1234',
        hint: data.hint || '',
        wallpaper: data.wallpaperUrl || (data.wallpaperAsset?.fileId ? `https://drive.google.com/uc?id=${data.wallpaperAsset.fileId}` : ''),
      })
    }
  }, [data, setLockScreenState])

  const effectivePassword = password
  const effectiveWallpaper = wallpaper || "/placeholder.svg?height=1080&width=1920"

  const timeRef = useRef<HTMLHeadingElement>(null)
  const dateRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const loginCardRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${formattedHours}:${formattedMinutes} ${ampm}`
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const handleScreenClick = () => {
    if (!enabled) {
      playSuccessSound()
      onUnlock()
      return
    }

    if (!showLogin) {
      playClickSound()
      setShowLogin(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputPassword === effectivePassword) {
      playSuccessSound()
      onUnlock()
    } else {
      playErrorSound()
      setIsWrongPassword(true)
      setTimeout(() => {
        setIsWrongPassword(false)
      }, 500)
    }
  }

  const handleCancel = () => {
    playClickSound()
    setShowLogin(false)
    setInputPassword("")
    setIsWrongPassword(false)
  }

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (timeRef.current && dateRef.current && hintRef.current && !showLogin) {
      if (prefersReducedMotion) {
        gsap.fromTo(
          [timeRef.current, dateRef.current, hintRef.current],
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.1 },
        )
      } else {
        gsap.fromTo(
          [timeRef.current, dateRef.current, hintRef.current],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
        )

        gsap.to(hintRef.current, {
          opacity: 0.5,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        })
      }
    }

    if (showLogin && overlayRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      } else {
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" })
      }

      if (timeRef.current && dateRef.current && hintRef.current) {
        if (prefersReducedMotion) {
          gsap.to([timeRef.current, dateRef.current, hintRef.current], {
            opacity: 0,
            duration: 0.3,
          })
        } else {
          gsap.to([timeRef.current, dateRef.current, hintRef.current], {
            opacity: 0,
            scale: 0.9,
            duration: 0.5,
            ease: "power2.out",
          })
        }
      }
    }

    if (showLogin && loginCardRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(loginCardRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.2 })
      } else {
        gsap.fromTo(
          loginCardRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            delay: 0.2,
            ease: "back.out(1.7)",
          },
        )
      }
    }

    if (isWrongPassword && inputRef.current && !prefersReducedMotion) {
      gsap.fromTo(
        inputRef.current,
        { x: 0 },
        {
          x: 8,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 5,
        },
      )
    }
  }, [showLogin, isWrongPassword])

  return (
    <div
      className={`${preview ? 'w-full h-full' : 'w-screen h-screen'} relative flex flex-col items-center justify-center overflow-hidden`}
      onClick={handleScreenClick}
    >
      <Image
        src={effectiveWallpaper}
        alt="Lock Screen Wallpaper"
        fill
        className="object-cover object-center"
        priority
      />
      {!showLogin && (
        <div className="flex flex-col items-center justify-center relative z-10 w-full px-4 text-center">
          <h1
            ref={timeRef}
            className={cn(
              "font-bold mb-2 tracking-tight transition-all duration-300",
              preview
                ? "text-3xl sm:text-4xl md:text-5xl"
                : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
            )}
            style={{ color: 'var(--theme-text)' }}
          >
            {formatTime(currentTime)}
          </h1>
          <p
            ref={dateRef}
            className={cn(
              "font-medium transition-all duration-300 opacity-90",
              preview
                ? "text-xs mb-4"
                : "text-sm sm:text-lg md:text-xl mb-8 sm:mb-12"
            )}
            style={{ color: 'var(--theme-text)' }}
          >
            {formatDate(currentTime)}
          </p>
          <p
            ref={hintRef}
            className={cn(
              "uppercase tracking-widest animate-pulse font-bold opacity-80",
              preview ? "text-[8px]" : "text-[10px] sm:text-xs"
            )}
            style={{ color: 'var(--theme-primary)' }}
          >
            CLICK ANYWHERE TO UNLOCK
          </p>
        </div>
      )}

      {showLogin && (
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={loginCardRef}
            className="w-64 p-6 bg-white/20 backdrop-blur-lg rounded-3xl shadow-lg border border-white/30 flex flex-col items-center"
          >
            <Avatar className="w-20 h-20 mb-4 border-4" style={{ borderColor: 'var(--theme-primary)', opacity: 0.5 }}>
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
              <AvatarFallback
                className="text-xl"
                style={{ backgroundColor: 'var(--theme-secondary)', color: 'var(--theme-text)' }}
              >
                ME
              </AvatarFallback>
            </Avatar>

            <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  type="password"
                  placeholder="Enter password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className={cn(
                    "pr-12 bg-white/30 rounded-xl",
                  )}
                  style={{
                    borderColor: 'var(--theme-primary)',
                    color: 'var(--theme-text)'
                  }}
                  autoFocus
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 cursor-pointer text-white rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--theme-primary)' }}
                  onClick={playClickSound}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Unlock</span>
                </Button>
              </div>
              {effectivePassword && (
                <p
                  className="text-xs text-center opacity-80"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Hint: The password is &apos;{effectivePassword}&apos;
                </p>
              )}
            </form>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="mt-4 cursor-pointer text-white backdrop-blur-sm rounded-full transition-all"
            style={{ backgroundColor: 'var(--theme-primary)', opacity: 0.3 }}
            onClick={handleCancel}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cancel</span>
          </Button>
        </div>
      )}
    </div>
  )
}
