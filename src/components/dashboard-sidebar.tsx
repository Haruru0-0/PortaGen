"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { gsap } from "gsap"
import Cd from "@/assets/Cd.png"
import Retro from "@/assets/Retro.png"
import Bow from "@/assets/Bow.png"
import Miku from "@/assets/Miku.png"
import Image from "next/image";
import logo from "@/assets/logo.png";
import logoWhite from "@/assets/Logo-white.png";

const navItems = [
  { href: "/dashboard", label: "HOME", icon: Bow },
  { href: "/dashboard/portfolios", label: "PORTFOLIOS", icon: Retro },
  { href: "/dashboard/assets", label: "ASSETS", icon: Cd },
  { href: "/dashboard/settings", label: "SETTINGS", icon: Miku },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sidebarRef = useRef<HTMLElement>(null)
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const versionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      tl.from(sidebarRef.current, {
        x: -100,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          titleRef.current,
          {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "-=0.3",
        )
        .from(
          navItemsRef.current,
          {
            x: -20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2",
        )
        .from(
          versionRef.current,
          {
            opacity: 0,
            duration: 0.3,
          },
          "-=0.2",
        )
    }, sidebarRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (isCollapsed) {
        gsap.to(sidebarRef.current, {
          width: 88,
          duration: 0.5,
          ease: "power3.inOut",
        })

        gsap.to(titleRef.current, {
          opacity: 0,
          x: -20,
          duration: 0.3,
          ease: "power2.in",
        })

        navItemsRef.current.forEach((item) => {
          if (item) {
            const label = item.querySelector(".nav-label")
            if (label) {
              gsap.to(label, {
                opacity: 0,
                x: -10,
                duration: 0.3,
                ease: "power2.in",
              })
            }
          }
        })
      } else {
        gsap.to(sidebarRef.current, {
          width: 256,
          duration: 0.5,
          ease: "power3.inOut",
        })

        gsap.to(titleRef.current, {
          opacity: 1,
          x: 0,
          duration: 0.4,
          delay: 0.2,
          ease: "power2.out",
        })

        navItemsRef.current.forEach((item, index) => {
          if (item) {
            const label = item.querySelector(".nav-label")
            if (label) {
              gsap.to(label, {
                opacity: 1,
                x: 0,
                duration: 0.4,
                delay: 0.2 + index * 0.05,
                ease: "power2.out",
              })
            }
          }
        })
      }
    }, sidebarRef)

    return () => ctx.revert()
  }, [isCollapsed])

  const handleNavHover = (e: React.MouseEvent<HTMLAnchorElement>, isEntering: boolean) => {
    const target = e.currentTarget

    if (isEntering) {
      gsap.to(target, {
        y: -2,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      })
    } else {
      gsap.to(target, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "hidden md:block border-r-4 border-border bg-card h-screen sticky top-0",
        isCollapsed ? "w-22" : "w-64",
      )}
    >
      <div className="px-6 py-[26px] border-b-4 border-border flex items-center justify-between">
        {!isCollapsed && (
          <div ref={titleRef} className="flex items-center gap-3">
            <Image
              src={logo}
              alt="PortaGen"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10 hidden dark:block"
            />
            <Image
              src={logoWhite}
              alt="PortaGen-white"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10 dark:hidden"
            />
            <h2 className="text-sm pixel-text-shadow">PortaGen</h2>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 border-2 border-border bg-card hover:bg-background transition-colors flex items-center justify-center ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item, index) => (
          <Link
            key={item.href}
            ref={(el) => {
              navItemsRef.current[index] = el
            }}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-[12px] border-2 border-border",
              pathname === item.href ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted",
              isCollapsed ? "px-2" : "px-4",
            )}
            title={isCollapsed ? item.label : undefined}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
          >
            <Image src={item.icon} alt={item.label} className={"w-8 h-8"} />
            {!isCollapsed && <span className="nav-label inline-block">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
