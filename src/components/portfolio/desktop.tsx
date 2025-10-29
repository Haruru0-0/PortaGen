"use client"

import React from "react"
import { useEffect, useState, useRef } from "react"
import { AppWindow } from "./window"
import { DesktopIcon } from "./icon"
import { MobileIcon } from "./mobile-icon"
import { Taskbar } from "./taskbar"
import MenuBar from "./menu-bar"
import MusicPlayerWidget from "./music-player-widget"
import { useMediaQuery } from "@/hooks/use-media-query"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { CuteSuspenseFallback } from "./suspense-fallback"
import AboutMe from "./about-me"
import Resume from "./resume"
import Projects from "./projects"
import Blog from "./blog"
import Links from "./links"
import Contact from "./contact"
import type { PortfolioTheme } from "@/lib/portfolio-theme"

interface Icon {
  id: number
  name: string
  icon: string
  url?: string
}

interface DesktopProps {
  mobileWidget1?: string
  mobileWidget2?: string
  musicPlayerIcon?: string
  desktopGif?: string
  wallpaper?: string
  icons?: Icon[]
  theme?: PortfolioTheme
}

export default function Desktop({
  mobileWidget1 = "/water-cd.jpg",
  mobileWidget2 = "/cute-puppy.png",
  musicPlayerIcon,
  desktopGif = "/cute-greeting-gif.jpg",
  wallpaper = "/beautiful-pastel-gradient-wallpaper.jpg",
  icons = [],
  theme,
}: DesktopProps = {}) {
  type WindowData = {
    name: string
    minimized: boolean
    component: React.ReactNode
  }

  const isDesktop = useMediaQuery("(min-width: 650px)")
  const [greeting, setGreeting] = useState("Good morning")
  const greetingRef = useRef<HTMLDivElement>(null)
  const greetingImageRef = useRef<HTMLImageElement>(null)
  const greetingTextRef = useRef<HTMLHeadingElement>(null)
  const desktopIconsRef = useRef<HTMLDivElement[]>([])
  const mobileIconsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  const desktopApps =
    icons.length > 0
      ? icons.map((icon) => ({
          id: icon.id.toString(),
          label: icon.name,
          icon: icon.icon,
        }))
      : [
          { id: "about", label: "About me", icon: "/abstract-about.png" },
          { id: "resume", label: "Resume", icon: "/professional-resume.png" },
          { id: "projects", label: "Projects", icon: "/collaborative-project-planning.png" },
          { id: "blog", label: "Blog", icon: "/blog-concept.png" },
          { id: "links", label: "Links", icon: "/interconnected-links.png" },
          { id: "contact", label: "Contact me", icon: "/contact-us-concept.png" },
        ]

  const [openWindows, setOpenWindows] = useState<WindowData[]>([])

  const getComponentForWindow = (name: string) => {
    switch (name) {
      case "About me":
        return <AboutMe />
      case "Resume":
        return <Resume />
      case "Projects":
        return <Projects />
      case "Blog":
        return <Blog />
      case "Links":
        return <Links />
      case "Contact me":
        return <Contact />
      default:
        return <div>Content for {name}</div>
    }
  }

  const openWindow = (name: string) => {
    setOpenWindows((prev) => {
      if (prev.find((w) => w.name === name)) return prev
      return [...prev, { name, minimized: false, component: getComponentForWindow(name) }]
    })
  }

  const closeWindow = (name: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.name !== name))
  }

  const minimizeWindow = (name: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.name === name ? { ...w, minimized: true } : w)))
  }

  const restoreWindow = (name: string) => {
    setOpenWindows((prev) => prev.map((w) => (w.name === name ? { ...w, minimized: false } : w)))
  }

  const handleAppClick = (label: string) => {
    const win = openWindows.find((w) => w.name === label)
    if (win?.minimized) {
      restoreWindow(label)
    } else {
      openWindow(label)
    }
  }

  // GSAP Animations
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      if (greetingRef.current) {
        gsap.fromTo(greetingRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.3 })
      }

      desktopIconsRef.current.forEach((icon, index) => {
        if (icon) {
          gsap.fromTo(icon, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: index * 0.05 })
        }
      })

      mobileIconsRef.current.forEach((icon, index) => {
        if (icon) {
          gsap.fromTo(icon, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: index * 0.05 })
        }
      })
      return
    }

    if (isDesktop && greetingRef.current) {
      const tl = gsap.timeline()

      tl.fromTo(
        greetingRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "back.out(1.7)" },
      )

      if (greetingImageRef.current) {
        tl.fromTo(
          greetingImageRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
          "-=0.5",
        )

        gsap.to(greetingImageRef.current, {
          y: -10,
          duration: 3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        })
      }

      if (greetingTextRef.current) {
        gsap.to(greetingTextRef.current, {
          opacity: 0.7,
          duration: 3,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
        })
      }
    }

    if (isDesktop) {
      desktopIconsRef.current.forEach((icon, index) => {
        if (icon) {
          gsap.fromTo(
            icon,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              delay: index * 0.1,
              ease: "back.out(1.7)",
            },
          )
        }
      })
    } else {
      mobileIconsRef.current.forEach((icon, index) => {
        if (icon) {
          gsap.fromTo(
            icon,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              delay: index * 0.1,
              ease: "back.out(1.7)",
            },
          )
        }
      })
    }

    const floatingElements = document.querySelectorAll(".animate-float")
    floatingElements.forEach((element) => {
      gsap.to(element, {
        y: -10,
        duration: 6,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      })
    })
  }, [isDesktop, greeting])

  const themeStyles = theme
    ? {
        fontFamily: theme.fonts.primary,
        "--taskbar-position": theme.layout.taskbarPosition,
        "--menu-style": theme.layout.menuBarStyle,
        "--music-player-style": theme.layout.musicPlayerStyle,
      }
    : {}

  return (
    <div
      className="w-full h-full overflow-hidden bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${wallpaper})`,
        ...themeStyles,
      }}
    >
      {theme && (
        <style jsx>{`
          :root {
            --theme-primary: ${theme.colors.primary};
            --theme-secondary: ${theme.colors.secondary};
            --theme-accent: ${theme.colors.accent};
            --theme-background: ${theme.colors.background};
            --theme-text: ${theme.colors.text};
          }
        `}</style>
      )}

      {isDesktop && <MenuBar />}

      {isDesktop && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
          <div ref={greetingRef} className="flex flex-col items-center">
            <img
              ref={greetingImageRef}
              src={desktopGif || "/placeholder.svg"}
              alt="Cute greeting"
              className="w-24 h-24 mb-2 animate-float"
              style={{
                willChange: "transform",
                backfaceVisibility: "hidden",
              }}
            />
            <h1 ref={greetingTextRef} className="text-2xl font-bold text-white drop-shadow-md">
              {greeting}!
            </h1>
          </div>
        </div>
      )}

      {isDesktop ? (
        <div className="absolute inset-0 flex flex-col gap-4 p-4 pt-20 pb-4" style={{ zIndex: 10 }}>
          <div className="flex flex-col flex-wrap gap-4 content-start flex-1 overflow-auto pointer-events-none">
            {desktopApps.map((app, index) => (
              <div
                key={app.id}
                ref={(el) => {
                  if (el) desktopIconsRef.current[index] = el
                }}
              >
                <DesktopIcon
                  id={app.id}
                  label={app.label}
                  icon={app.icon}
                  onDoubleClick={() => openWindow(app.label)}
                />
              </div>
            ))}
          </div>
          <div className="pointer-events-auto" style={{ zIndex: 20 }}>
            <MusicPlayerWidget isDesktop={true} icon={musicPlayerIcon} />
          </div>
          <div className="pointer-events-auto" style={{ zIndex: 30 }}>
            <Taskbar apps={desktopApps} openWindows={openWindows} onAppClick={handleAppClick} />
          </div>
        </div>
      ) : (
        <div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden gap-8 p-4 pb-20"
          style={{ zIndex: 10 }}
        >
          <div className="flex flex-col gap-4 justify-between h-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-4 auto-rows-min justify-items-center">
                {desktopApps.slice(0, 4).map((app, index) => (
                  <div
                    key={app.id}
                    ref={(el) => {
                      if (el) mobileIconsRef.current[index] = el
                    }}
                  >
                    <MobileIcon id={app.id} label={app.label} icon={app.icon} onClick={() => openWindow(app.label)} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <img
                  src={mobileWidget1 || "/placeholder.svg"}
                  className="rounded-2xl h-[160px] object-cover animate-float"
                  style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                  alt="Widget 1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-center">
                <img
                  src={mobileWidget2 || "/placeholder.svg"}
                  className="rounded-2xl h-[160px] object-cover animate-float"
                  style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                  alt="Widget 2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 auto-rows-min justify-items-center">
                {desktopApps.slice(4, 6).map((app, index) => (
                  <div
                    key={app.id}
                    ref={(el) => {
                      if (el) mobileIconsRef.current[index + 4] = el
                    }}
                  >
                    <MobileIcon id={app.id} label={app.label} icon={app.icon} onClick={() => openWindow(app.label)} />
                  </div>
                ))}
              </div>
            </div>
            <div className="pointer-events-auto">
              <MusicPlayerWidget isDesktop={false} icon={musicPlayerIcon} />
            </div>
          </div>
          <div className="pointer-events-auto absolute bottom-0 left-0 right-0" style={{ zIndex: 30 }}>
            <Taskbar apps={desktopApps} openWindows={openWindows} onAppClick={handleAppClick} />
          </div>
        </div>
      )}

      <div style={{ zIndex: 40 }}>
        {openWindows.map((win) => (
          <AppWindow
            key={win.name}
            title={win.name}
            onClose={() => closeWindow(win.name)}
            onMinimize={() => minimizeWindow(win.name)}
            isMobile={!isDesktop}
            isMinimized={win.minimized}
          >
            <React.Suspense fallback={<CuteSuspenseFallback />}>{win.component}</React.Suspense>
          </AppWindow>
        ))}
      </div>
    </div>
  )
}
