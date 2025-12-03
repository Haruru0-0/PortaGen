"use client"

import React, { createContext, useCallback, useContext, useState } from 'react'
import { DesktopData, displayDesktop, getDesktop, updateDesktopGif, updateDesktopSpotify, updateDesktopWallpaper, updateDesktopWidget } from '@/lib/services/desktopService'

interface DesktopContextType {
  data?: DesktopData
  loading: boolean
  fetching: boolean
  getDesktopData: (portfolioId: number) => Promise<void>
  displayDesktopData: (username: string, portfolioId: number) => Promise<void>
  updateWallpaper: (portfolioId: number, assetId: number | null) => Promise<void>
  updateGif: (portfolioId: number, assetId: number | null) => Promise<void>
  updateWidget: (portfolioId: number, index: 1 | 2, assetId: number | null) => Promise<void>
  updateSpotify: (portfolioId: number, url: string) => Promise<void>
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined)

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<DesktopData | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)

  const getDesktopData = useCallback(async (pid: number) => {
    setFetching(true)
    try {
      const res = await getDesktop(pid)
      setData(res)
    } finally {
      setFetching(false)
    }
  }, [])

  const updateWallpaper = async (portfolioId: number, assetId: number | null) => {
    setLoading(true)
    try {
      await updateDesktopWallpaper(portfolioId, assetId)
      await getDesktopData(portfolioId)
    } finally {
      setLoading(false)
    }
  }
  const updateGif = async (portfolioId: number, assetId: number | null) => {
    setLoading(true)
    try {
      await updateDesktopGif(portfolioId, assetId)
      await getDesktopData(portfolioId)
    } finally {
      setLoading(false)
    }
  }
  const updateWidget = async (portfolioId: number, index: 1 | 2, assetId: number | null) => {
    setLoading(true)
    try {
      await updateDesktopWidget(portfolioId, index, assetId)
      await getDesktopData(portfolioId)
    } finally {
      setLoading(false)
    }
  }
  const updateSpotify = async (portfolioId: number, url: string) => {
    setLoading(true)
    try {
      await updateDesktopSpotify(portfolioId, url)
      await getDesktopData(portfolioId)
    } finally {
      setLoading(false)
    }
  }

  const displayDesktopData = async (username: string, portfolioId: number) => {
    setFetching(true)
    try {
      const res = await displayDesktop(username, portfolioId)
      setData(res)
    } finally {
      setFetching(false)
    }
  }

  const value: DesktopContextType = { data, loading, fetching, getDesktopData, displayDesktopData, updateWallpaper, updateGif, updateWidget, updateSpotify }
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
