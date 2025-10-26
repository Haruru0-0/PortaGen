"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "HOME", icon: "🏠" },
  { href: "/dashboard/editor", label: "EDITOR", icon: "✏️" },
  { href: "/dashboard/assets", label: "ASSETS", icon: "📁" },
  { href: "/dashboard/settings", label: "SETTINGS", icon: "⚙️" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "hidden md:block border-r-4 border-border bg-card h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-6 border-b-4 border-border flex items-center justify-between">
        {!isCollapsed && <h2 className="text-sm pixel-text-shadow">AETHER</h2>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 border-2 border-border bg-muted hover:bg-accent transition-colors flex items-center justify-center ml-auto"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block px-4 py-3 text-[10px] border-2 border-border transition-colors",
              pathname === item.href ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted",
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <span className={cn(isCollapsed ? "mx-auto block text-center" : "mr-2")}>{item.icon}</span>
            {!isCollapsed && item.label}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t-4 border-border">
        {!isCollapsed && <div className="text-[10px] text-muted-foreground text-center">v1.0.0</div>}
      </div>
    </aside>
  )
}
