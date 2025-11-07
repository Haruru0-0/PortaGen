"use client"

import React, {createContext, useContext, useState} from 'react'
import {
  addIcon as addIconAPI,
  deleteIcon as deleteIconAPI,
  getIcon as getIconAPI,
  listIcons,
  updateIcon as updateIconAPI
} from '@/lib/services/iconService'

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
    loading: boolean
    getAllIcons: (portfolioId: number) => Promise<void>
    addIcon: (portfolioId: number, payload: Partial<Icon> & { fileId?: number | string }) => Promise<Icon | undefined>
    updateIcon: (portfolioId: number, payload: Partial<Icon> & { id: number; fileId?: number | string }) => Promise<Icon | undefined>
    deleteIcon: (portfolioId: number, id: number) => Promise<boolean>
    getIconById: (id: number) => Promise<Icon | undefined>
}

const IconContext = createContext<IconContextType | undefined>(undefined)

export function IconProvider({children}: { children: React.ReactNode }) {
    const [icons, setIcons] = useState<Icon[]>([])
    const [loading, setLoading] = useState(false)

    const getAllIcons = async (portfolioId: number) => {
        if (!portfolioId) return
        setLoading(true)
        try {
            const res = await listIcons(portfolioId)
            if (res?.icons) setIcons(res.icons as Icon[])
        } finally {
            setLoading(false)
        }
    }

    const addIcon = async (portfolioId: number, payload: any) => {
        setLoading(true)
        try {
            const created = await addIconAPI({...payload, portfolioId})
            if (created) setIcons((prev) => [...prev, created])
            return created
        } finally {
            setLoading(false)
        }
    }
    const updateIcon = async (portfolioId: number, payload: any) => {
        setLoading(true)
        try {
            const updated = await updateIconAPI({...payload, portfolioId})
            if (updated) setIcons((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
            return updated
        } finally {
            setLoading(false)
        }
    }
    const deleteIcon = async (_portfolioId: number, id: number) => {
        setLoading(true)
        try {
            const ok = await deleteIconAPI(id)
            if (ok) setIcons((prev) => prev.filter((i) => i.id !== id))
            return ok
        } finally {
            setLoading(false)
        }
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
                loading,
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
