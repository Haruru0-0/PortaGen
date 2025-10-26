import Link from "next/link"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { PixelCharacter } from "@/components/pixel-character"

export default function DashboardPage() {
  const portfolios = [
    { id: 1, name: "MY PORTFOLIO", theme: "PURPLE DREAM", status: "PUBLISHED", views: 1234 },
    { id: 2, name: "DEV PORTFOLIO", theme: "PINK PARADISE", status: "DRAFT", views: 0 },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <PixelCard>
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h2 className="text-lg pixel-text-shadow">WELCOME BACK, PLAYER!</h2>
            <p className="text-[10px] text-muted-foreground leading-relaxed">READY TO BUILD SOMETHING AWESOME TODAY?</p>
          </div>
          <PixelCharacter color="#8B5CF6" size={60} animate />
        </div>
      </PixelCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "PORTFOLIOS", value: "2", color: "bg-primary" },
          { label: "TOTAL VIEWS", value: "1.2K", color: "bg-secondary" },
          { label: "ASSETS", value: "24", color: "bg-accent" },
          { label: "THEMES", value: "5", color: "bg-primary" },
        ].map((stat, i) => (
          <PixelCard key={i}>
            <div className="space-y-2">
              <div className={`w-12 h-12 ${stat.color} flex items-center justify-center text-xl pixel-text-shadow`}>
                {stat.value}
              </div>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          </PixelCard>
        ))}
      </div>

      {/* Get Started Checklist */}
      <PixelCard>
        <div className="space-y-4">
          <h3 className="text-sm pixel-text-shadow">GET STARTED CHECKLIST</h3>
          <div className="space-y-3">
            {[
              { task: "CREATE YOUR FIRST PORTFOLIO", done: true },
              { task: "UPLOAD A WALLPAPER", done: true },
              { task: "ADD DESKTOP ICONS", done: false },
              { task: "EMBED MUSIC", done: false },
              { task: "PUBLISH YOUR PORTFOLIO", done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 border-border ${item.done ? "bg-primary" : "bg-muted"} flex items-center justify-center`}
                >
                  {item.done && <span className="text-[8px]">✓</span>}
                </div>
                <span className={`text-[10px] ${item.done ? "line-through text-muted-foreground" : ""}`}>
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </div>
      </PixelCard>

      {/* Portfolio Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm pixel-text-shadow">YOUR PORTFOLIOS</h3>
          <Link href="/dashboard/editor">
            <PixelButton variant="primary" className="text-[10px]">
              + NEW PORTFOLIO
            </PixelButton>
          </Link>
        </div>

        {portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio) => (
              <PixelCard key={portfolio.id}>
                <div className="space-y-4">
                  {/* Mock preview */}
                  <div className="aspect-video bg-gradient-to-br from-[#87CEEB] to-[#E0BBE4] p-4 relative">
                    <div className="absolute top-2 left-2">
                      <PixelCharacter color="#8B5CF6" size={20} />
                    </div>
                    <div className="absolute bottom-2 right-2 text-[8px] text-white pixel-text-shadow">
                      {portfolio.theme}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm pixel-text-shadow">{portfolio.name}</h4>
                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={`px-2 py-1 ${portfolio.status === "PUBLISHED" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        {portfolio.status}
                      </span>
                      <span className="text-muted-foreground">{portfolio.views} VIEWS</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/dashboard/editor" className="flex-1">
                      <PixelButton variant="secondary" className="w-full text-[10px]">
                        EDIT
                      </PixelButton>
                    </Link>
                    <PixelButton variant="accent" className="text-[10px] px-4">
                      VIEW
                    </PixelButton>
                  </div>
                </div>
              </PixelCard>
            ))}
          </div>
        ) : (
          <PixelCard>
            <div className="text-center py-12 space-y-4">
              <PixelCharacter color="#FBBF24" size={60} />
              <h4 className="text-sm pixel-text-shadow">NO PORTFOLIOS YET</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                CREATE YOUR FIRST PIXEL PORTFOLIO TO GET STARTED
              </p>
              <Link href="/dashboard/editor">
                <PixelButton variant="primary" className="text-[10px]">
                  CREATE PORTFOLIO
                </PixelButton>
              </Link>
            </div>
          </PixelCard>
        )}
      </div>

      {/* Activity Feed */}
      <PixelCard>
        <div className="space-y-4">
          <h3 className="text-sm pixel-text-shadow">RECENT ACTIVITY</h3>
          <div className="space-y-3">
            {[
              { action: "PUBLISHED", item: "MY PORTFOLIO", time: "2 HOURS AGO" },
              { action: "UPLOADED", item: "SUNSET.PNG", time: "5 HOURS AGO" },
              { action: "CREATED", item: "DEV PORTFOLIO", time: "1 DAY AGO" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b-2 border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary" />
                  <span className="text-[10px]">
                    {activity.action} <span className="text-primary">{activity.item}</span>
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </PixelCard>
    </div>
  )
}
