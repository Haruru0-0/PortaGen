import { PixelCard } from "@/components/pixel-card"
import { PixelCharacter } from "@/components/pixel-character"
import { getDashboardStats } from "@/lib/activity"
import { formatDistanceToNow } from "date-fns"

export default async function DashboardPage() {

  const { checklist, recentActivity, stats } = await getDashboardStats(user.id);

  const checklistItems = [
    { id: 'CREATE_PORTFOLIO', task: "CREATE YOUR FIRST PORTFOLIO", done: checklist.CREATE_PORTFOLIO },
    { id: 'UPLOAD_WALLPAPER', task: "UPLOAD A WALLPAPER", done: checklist.UPLOAD_WALLPAPER },
    { id: 'ADD_DESKTOP_ICONS', task: "ADD DESKTOP ICONS", done: checklist.ADD_DESKTOP_ICONS },
    { id: 'EMBED_MUSIC', task: "EMBED MUSIC", done: checklist.EMBED_MUSIC },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <PixelCard>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <h2 className="text-lg pixel-text-shadow break-words">WELCOME BACK, {user.username?.toUpperCase() || 'PLAYER'}!</h2>
            <p className="text-[10px] text-muted-foreground leading-relaxed">READY TO BUILD SOMETHING AWESOME TODAY?</p>
          </div>
          <PixelCharacter color="#8B5CF6" size={40} animate />
        </div>
      </PixelCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "PORTFOLIOS", value: stats.portfolioCount.toString(), color: "bg-primary" },
          { label: "TOTAL VIEWS", value: stats.totalViews.toString(), color: "bg-secondary" },
          { label: "ASSETS", value: stats.assetCount.toString(), color: "bg-accent" },
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
            {checklistItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 border-2 border-border ${item.done ? "bg-primary" : "bg-muted"} flex items-center justify-center`}
                >
                  {item.done && <span className="text-[8px]">✓</span>}
                </div>
                <span className={`text-[10px] break-words ${item.done ? "line-through text-muted-foreground" : ""}`}>
                  {item.task}
                </span>
              </div>
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
                      <p className="text-[10px] leading-normal break-words">
                        <span className="text-primary font-bold mr-1">{activity.actionType}</span>
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground uppercase sm:text-right shrink-0 whitespace-nowrap self-end sm:self-start sm:mt-1">
                    {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-[10px] text-muted-foreground py-2">NO RECENT ACTIVITY</div>
            )}
          </div>
        </div>
      </PixelCard>
    </div>
  )
}
