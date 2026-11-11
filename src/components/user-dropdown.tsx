"use client"

import { useState, useEffect } from "react"
import { LogOut, Settings, UserRound, ChevronDown } from "lucide-react"
import Link from "@/components/workspace/workspace-link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/workspace/workspace-overlays"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useWorkspaceExperience } from "@/components/workspace/workspace-experience-provider"
import { WorkspaceFrameLayers } from "@/components/workspace/workspace-frame"
import type { User } from "@supabase/supabase-js"

export function UserDropdown() {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [dbUsername, setDbUsername] = useState<string | null>(null)
  const router = useRouter()
  const { cancelPendingTransition } = useWorkspaceExperience()
  useEffect(() => {
    let active = true
    const fetchProfile = async () => {
      const res = await fetch("/api/user/profile")
      if (res.ok && active) { const data = await res.json(); setAvatarUrl(data.avatarUrl); setDbUsername(data.username) }
    }
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!active) return
      setUser(user)
      if (user) await fetchProfile()
    }
    void getUser()
    window.addEventListener("profile-updated", fetchProfile)
    return () => { active = false; window.removeEventListener("profile-updated", fetchProfile) }
  }, [supabase])
  const handleLogout = async () => {
    try { await supabase.auth.signOut(); cancelPendingTransition(); router.push("/") } catch (error) { console.error("Logout failed:", error) }
  }
  const displayName = dbUsername || user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split("@")[0] || (user ? "Account" : "…")
  return <DropdownMenu>
    <DropdownMenuTrigger asChild><button type="button" aria-label="Account menu" className="ws-cut-frame ws-account-trigger"><WorkspaceFrameLayers/>
      {avatarUrl ? <img src={avatarUrl} alt="" className="size-8 object-cover" /> : <UserRound className="size-5" />}
      <span className="hidden md:block truncate">{displayName}</span><ChevronDown className="hidden md:block size-4 shrink-0" aria-hidden="true"/>
    </button></DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-64">
      <DropdownMenuLabel><p className="break-words">{displayName}</p><p className="text-sm font-normal text-muted-foreground break-all">{user?.email || ""}</p></DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild><Link href="/dashboard" className="min-h-11"><UserRound className="size-4" /> Dashboard</Link></DropdownMenuItem>
      <DropdownMenuItem asChild><Link href="/dashboard/settings" className="min-h-11"><Settings className="size-4" /> Settings</Link></DropdownMenuItem>
      <DropdownMenuItem variant="destructive" onSelect={handleLogout} className="min-h-11"><LogOut className="size-4" /> Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
}
