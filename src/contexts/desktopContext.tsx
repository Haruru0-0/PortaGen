"use client"

import React, { createContext, useContext, useState } from 'react'
import { DesktopData, getDesktop, updateDesktopGif, updateDesktopSpotify, updateDesktopWallpaper, updateDesktopWidget } from '@/lib/services/desktopService'

interface DesktopContextType {
  data?: DesktopData
  loading: boolean
  getDesktopData: (portfolioId: number) => Promise<void>
  updateWallpaper: (portfolioId: number, assetId: number | null) => Promise<void>
  updateGif: (portfolioId: number, assetId: number | null) => Promise<void>
  updateWidget: (portfolioId: number, index: 1 | 2, assetId: number | null) => Promise<void>
  updateSpotify: (portfolioId: number, url: string) => Promise<void>
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined)

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DesktopData | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const getDesktopData = async (pid: number) => {
    setLoading(true)
    try {
      const res = await getDesktop(pid)
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  const updateWallpaper = async (portfolioId: number, assetId: number | null) => {
    await updateDesktopWallpaper(portfolioId, assetId)
    await getDesktopData(portfolioId)
  }
  const updateGif = async (portfolioId: number, assetId: number | null) => {
    await updateDesktopGif(portfolioId, assetId)
    await getDesktopData(portfolioId)
  }
  const updateWidget = async (portfolioId: number, index: 1 | 2, assetId: number | null) => {
    await updateDesktopWidget(portfolioId, index, assetId)
    await getDesktopData(portfolioId)
  }
  const updateSpotify = async (portfolioId: number, url: string) => {
    await updateDesktopSpotify(portfolioId, url)
    await getDesktopData(portfolioId)
  }

  const value: DesktopContextType = { data, loading, getDesktopData, updateWallpaper, updateGif, updateWidget, updateSpotify }
  return (
      <DesktopContext.Provider value={value}>
        {children}
      </DesktopContext.Provider>
  )
}

export function useDesktopContext() {
  const ctx = useContext(DesktopContext)
  if (!ctx) throw new Error('useDesktopContext must be used within DesktopProvider')
  return ctx
}
