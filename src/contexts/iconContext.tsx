"use client"

import React, { createContext, useContext, useState } from 'react'
import { toast } from 'sonner'
import {
    addIcon as addIconAPI,
    deleteIcon as deleteIconAPI,
    displayIcons as displayIconsAPI,
    getIcon as getIconAPI,
    listIcons,
    updateIcon as updateIconAPI
} from '@/lib/services/iconService'

export type Icon = {
    id: number;
    name: string;
    icon: string;
    url?: string;
    linkType?: 'window' | 'url';
    iconAssetId?: number;
    position?: number;
    isVisible?: boolean
}

interface IconContextType {
    icons: Icon[]
    setIcons: (icons: Icon[]) => void
    loading: boolean
    getAllIcons: (portfolioId: number) => Promise<void>
    displayIcons: (username: string, portfolioId: number) => Promise<void>
    addIcon: (portfolioId: number, payload: Partial<Icon> & { fileId?: number | string }) => Promise<Icon | undefined>
    updateIcon: (portfolioId: number, payload: Partial<Icon> & { id: number; fileId?: number | string }) => Promise<Icon | undefined>
    deleteIcon: (portfolioId: number, id: number) => Promise<boolean>
    getIconById: (id: number) => Promise<Icon | undefined>
}

const IconContext = createContext<IconContextType | undefined>(undefined)

export function IconProvider({ children }: { children: React.ReactNode }) {
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
            const created = await addIconAPI({ ...payload, portfolioId })
            if (created) {
                setIcons((prev) => [...prev, created])
                toast.success("Icon added successfully!")
            } else {
                toast.error("Failed to add icon")
            }
            return created
        } catch (error) {
            console.error("Failed to add icon:", error)
            toast.error("Failed to add icon")
        } finally {
            setLoading(false)
        }
    }
    const updateIcon = async (portfolioId: number, payload: any) => {
        setLoading(true)
        try {
            const updated = await updateIconAPI({ ...payload, portfolioId })
            if (updated) {
                setIcons((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
                toast.success("Icon updated successfully!")
            } else {
                toast.error("Failed to update icon")
            }
            return updated
        } catch (error) {
            console.error("Failed to update icon:", error)
            toast.error("Failed to update icon")
        } finally {
            setLoading(false)
        }
    }
    const deleteIcon = async (_portfolioId: number, id: number) => {
        setLoading(true)
        try {
            const ok = await deleteIconAPI(id)
            if (ok) {
                setIcons((prev) => prev.filter((i) => i.id !== id))
                toast.success("Icon deleted successfully!")
            } else {
                toast.error("Failed to delete icon")
            }
            return ok
        } catch (error) {
            console.error("Failed to delete icon:", error)
            toast.error("Failed to delete icon")
            return false
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

    const displayIcons = async (username: string, portfolioId: number) => {
        if (!username || !portfolioId) return
        setLoading(true)
        try {
            const res = await displayIconsAPI(username, portfolioId)
            if (res?.icons) setIcons(res.icons as Icon[])
        } finally {
            setLoading(false)
        }
    }

    return (
        <IconContext.Provider
            value={{
                icons,
                setIcons,
                loading,
                getAllIcons,
                displayIcons,
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
