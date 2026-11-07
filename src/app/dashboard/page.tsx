import { PixelCard } from "@/components/pixel-card"
import { PixelCharacter } from "@/components/pixel-character"
import { createClient } from "@/utils/supabase/server"
import { getUserBySupabaseId, getOrCreateUser } from "@/lib/db/helpers"
import { getDashboardStats } from "@/lib/activity"
import { formatDistanceToNow } from "date-fns"
import { redirect } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Dashboard | PortaGen" }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user: supabaseUser } } = await supabase.auth.getUser()

  if (!supabaseUser) {
    redirect("/auth/login");
  }

  // Ensure user exists in our database
  // Sign up metadata might contain the chosen username
  const username = supabaseUser.user_metadata.username ||
    supabaseUser.user_metadata.full_name ||
    supabaseUser.email?.split('@')[0] ||
    'PLAYER';

  const user = await getOrCreateUser(
    supabaseUser.id,
    supabaseUser.email!,
    username
  );

  if (!user) {
    redirect("/auth/login");
  }

  const { checklist, recentActivity, stats } = await getDashboardStats(user.id);

  const checklistItems = [
    { id: 'CREATE_PORTFOLIO', task: "CREATE YOUR FIRST PORTFOLIO", href: "/dashboard/portfolios", done: checklist.CREATE_PORTFOLIO },
    { id: 'UPLOAD_WALLPAPER', task: "UPLOAD A WALLPAPER", href: "/dashboard/assets", done: checklist.UPLOAD_WALLPAPER },
    { id: 'ADD_DESKTOP_ICONS', task: "ADD DESKTOP ICONS", href: "/dashboard/portfolios", done: checklist.ADD_DESKTOP_ICONS },
    { id: 'EMBED_MUSIC', task: "EMBED MUSIC", href: "/dashboard/portfolios", done: checklist.EMBED_MUSIC },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Section */}
      <PixelCard>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <h2 className="text-lg pixel-text-shadow break-words">WELCOME BACK, {user.username?.toUpperCase() || 'PLAYER'}!</h2>
            <p className="font-dialogue text-sm text-muted-foreground leading-relaxed">READY TO BUILD SOMETHING AWESOME TODAY?</p>
          </div>
          <PixelCharacter color="#8B5CF6" size={40} animate />
        </div>
      </PixelCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "PORTFOLIOS", value: stats.portfolioCount.toString(), color: "bg-primary text-primary-foreground" },
          { label: "TOTAL VIEWS", value: stats.totalViews.toString(), color: "bg-secondary" },
          { label: "ASSETS", value: stats.assetCount.toString(), color: "bg-accent" },
        ].map((stat, i) => (
          <PixelCard key={i}>
            <div className="space-y-2">
              <div className={`w-12 h-12 ${stat.color} flex items-center justify-center text-xl pixel-text-shadow`}>
                {stat.value}
              </div>
              <p className="font-dialogue text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </PixelCard>
        ))}
      </div>

      {/* Get Started Checklist */}
      <PixelCard>
        <div className="space-y-4">
          <h3 className="text-sm pixel-text-shadow">GET STARTED CHECKLIST</h3>
          <div className="space-y-3">
            {checklistItems.map((item, i) => (
              <Link key={i} href={item.href} className="flex items-center gap-3 min-h-11 hover:underline">
                <div
                  className={`w-5 h-5 shrink-0 border-2 border-border ${item.done ? "bg-primary text-primary-foreground" : "bg-muted"} flex items-center justify-center`}
                  aria-hidden="true"
                >
                  {item.done && <span className="font-dialogue text-sm">✓</span>}
                </div>
                <span className={`font-dialogue text-sm break-words ${item.done ? "text-muted-foreground" : ""}`}>
                  {item.task}
                  <span className="sr-only">{item.done ? " (done)" : " (to do)"}</span>
                </span>
                <span aria-hidden="true" className="ml-auto text-xs">→</span>
              </Link>
            ))}
          </div>
        </div>
      </PixelCard>

      {/* Activity Feed */}
      <PixelCard>
        <div className="space-y-4">
          <h3 className="text-sm pixel-text-shadow">RECENT ACTIVITY</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-start justify-between py-3 border-b-2 border-border last:border-0 gap-2 overflow-hidden">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-2 h-2 bg-primary shrink-0 mt-1.5" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-dialogue text-sm leading-normal break-words">
                        {!activity.description.toLowerCase().startsWith(String(activity.actionType).toLowerCase()) && (
                          <span className="text-primary font-bold mr-1">{activity.actionType}</span>
                        )}
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground uppercase sm:text-right shrink-0 whitespace-nowrap self-end sm:self-start sm:mt-1">
                    {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                  </span>
                </div>
              ))
            ) : (
              <div className="font-dialogue text-sm text-muted-foreground py-2">NO RECENT ACTIVITY</div>
            )}
          </div>
        </div>
      </PixelCard>
    </div>
  )
}
