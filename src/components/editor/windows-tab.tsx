import { PixelCard } from "@/components/pixel-card"
import { Edit2, Layout } from "lucide-react"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useWindowsContext } from "@/contexts/windowsContext"

export function WindowsTab() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { windows, fetchWindows } = useWindowsContext()

  useEffect(() => {
    if (currentPortfolioId) void fetchWindows(currentPortfolioId)
  }, [currentPortfolioId])

  return (
    <div className="space-y-6">
      <PixelCard>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm dashboard-pixel-text-shadow">YOUR WINDOWS</h3>
            <div className="text-[10px] text-muted-foreground">
              {windows.length} window{windows.length !== 1 ? 's' : ''}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground">
            Manage your existing content windows
          </p>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {windows.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-border">
                <Layout className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-[10px] text-muted-foreground">No windows created yet</p>
              </div>
            ) : (
              windows.map((w) => (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3 border-2 border-border bg-muted hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold truncate">{w.name}</span>
                        <span className="text-[8px] px-1 py-0.5 border border-border bg-card capitalize">
                          {w.data?.type || 'text'}
                        </span>
                      </div>
                      <p className="text-[8px] text-muted-foreground truncate">
                        {w.data?.description || 'Custom content'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const pid = params?.id
                      if (pid && w.id) router.push(`/dashboard/editor/${pid}/windows/${w.id}`)
                    }}
                    className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </PixelCard>
    </div>
  )
}

