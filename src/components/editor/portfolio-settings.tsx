import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { usePortfolioContext } from "@/contexts/portfolioContext"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { PixelButton } from "../pixel-button"

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
                    <div>
                        <label className="block text-xs uppercase tracking-wider mb-1">Portfolio Name</label>
                        <PixelInput
                            value={portfolioInfo?.portfolioName || ""}
                            onChange={(e) => setPortfolioName(e.target.value)}
                            placeholder="MY PORTFOLIO"
                        />
                    </div>
                    <div>
                        <label className="block text-xs uppercase tracking-wider mb-1">Bio</label>
                        <textarea
                            value={portfolioInfo?.bio || ""}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="A short description..."
                            className="w-full px-4 py-2 text-xs bg-input border-4 border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
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
