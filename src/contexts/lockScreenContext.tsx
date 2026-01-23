"use client"

import React, { createContext, useCallback, useContext, useState } from 'react'
import { toast } from 'sonner'
import { displayLockScreen, getLockScreen, LockScreenData, updateLockScreenPass, updateLockScreenWallpaper } from '@/lib/services/lockScreenService'

interface LockScreenContextType {
  data?: LockScreenData
  loading: boolean
  fetching: boolean
  getLockScreenData: (portfolioId: number) => Promise<void>
  displayLockScreenData: (username: string, portfolioId: number) => Promise<void>
  updateWallpaper: (portfolioId: number, wallpaperAssetId: number | null, url?: string) => Promise<void>
  updatePass: (portfolioId: number, payload: { enabled?: boolean; password?: string; hint?: string }) => Promise<void>
}

const LockScreenContext = createContext<LockScreenContextType | undefined>(undefined)

export function LockScreenProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LockScreenData | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const getLockScreenData = useCallback(async (pid: number) => {
    setFetching(true)
    try {
      const res = await getLockScreen(pid)
      setData(res)
    } finally {
      setFetching(false)
    }
  }, [])

  const updateWallpaper = async (portfolioId: number, wallpaperAssetId: number | null, url?: string) => {
    setLoading(true)
    try {
      await updateLockScreenWallpaper(portfolioId, wallpaperAssetId, url)
      await getLockScreenData(portfolioId)
      toast.success("Lock screen wallpaper updated!")
    } catch (error) {
      console.error("Failed to update lock screen wallpaper:", error)
      toast.error("Failed to update lock screen wallpaper")
    } finally {
      setLoading(false)
    }
  }

  const updatePass = async (portfolioId: number, payload: { enabled?: boolean; password?: string; }) => {
    setLoading(true)
    try {
      await updateLockScreenPass(portfolioId, payload)
      await getLockScreenData(portfolioId)
      toast.success("Lock screen settings updated!")
    } catch (error) {
      console.error("Failed to update lock screen settings:", error)
      toast.error("Failed to update lock screen settings")
    } finally {
      setLoading(false)
    }
  }

  const displayLockScreenData = async (username: string, portfolioId: number) => {
    setFetching(true)
    try {
      const res = await displayLockScreen(username, portfolioId)
      setData(res)
    } finally {
      setFetching(false)
    }
  }

  const value: LockScreenContextType = { data, loading, fetching, getLockScreenData, displayLockScreenData, updateWallpaper, updatePass }
  return (
    <LockScreenContext.Provider value={value}>
      {children}
    </LockScreenContext.Provider>
  )
}

export function useLockScreenContext() {
  const ctx = useContext(LockScreenContext)
  if (!ctx) throw new Error('useLockScreenContext must be used within LockScreenProvider')
  return ctx
}
