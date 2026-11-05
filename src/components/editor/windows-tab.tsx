import { PixelCard } from "@/components/pixel-card"
import { Edit2, Layout } from "lucide-react"
import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useWindowsContext } from "@/contexts/windowsContext"
import { useEditorUIStore } from "@/lib/stores/ui-store"
import { PixelButton } from "@/components/pixel-button"

export function WindowsTab() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { windows, fetchWindows } = useWindowsContext()
  const { setActiveHomeScreenTab } = useEditorUIStore()

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

          <p className="font-dialogue text-sm text-muted-foreground">
            A window opens when a visitor clicks a desktop icon. To make a new one, add an icon that links to a window;
            it then shows up here so you can edit what is inside.
          </p>
          <PixelButton variant="secondary" className="text-[10px]" onClick={() => setActiveHomeScreenTab("icons")}>
            ADD AN ICON
          </PixelButton>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {windows.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-border">
                <Layout className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="font-dialogue text-sm text-muted-foreground">
                  No windows yet. Go to the Icons tab, add an icon and choose &quot;Link to Window&quot;.
                </p>
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
                    className="w-10 h-10 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                    aria-label={`Edit window ${w.name}`}
                    title="Edit window"
                  >
                    <Edit2 className="w-4 h-4" />
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

