"use client"

import React, { createContext, useContext, useState } from 'react'
import { getLockScreen, LockScreenData, updateLockScreenPass, updateLockScreenWallpaper } from '@/lib/services/lockScreenService'

interface LockScreenContextType {
  data?: LockScreenData
  loading: boolean
  getLockScreenData: (portfolioId: number) => Promise<void>
  updateWallpaper: (portfolioId: number, wallpaperAssetId: number | null) => Promise<void>
  updatePass: (portfolioId: number, payload: { enabled?: boolean; password?: string; hint?: string }) => Promise<void>
}

const LockScreenContext = createContext<LockScreenContextType | undefined>(undefined)

export function LockScreenProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LockScreenData | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const getLockScreenData = async (pid: number) => {
    setLoading(true)
    try {
      const res = await getLockScreen(pid)
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  const updateWallpaper = async (portfolioId: number, wallpaperAssetId: number | null) => {
    await updateLockScreenWallpaper(portfolioId, wallpaperAssetId)
    await getLockScreenData(portfolioId)
  }

  const updatePass = async (portfolioId: number, payload: { enabled?: boolean; password?: string; hint?: string }) => {
    await updateLockScreenPass(portfolioId, payload)
    await getLockScreenData(portfolioId)
  }

  const value: LockScreenContextType = { data, loading, getLockScreenData, updateWallpaper, updatePass }
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
