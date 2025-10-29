"use client"

import { useState } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { PixelModal } from "@/components/pixel-modal"
import { PixelInput } from "@/components/pixel-input"
import { Plus, Loader2 } from "lucide-react"

interface Portfolio {
    id: number
    name: string
    slug: string
    isPublished: boolean
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
                    username: newPortfolioName.toLowerCase().replace(/\s+/g, '-'),
                    slug: newPortfolioName.toLowerCase().replace(/\s+/g, '-'),
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
                        <label className="block text-xs uppercase tracking-wider">PORTFOLIO</label>
                        <PixelButton
                            variant="secondary"
                            className="text-[10px] flex items-center gap-1 px-3 py-1"
                            onClick={() => setIsCreatePortfolioModalOpen(true)}
                        >
                            <Plus className="w-3 h-3" />
                            NEW
                        </PixelButton>
                    </div>
                    <select
                        value={currentPortfolioId || ''}
                        onChange={(e) => onPortfolioChange(Number(e.target.value))}
                        className="w-full px-4 py-3 text-xs bg-input border-4 border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">SELECT PORTFOLIO</option>
                        {portfolios.map(portfolio => (
                            <option key={portfolio.id} value={portfolio.id}>
                                {portfolio.name} ({portfolio.slug})
                            </option>
                        ))}
                    </select>
                    {portfolios.length === 0 && (
                        <p className="text-[10px] text-muted-foreground mt-2">
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
                        <label className="block text-xs uppercase tracking-wider">PORTFOLIO NAME</label>
                        <PixelInput
                            placeholder="ENTER PORTFOLIO NAME"
                            value={newPortfolioName}
                            onChange={(e) => setNewPortfolioName(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <PixelButton
                            variant="secondary"
                            className="text-[10px]"
                            onClick={() => setIsCreatePortfolioModalOpen(false)}
                        >
                            CANCEL
                        </PixelButton>
                        <PixelButton
                            variant="primary"
                            className="text-[10px]"
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