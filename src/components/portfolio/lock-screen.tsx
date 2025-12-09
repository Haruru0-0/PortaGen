"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppSound } from "../../contexts/sound-context"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useLockScreenContext } from "@/contexts/lockScreenContext"
import { useParams } from "next/navigation"

interface LockScreenProps {
  onUnlock: () => void
  preview?: boolean
}

export function LockScreen({ onUnlock, preview = false }: LockScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showLogin, setShowLogin] = useState(false)
  const [inputPassword, setInputPassword] = useState("")
  const [isWrongPassword, setIsWrongPassword] = useState(false)
  const { playClickSound, playErrorSound, playSuccessSound } = useAppSound()

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

  const effectivePassword = data?.password || "1234"
  const effectiveWallpaper = data?.wallpaperUrl || "/placeholder.svg?height=1080&width=1920"

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
    if (data && !data.enabled) {
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
      className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${effectiveWallpaper})` }}
      onClick={handleScreenClick}
    >
      <div className="flex flex-col items-center">
        <h1 ref={timeRef} className="text-6xl font-bold text-blue-800 mb-2">
          {formatTime(currentTime)}
        </h1>
        <p ref={dateRef} className="text-lg text-blue-600 mb-6">
          {formatDate(currentTime)}
        </p>
        <p ref={hintRef} className="text-sm text-blue-500/80">
          Click anywhere to unlock
        </p>
      </div>

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
            <Avatar className="w-20 h-20 mb-4 border-4 border-blue-200/50">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
              <AvatarFallback className="bg-blue-200 text-blue-700 text-xl">ME</AvatarFallback>
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
                    "pr-12 bg-white/30 border-blue-200/50 focus:border-blue-400 rounded-xl placeholder-blue-500/70",
                  )}
                  autoFocus
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 cursor-pointer bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg"
                  onClick={playClickSound}
                >
                  <ArrowRight className="h-4 w-4" />
                  <span className="sr-only">Unlock</span>
                </Button>
              </div>
              {effectivePassword && <p className="text-xs text-blue-600/80 text-center">Hint: The password is '{effectivePassword}'</p>}
            </form>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="mt-4 cursor-pointer text-white bg-blue-500/30 hover:bg-blue-500/50 backdrop-blur-sm rounded-full"
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
