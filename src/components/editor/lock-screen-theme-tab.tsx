import { useEffect } from "react"
import { useParams } from "next/navigation"
import { WorkspacePanel as PixelCard, WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { LOCK_SCREEN_TEMPLATES } from "@/lib/constants/theme-templates"
import { useThemeStore } from "@/lib/stores/theme-store"
import { useTheme } from "@/contexts/theme-context"
import { ThemeStyleChoices } from "@/components/editor/theme-style-choices"

export function LockScreenThemeTab() {
  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const lockScreenStyleId = useThemeStore((state) => state.lockScreenStyleId) || "liquid-glass"
  const setTheme = useThemeStore((state) => state.setTheme)
  const { updateTheme, getThemeData, saving } = useTheme()

  useEffect(() => {
    if (currentPortfolioId) void getThemeData(currentPortfolioId)
  }, [currentPortfolioId, getThemeData])

  return (
    <PixelCard>
      <div className="grid gap-6">
        <ThemeStyleChoices label="LOCK SCREEN STYLE" options={LOCK_SCREEN_TEMPLATES}
          description="How the clock and login card look. The preview updates as you choose."
          value={lockScreenStyleId} onChange={(value) => setTheme({ lockScreenStyleId: value })} />
        <PixelButton
          className="w-full text-xs"
          disabled={saving}
          onClick={() => updateTheme(currentPortfolioId, { lockScreenStyleId })}
        >
          {saving ? "SAVING..." : "SAVE LOCK SCREEN STYLE"}
        </PixelButton>
      </div>
    </PixelCard>
  )
}
