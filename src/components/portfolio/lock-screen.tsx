"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useAppSound } from "../../contexts/sound-context"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { useLockScreenContext } from "@/contexts/lockScreenContext"
import { useLockScreenStore } from "@/lib/stores/lock-screen-store"
import { useParams } from "next/navigation"
import { useThemeStore } from "@/lib/stores/theme-store"
import { useTheme } from "@/contexts/theme-context"
import { LiquidGlassLockScreen } from "./lock-screen-styles/LiquidGlassLockScreen"
import { Windows98LockScreen } from "./lock-screen-styles/Windows98LockScreen"
import { WindowsXPLockScreen } from "./lock-screen-styles/WindowsXPLockScreen"
import { Windows7LockScreen } from "./lock-screen-styles/Windows7LockScreen"
import { PixelLockScreen } from "./lock-screen-styles/PixelLockScreen"
import { ModernWindowLockScreen } from "./lock-screen-styles/ModernWindowLockScreen"
import { useMediaQuery } from "@/hooks/use-media-query"
import { assetUrl } from "@/lib/asset-url"

interface LockScreenProps {
  onUnlock: () => void
  preview?: boolean
  previewMode?: "desktop" | "mobile"
}

export function LockScreen({ onUnlock, preview = false, previewMode }: LockScreenProps) {
  const mqDesktop = useMediaQuery("(min-width: 650px)")
  const isDesktop = previewMode ? previewMode === "desktop" : mqDesktop
  const [currentTime, setCurrentTime] = useState(new Date())
  const { playClickSound, playErrorSound, playSuccessSound } = useAppSound()
  const {
    enabled,
    password,
    wallpaper,
    mobileWallpaper,
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
        mobileWallpaper: data.mobileWallpaperUrl || assetUrl(data.mobileWallpaperAsset),
        wallpaper: data.wallpaperUrl || assetUrl(data.wallpaperAsset),
      })
    }
  }, [data, setLockScreenState])

  const { displayThemeData } = useTheme()
  const lockScreenStyleId = useThemeStore((state) => state.lockScreenStyleId)
  const themeColors = useThemeStore((state) => state.colors)

  // The published page shows the lock screen before the desktop, so it loads the theme itself.
  // The editor preview keeps the theme already in the store, including unsaved style choices.
  useEffect(() => {
    if (preview || !currentPortfolioId || !params?.username) return
    void displayThemeData(params.username, currentPortfolioId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, currentPortfolioId, params?.username])

  const effectivePassword = password
  const effectiveWallpaper = wallpaper || "/placeholder.svg?height=1080&width=1920"
  // The mobile layout has its own wallpaper; fall back to the desktop one when none is set
  const hasMobileWallpaper = !!mobileWallpaper && mobileWallpaper !== effectiveWallpaper

  const timeRef = useRef<HTMLHeadingElement>(null)
  const dateRef = useRef<HTMLParagraphElement>(null)
  const hintRef = useRef<HTMLParagraphElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const loginCardRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const xButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (containerRef.current && !prefersReducedMotion && !preview) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: onUnlock,
        })
      } else {
        onUnlock()
      }
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

    if (showLogin && xButtonRef.current) {
      if (prefersReducedMotion) {
        gsap.fromTo(xButtonRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.35 })
      } else {
        gsap.fromTo(
          xButtonRef.current,
          { opacity: 0, scale: 0, rotate: -90 },
          { opacity: 1, scale: 1, rotate: 0, duration: 0.45, delay: 0.35, ease: "back.out(2)" },
        )
      }
    }
  }, [showLogin])

  // Isolated shake: its own effect so a wrong password never replays the entrance animations
  useEffect(() => {
    if (!isWrongPassword || !inputRef.current) return
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return
    gsap.killTweensOf(inputRef.current, "x")
    gsap.fromTo(inputRef.current, { x: 0 }, { x: 8, duration: 0.08, ease: "power2.out", yoyo: true, repeat: 5 })
  }, [isWrongPassword])

  const styleProps = {
    time: formatTime(currentTime),
    date: formatDate(currentTime),
    preview,
    showLogin,
    inputPassword,
    onInputChange: setInputPassword,
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    onClickSound: playClickSound,
    hint: effectivePassword ? `Hint: The password is '${effectivePassword}'` : "",
    colors: themeColors,
    timeRef,
    dateRef,
    hintRef,
    overlayRef,
    cardRef: loginCardRef,
    xButtonRef,
    inputRef,
  }

  const renderStyle = () => {
    switch (lockScreenStyleId || "liquid-glass") {
      case "windows-98":
        return <Windows98LockScreen {...styleProps} />
      case "windows-xp":
        return <WindowsXPLockScreen {...styleProps} />
      case "windows-7":
        return <Windows7LockScreen {...styleProps} />
      case "pixel":
        return <PixelLockScreen {...styleProps} />
      case "window":
        return <ModernWindowLockScreen {...styleProps} />
      default:
        return <LiquidGlassLockScreen {...styleProps} />
    }
  }

  return (
    <div
      ref={containerRef}
      className={`${preview ? 'w-full h-full' : 'w-screen h-screen'} relative flex flex-col items-center justify-center overflow-hidden`}
      onClick={handleScreenClick}
    >
      <Image
        src={effectiveWallpaper}
        alt="Lock Screen Wallpaper"
        fill
        className="object-cover object-center transition-opacity duration-700"
        style={{ opacity: hasMobileWallpaper && !isDesktop ? 0 : 1 }}
        priority
      />
      {hasMobileWallpaper && (
        <Image
          src={mobileWallpaper}
          alt="Mobile Lock Screen Wallpaper"
          fill
          className="object-cover object-center transition-opacity duration-700"
          style={{ opacity: isDesktop ? 0 : 1 }}
          priority
        />
      )}
      {renderStyle()}
    </div>
  )
}
