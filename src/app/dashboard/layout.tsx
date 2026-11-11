import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { MobileNav } from "@/components/mobile-nav"
import { PortfolioProvider } from "@/contexts/portfolioContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortfolioProvider>
      <div className="ws-dashboard">
        <DashboardSidebar />
        <div className="ws-dashboard-body">
          <DashboardHeader />
          <main className="ws-dashboard-main">{children}</main>
        </div>
        <MobileNav />
      </div>
    </PortfolioProvider>
  )
}
