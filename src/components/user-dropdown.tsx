"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, Settings, User } from "lucide-react"
import { PixelCharacter } from "./pixel-character"
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { gsap } from "gsap"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [dbUsername, setDbUsername] = useState<string | null>(null)
  const router = useRouter()

  const fetchProfile = async () => {
    const res = await fetch('/api/user/profile')
    if (res.ok) {
      const data = await res.json()
      setAvatarUrl(data.avatarUrl)
      setDbUsername(data.username)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        fetchProfile()
      }
    }
    getUser()

    window.addEventListener('profile-updated', fetchProfile)
    return () => window.removeEventListener('profile-updated', fetchProfile)
  }, [supabase])

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
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Get user data from Supabase
  const displayName = dbUsername || user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "PLAYER"
  const displayEmail = user?.email || "player@example.com"

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 border-2 border-border bg-card hover:bg-muted transition-colors rounded-none"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-8 h-8 object-cover border-2 border-border" />
        ) : (
          <PixelCharacter color="#8B5CF6" size={32} />
        )}
        <div className="text-left hidden md:block max-w-[120px]">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-[10px] font-bold truncate cursor-help">{displayName.toUpperCase()}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom">{displayName.toUpperCase()}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-[8px] text-muted-foreground truncate cursor-help">{displayEmail}</p>
            </TooltipTrigger>
            <TooltipContent side="bottom">{displayEmail}</TooltipContent>
          </Tooltip>
        </div>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-56 bg-card border-4 border-border shadow-pixel z-50"
        >
          <div className="p-3 border-b-2 border-border flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-10 h-10 object-cover border-2 border-border" />
            ) : (
              <PixelCharacter color="#8B5CF6" size={32} />
            )}
            <div className="min-w-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-[10px] font-bold truncate cursor-help">{displayName.toUpperCase()}</p>
                </TooltipTrigger>
                <TooltipContent side="right">{displayName.toUpperCase()}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-[8px] text-muted-foreground truncate cursor-help">{displayEmail}</p>
                </TooltipTrigger>
                <TooltipContent side="right">{displayEmail}</TooltipContent>
              </Tooltip>
            </div>
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