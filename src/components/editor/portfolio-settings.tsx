import { WorkspacePanel as PixelCard } from "@/components/workspace/workspace-primitives"
import { WorkspaceTextarea } from "@/components/workspace/workspace-primitives"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { usePortfolioContext } from "@/contexts/portfolioContext"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"

export function PortfolioSettings() {
    const { portfolioInfo, fetchInfo, updateInfo, setPortfolioName, setBio, loading: portfolioLoading } = usePortfolioContext()
    const params = useParams<{ id: string }>()
    const currentPortfolioId = Number(params?.id)

    useEffect(() => {
        if (currentPortfolioId) {
            fetchInfo(currentPortfolioId)
        }
    }, [currentPortfolioId, fetchInfo])

    const handleSavePortfolioInfo = async () => {
        await updateInfo({
            portfolioName: portfolioInfo?.portfolioName,
            bio: portfolioInfo?.bio || "",
        })
    }

    return (
        <div className="mb-6">
            <PixelCard>
                <div className="flex flex-col gap-4">
                    <h1 className="workspace-editor-page-title persona-page-title" data-page-heading tabIndex={-1}>Portfolio editor</h1>
                    <p className="text-muted-foreground">Save Info applies to the name and bio below.</p>
                    <div>
                        <PixelInput
                            label="Portfolio Name"
                            value={portfolioInfo?.portfolioName || ""}
                            onChange={(e) => setPortfolioName(e.target.value)}
                            placeholder="MY PORTFOLIO"
                        />
                    </div>
                    <div>
                        <label htmlFor="portfolio-bio" className="block text-xs uppercase tracking-wider mb-2">Bio</label>
                        <WorkspaceTextarea
                            id="portfolio-bio"
                            value={portfolioInfo?.bio || ""}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="A short description..."
                            className="workspace-editor-input w-full resize-y"
                            rows={2}
                        />
                    </div>
                    <div className="flex items-end justify-end">
                        <PixelButton
                            onClick={handleSavePortfolioInfo}
                            disabled={portfolioLoading}
                        >
                            {portfolioLoading ? "Saving..." : "Save Info"}
                        </PixelButton>
                    </div>
                </div>
            </PixelCard>
        </div>
    )
}
