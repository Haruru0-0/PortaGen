"use client"

import { useState } from "react"
import { WorkspacePanel as PixelCard } from "@/components/workspace/workspace-primitives"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { WorkspaceModal as PixelModal } from "@/components/workspace/workspace-modal"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { Plus, Loader2 } from "lucide-react"

interface Portfolio {
    id: number
    name: string
}

interface PortfolioSelectorProps {
    portfolios: Portfolio[]
    currentPortfolioId: number | null
    onPortfolioChange: (portfolioId: number) => void
    onPortfolioCreated: (portfolio: Portfolio) => void
}

export function PortfolioSelector({
    portfolios,
    currentPortfolioId,
    onPortfolioChange,
    onPortfolioCreated
}: PortfolioSelectorProps) {
    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] = useState(false)
    const [newPortfolioName, setNewPortfolioName] = useState("")
    const [creatingPortfolio, setCreatingPortfolio] = useState(false)

    const createPortfolio = async () => {
        if (!newPortfolioName.trim()) {
            alert('Please enter a portfolio name')
            return
        }

        setCreatingPortfolio(true)
        try {
            const response = await fetch('/api/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    portfolioName: newPortfolioName,
                }),
            })

            if (response.ok) {
                const newPortfolio = await response.json()
                onPortfolioCreated(newPortfolio)
                setNewPortfolioName("")
                setIsCreatePortfolioModalOpen(false)
            } else {
                const error = await response.json()
                alert(`Failed to create portfolio: ${error.error}`)
            }
        } catch (error) {
            console.error('Failed to create portfolio:', error)
            alert('Failed to create portfolio. Please try again.')
        } finally {
            setCreatingPortfolio(false)
        }
    }

    return (
        <>
            <PixelCard>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm uppercase tracking-wider">PORTFOLIO</label>
                        <PixelButton
                            variant="secondary"
                            className="text-sm flex items-center gap-1 px-3 py-1"
                            onClick={() => setIsCreatePortfolioModalOpen(true)}
                        >
                            <Plus className="w-3 h-3" />
                            NEW
                        </PixelButton>
                    </div>
                    <select aria-label="Portfolio"
                        value={currentPortfolioId || ''}
                        onChange={(e) => { if (e.target.value) onPortfolioChange(Number(e.target.value)) }}
                        className="ws-input w-full"
                    >
                        <option value="">SELECT PORTFOLIO</option>
                        {portfolios.map(portfolio => (
                            <option key={portfolio.id} value={portfolio.id}>
                                {portfolio.name}
                            </option>
                        ))}
                    </select>
                    {portfolios.length === 0 && (
                        <p className="font-[family-name:var(--font-workspace-body)] text-sm text-muted-foreground mt-2">
                            No portfolios found. Create your first portfolio to get started.
                        </p>
                    )}
                </div>
            </PixelCard>

            {/* Create Portfolio Modal */}
            <PixelModal
                isOpen={isCreatePortfolioModalOpen}
                onClose={() => setIsCreatePortfolioModalOpen(false)}
                title="CREATE NEW PORTFOLIO"
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="selector-new-portfolio-name" className="block text-sm uppercase tracking-wider">PORTFOLIO NAME</label>
                        <PixelInput id="selector-new-portfolio-name"
                            placeholder="ENTER PORTFOLIO NAME"
                            value={newPortfolioName}
                            onChange={(e) => setNewPortfolioName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <PixelButton
                            variant="secondary"
                            className="text-sm"
                            onClick={() => setIsCreatePortfolioModalOpen(false)}
                        >
                            CANCEL
                        </PixelButton>
                        <PixelButton
                            variant="primary"
                            className="text-sm"
                            onClick={createPortfolio}
                            disabled={creatingPortfolio || !newPortfolioName.trim()}
                        >
                            {creatingPortfolio ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                    CREATING...
                                </>
                            ) : (
                                'CREATE PORTFOLIO'
                            )}
                        </PixelButton>
                    </div>
                </div>
            </PixelModal>
        </>
    )
}
