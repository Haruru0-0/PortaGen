"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, Settings, User } from "lucide-react"
import { PixelCharacter } from "./pixel-character"
import Link from "next/link"
import { gsap } from "gsap"
import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const { signOut } = useClerk()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isOpen && menuRef.current) {
      gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -10, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "back.out(1.7)" },
      )
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Get user data from Clerk
  const displayName = user?.username || user?.firstName || "PLAYER"
  const displayEmail = user?.emailAddresses[0]?.emailAddress || "player@example.com"

  return (
      <div className="relative" ref={dropdownRef}>
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 px-3 py-2 border-2 border-border bg-card hover:bg-muted transition-colors"
        >
          <PixelCharacter color="#8B5CF6" size={32} />
          <div className="text-left hidden md:block">
            <p className="text-[10px] font-bold">{displayName.toUpperCase()}</p>
            <p className="text-[8px] text-muted-foreground">{displayEmail}</p>
          </div>
        </button>

        {isOpen && (
            <div
                ref={menuRef}
                className="absolute right-0 top-full mt-2 w-56 bg-card border-4 border-border shadow-pixel z-50"
            >
              <div className="p-3 border-b-2 border-border">
                <p className="text-[10px] font-bold">{displayName.toUpperCase()}</p>
                <p className="text-[8px] text-muted-foreground truncate">{displayEmail}</p>
              </div>

              <div className="p-2">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 text-[10px] hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  DASHBOARD
                </Link>
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 text-[10px] hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  SETTINGS
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[10px] hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  LOGOUT
                </button>
              </div>
            </div>
        )}
      </div>
  )
}