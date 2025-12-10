"use client"

import { createContext, ReactNode, useContext, useState, useCallback } from "react"
import {
    getPortfolioInfo,
    updatePortfolioInfo,
    fetchPortfolios,
    createPortfolio as createPortfolioAPI,
    deletePortfolio as deletePortfolioAPI,
} from "@/lib/services/portfolioService"

// Types
export interface PortfolioInfo {
    id: number
    portfolioName: string
    bio: string | null
}

export interface PortfolioListItem {
    id: number
    portfolioName: string
    bio: string | null
    createdAt: string
}

export interface PortfolioContextType {
    // Current portfolio info (for editing)
    portfolioInfo: PortfolioInfo | null
    loading: boolean
    error: string | null

    // Portfolio list
    portfolios: PortfolioListItem[]
    loadingList: boolean

    // Current portfolio full data
    currentPortfolioId: number | null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentPortfolioData: any | null

    // Actions - Info
    fetchInfo: (portfolioId: number) => Promise<void>
    updateInfo: (data: { portfolioName?: string; bio?: string }) => Promise<boolean>
    setPortfolioName: (name: string) => void
    setBio: (bio: string) => void

    // Actions - List
    fetchList: () => Promise<void>

    // Actions - CRUD
    createPortfolio: (portfolioName: string, bio?: string) => Promise<PortfolioListItem | null>
    deletePortfolio: (id: number) => Promise<boolean>

    // Actions - Full data
    setCurrentPortfolioId: (id: number | null) => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
    // Current portfolio info state
    const [portfolioInfo, setPortfolioInfo] = useState<PortfolioInfo | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Portfolio list state
    const [portfolios, setPortfolios] = useState<PortfolioListItem[]>([])
    const [loadingList, setLoadingList] = useState(false)

    // Current portfolio full data
    const [currentPortfolioId, setCurrentPortfolioId] = useState<number | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [currentPortfolioData, setCurrentPortfolioData] = useState<any | null>(null)

    // ==================== INFO ACTIONS ====================

    const fetchInfo = useCallback(async (portfolioId: number) => {
        setLoading(true)
        setError(null)
        try {
            const data = await getPortfolioInfo(portfolioId)
            if (data) {
                setPortfolioInfo(data)
            } else {
                setError("Failed to fetch portfolio info")
            }
        } catch (err) {
            setError("Failed to fetch portfolio info")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    const updateInfo = useCallback(async (data: { portfolioName?: string; bio?: string }) => {
        if (!portfolioInfo?.id) return false

        setLoading(true)
        setError(null)
        try {
            const updated = await updatePortfolioInfo(portfolioInfo.id, data)
            if (updated) {
                setPortfolioInfo(updated)
                // Also update in the list
                setPortfolios(prev => prev.map(p =>
                    p.id === updated.id
                        ? { ...p, portfolioName: updated.portfolioName, bio: updated.bio }
                        : p
                ))
                return true
            } else {
                setError("Failed to update portfolio info")
                return false
            }
        } catch (err) {
            setError("Failed to update portfolio info")
            console.error(err)
            return false
        } finally {
            setLoading(false)
        }
    }, [portfolioInfo?.id])

    const setPortfolioName = useCallback((name: string) => {
        setPortfolioInfo(prev => prev ? { ...prev, portfolioName: name } : null)
    }, [])

    const setBio = useCallback((bio: string) => {
        setPortfolioInfo(prev => prev ? { ...prev, bio } : null)
    }, [])

    // ==================== LIST ACTIONS ====================

    const fetchList = useCallback(async () => {
        setLoadingList(true)
        try {
            const data = await fetchPortfolios()
            if (data?.portfolios) {
                setPortfolios(data.portfolios)
            }
        } catch (err) {
            console.error("Failed to fetch portfolios:", err)
        } finally {
            setLoadingList(false)
        }
    }, [])

    // ==================== CRUD ACTIONS ====================

    const createPortfolio = useCallback(async (portfolioName: string, bio?: string): Promise<PortfolioListItem | null> => {
        try {
            const created = await createPortfolioAPI(portfolioName, bio)
            if (created) {
                const newItem: PortfolioListItem = {
                    id: created.id,
                    portfolioName: created.portfolioName,
                    bio: created.bio,
                    createdAt: new Date().toISOString(),
                }
                setPortfolios(prev => [newItem, ...prev])
                return newItem
            }
        } catch (err) {
            console.error("Failed to create portfolio:", err)
        }
        return null
    }, [])

    const deletePortfolio = useCallback(async (id: number): Promise<boolean> => {
        try {
            const success = await deletePortfolioAPI(id)
            if (success) {
                setPortfolios(prev => prev.filter(p => p.id !== id))
                // Clear current if deleted
                if (currentPortfolioId === id) {
                    setCurrentPortfolioId(null)
                    setPortfolioInfo(null)
                    setCurrentPortfolioData(null)
                }
                return true
            }
        } catch (err) {
            console.error("Failed to delete portfolio:", err)
        }
        return false
    }, [currentPortfolioId])

    return (
        <PortfolioContext.Provider
            value={{
                // Info state
                portfolioInfo,
                loading,
                error,

                // List state
                portfolios,
                loadingList,

                // Current portfolio
                currentPortfolioId,
                currentPortfolioData,

                // Info actions
                fetchInfo,
                updateInfo,
                setPortfolioName,
                setBio,

                // List actions
                fetchList,

                // CRUD actions
                createPortfolio,
                deletePortfolio,

                // Full data actions
                setCurrentPortfolioId,
            }}
        >
            {children}
        </PortfolioContext.Provider>
    )
}

export const usePortfolioContext = () => {
    const context = useContext(PortfolioContext)
    if (!context) {
        throw new Error("usePortfolioContext must be used within PortfolioProvider")
    }
    return context
}
