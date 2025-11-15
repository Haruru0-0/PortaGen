import { PixelCard } from "@/components/pixel-card"
import { Edit2, Layout, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useWindowsContext } from "@/contexts/windowsContext"

export function WindowsTab() {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { windows, fetchWindows, updateWindow, deleteWindow } = useWindowsContext()

  useEffect(() => {
    if (currentPortfolioId) void fetchWindows(currentPortfolioId)
  }, [currentPortfolioId])

  return (
    <div className="space-y-6">
      <PixelCard>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm pixel-text-shadow">YOUR WINDOWS</h3>
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
                  key={(w as any).windowId || (w as any).id}
                  className="flex items-center justify-between p-3 border-2 border-border bg-muted hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={async () => {
                        if (!currentPortfolioId) return
                        await updateWindow(currentPortfolioId, (w as any).windowId, { enabled: !(w as any).enabled })
                      }}
                      className={`w-6 h-6 border-2 border-border flex items-center justify-center transition-colors ${
                        (w as any).enabled ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'
                      }`}
                    >
                      {(w as any).enabled ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold truncate">{(w as any).name}</span>
                        <span className="text-[8px] px-1 py-0.5 border border-border bg-card capitalize">
                          {((w as any).content?.type) || 'text'}
                        </span>
                      </div>
                      <p className="text-[8px] text-muted-foreground truncate">
                        {typeof (w as any).content?.data === 'string' ? (w as any).content?.data : 'Custom content'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const pid = params?.id
                        const windowId = (w as any).windowId ?? (w as any).id
                        if (pid && windowId) router.push(`/dashboard/editor/${pid}/windows/${windowId}`)
                      }}
                      className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {currentPortfolioId && (
                      <button
                        onClick={async () => {
                          await deleteWindow(currentPortfolioId, (w as any).windowId)
                        }}
                        className="w-8 h-8 border-2 border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                      >
                        <EyeOff className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PixelCard>
    </div>
  )
}

