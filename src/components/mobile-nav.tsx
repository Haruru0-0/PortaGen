"use client"

import { Home, FolderOpen, ImageIcon, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard", icon: Home, label: "HOME" },
    { href: "/dashboard/editor", icon: FolderOpen, label: "EDITOR" },
    { href: "/dashboard/assets", icon: ImageIcon, label: "ASSETS" },
    { href: "/dashboard/settings", icon: Settings, label: "SETTINGS" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t-4 border-border z-40 md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[8px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
