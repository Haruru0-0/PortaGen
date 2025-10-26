"use client"

import { useState, useEffect } from "react"
import { AboutWindow } from "@/components/window-content/about-window"
import { ProjectsWindow } from "@/components/window-content/projects-window"
import { ContactWindow } from "@/components/window-content/contact-window"
import { LinksWindow } from "@/components/window-content/links-window"
import { ResumeWindow } from "@/components/window-content/resume-window"
import { BlogWindow } from "@/components/window-content/blog-window"
import gsap from "gsap"
import dynamic from "next/dynamic"
import { LockScreen } from "@/components/portfolio/lock-screen"
import { SoundProvider } from "@/components/portfolio/sound-context"
import { ThemeProvider } from "@/components/theme-provider"

const Desktop = dynamic(() => import("@/components/portfolio/desktop"), { ssr: false })

interface DesktopIcon {
  id: string
  name: string
  icon: string
  x: number
  y: number
  windowType: "about" | "projects" | "contact" | "links" | "resume" | "blog"
}

interface OpenWindow {
  id: string
  type: string
  title: string
  isMinimized: boolean
  zIndex: number
}

export default function PortfolioPreviewPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([])
  const [maxZIndex, setMaxZIndex] = useState(10)
  const [currentTime, setCurrentTime] = useState("")

  const portfolioSettings = {
    password: "demo123",
    hint: "The password is 'demo123'",
    lockWallpaper: "/beautiful-pastel-gradient-wallpaper.jpg",
  }

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleIconClick = (icon: DesktopIcon) => {
    // Check if window is already open
    const existingWindow = openWindows.find((w) => w.id === icon.id)

    if (existingWindow) {
      // If minimized, restore it
      if (existingWindow.isMinimized) {
        setOpenWindows(
          openWindows.map((w) => (w.id === icon.id ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w)),
        )
        setMaxZIndex(maxZIndex + 1)
      } else {
        // Bring to front
        setOpenWindows(openWindows.map((w) => (w.id === icon.id ? { ...w, zIndex: maxZIndex + 1 } : w)))
        setMaxZIndex(maxZIndex + 1)
      }
    } else {
      // Open new window with GSAP animation
      const newWindow: OpenWindow = {
        id: icon.id,
        type: icon.windowType,
        title: icon.name,
        isMinimized: false,
        zIndex: maxZIndex + 1,
      }
      setOpenWindows([...openWindows, newWindow])
      setMaxZIndex(maxZIndex + 1)

      // Animate window entrance
      setTimeout(() => {
        gsap.from(`#window-${icon.id}`, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
      }, 0)
    }
  }

  const handleCloseWindow = (id: string) => {
    gsap.to(`#window-${id}`, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setOpenWindows(openWindows.filter((w) => w.id !== id))
      },
    })
  }

  const handleMinimizeWindow = (id: string) => {
    gsap.to(`#window-${id}`, {
      scale: 0,
      y: window.innerHeight,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setOpenWindows(openWindows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)))
      },
    })
  }

  const handleMaximizeWindow = (id: string) => {
    // Bring to front
    setOpenWindows(openWindows.map((w) => (w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w)))
    setMaxZIndex(maxZIndex + 1)
  }

  const handleTaskbarClick = (id: string) => {
    const window = openWindows.find((w) => w.id === id)
    if (window?.isMinimized) {
      setOpenWindows(openWindows.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: maxZIndex + 1 } : w)))
      setMaxZIndex(maxZIndex + 1)
      gsap.fromTo(
        `#window-${id}`,
        { scale: 0, y: window.innerHeight },
        { scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" },
      )
    }
  }

  const renderWindowContent = (type: string) => {
    switch (type) {
      case "about":
        return <AboutWindow />
      case "projects":
        return <ProjectsWindow />
      case "contact":
        return <ContactWindow />
      case "links":
        return <LinksWindow />
      case "resume":
        return <ResumeWindow />
      case "blog":
        return <BlogWindow />
      default:
        return <div className="p-6 text-[10px]">WINDOW CONTENT</div>
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <SoundProvider>
        {!isUnlocked ? (
          <LockScreen
            password={portfolioSettings.password}
            hint={portfolioSettings.hint}
            wallpaper={portfolioSettings.lockWallpaper}
            onUnlock={() => setIsUnlocked(true)}
          />
        ) : (
          <Desktop />
        )}
      </SoundProvider>
    </ThemeProvider>
  )
}
