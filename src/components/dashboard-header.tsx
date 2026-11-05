"use client"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import { usePathname } from "next/navigation"

const TITLES: Record<string, string> = {
  "/dashboard": "DASHBOARD",
  "/dashboard/portfolios": "PORTFOLIOS",
  "/dashboard/assets": "ASSETS",
  "/dashboard/settings": "SETTINGS",
}

export function DashboardHeader() {
  const pathname = usePathname()
  const title = TITLES[pathname] ?? (pathname.startsWith("/dashboard/editor") ? "EDITOR" : "DASHBOARD")
  return (
    <header className="border-b-4 border-border bg-card sticky top-0 z-50">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-sm pixel-text-shadow">{title}</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeToggle />
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
