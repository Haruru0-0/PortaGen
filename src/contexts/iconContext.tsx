"use client"

import React, {createContext, useContext, useState} from 'react'
import {
  addIcon as addIconAPI,
  deleteIcon as deleteIconAPI,
  getIcon as getIconAPI,
  listIcons,
  updateIcon as updateIconAPI
} from '@/lib/services/iconService'
import {useParams} from "next/navigation";

export type Icon = {
    id: number;
    name: string;
    icon: string;
    url?: string;
    iconAssetId?: number;
    position?: number;
    windowId?: string;
    isVisible?: boolean
}

interface IconContextType {
    icons: Icon[]
    setIcons: (icons: Icon[]) => void
    getAllIcons: () => Promise<void>
    addIcon: (payload: Partial<Icon> & { fileId?: number | string; portfolioId?: number }) => Promise<Icon | undefined>
    updateIcon: (payload: Partial<Icon> & {
        id: number;
        fileId?: number | string;
        portfolioId?: number
    }) => Promise<Icon | undefined>
    deleteIcon: (id: number) => Promise<boolean>
    getIconById: (id: number) => Promise<Icon | undefined>
}

const IconContext = createContext<IconContextType | undefined>(undefined)

export function IconProvider({children}: { children: React.ReactNode }) {
    const params = useParams<{ id: string }>()
    const currentPortfolioId = Number(params?.id)
    const [icons, setIcons] = useState<Icon[]>([])

    const getAllIcons = async () => {
        if (!currentPortfolioId) return
        const res = await listIcons(Number(currentPortfolioId))
        if (res?.icons) setIcons(res.icons as Icon[])
    }

    const addIcon = async (payload: any) => {
        const created = await addIconAPI({...payload, portfolioId: payload.portfolioId || currentPortfolioId})
        if (created) setIcons((prev) => [...prev, created])
        return created
    }
    const updateIcon = async (payload: any) => {
        const updated = await updateIconAPI({...payload, portfolioId: payload.portfolioId || currentPortfolioId})
        if (updated) setIcons((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
        return updated
    }
    const deleteIcon = async (id: number) => {
        const ok = await deleteIconAPI(id)
        if (ok) setIcons((prev) => prev.filter((i) => i.id !== id))
        return ok
    }
    const getIconById = async (id: number) => {
        try {
            const icon = await getIconAPI(id)
            return icon as Icon
        } catch {
            return undefined
        }
    }

    return (
        <IconContext.Provider
            value={{
                icons,
                setIcons,
                getAllIcons,
                addIcon,
                updateIcon,
                deleteIcon,
                getIconById
            }}
        >
            {children}
        </IconContext.Provider>
    )
}

export function useIconContext() {
    const ctx = useContext(IconContext)
    if (!ctx) throw new Error('useIconContext must be used within IconProvider')
    return ctx
}
