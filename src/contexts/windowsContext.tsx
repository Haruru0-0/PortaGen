"use client"

import React, { createContext, useContext, useState } from 'react'
import type { WindowContent } from '@/lib/services/windowsService'
import { listWindows, getWindow as getWindowAPI, createWindow as createWindowAPI, updateWindow as updateWindowAPI, deleteWindow as deleteWindowAPI } from '@/lib/services/windowsService'

interface WindowsContextType {
  windows: WindowContent[]
  loading: boolean
  setWindows: (rows: WindowContent[]) => void
  fetchWindows: (portfolioId: number) => Promise<void>
  getWindow: (portfolioId: number, windowId: string) => Promise<WindowContent | undefined>
  createWindow: (portfolioId: number, name: string, baseWindowId?: string, content?: WindowContent['content']) => Promise<WindowContent | undefined>
  updateWindow: (portfolioId: number, windowId: string, payload: Partial<Omit<WindowContent, 'id' | 'portfolioId' | 'windowId'>>) => Promise<WindowContent | undefined>
  deleteWindow: (portfolioId: number, windowId: string) => Promise<boolean>
}

const WindowsContext = createContext<WindowsContextType | undefined>(undefined)

export function WindowsProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowContent[]>([])
  const [loading, setLoading] = useState(false)

  const fetchWindows = async (portfolioId: number) => {
    if (!portfolioId) return
    setLoading(true)
    try {
      const res = await listWindows(portfolioId)
      if (res?.windows) setWindows(res.windows)
    } finally {
      setLoading(false)
    }
  }

  const getWindow = async (portfolioId: number, windowId: string) => {
    try {
      return await getWindowAPI(portfolioId, windowId)
    } catch {
      return undefined
    }
  }

  const createWindow = async (portfolioId: number, name: string, baseWindowId?: string, content?: WindowContent['content']) => {
    setLoading(true)
    try {
      const created = await createWindowAPI(portfolioId, name, baseWindowId, content)
      if (created) setWindows((prev) => [...prev, created])
      return created
    } finally {
      setLoading(false)
    }
  }

  const updateWindow = async (portfolioId: number, windowId: string, payload: Partial<Omit<WindowContent, 'id' | 'portfolioId' | 'windowId'>>) => {
    setLoading(true)
    try {
      const updated = await updateWindowAPI(portfolioId, windowId, payload)
      if (updated) setWindows((prev) => prev.map((w) => (w.windowId === windowId ? updated : w)))
      return updated
    } finally {
      setLoading(false)
    }
  }

  const deleteWindow = async (portfolioId: number, windowId: string) => {
    setLoading(true)
    try {
      const ok = await deleteWindowAPI(portfolioId, windowId)
      if (ok) setWindows((prev) => prev.filter((w) => w.windowId !== windowId))
      return ok
    } finally {
      setLoading(false)
    }
  }

  return (
    <WindowsContext.Provider
      value={{ windows, loading, setWindows, fetchWindows, getWindow, createWindow, updateWindow, deleteWindow }}
    >
      {children}
    </WindowsContext.Provider>
  )
}

export function useWindowsContext() {
  const ctx = useContext(WindowsContext)
  if (!ctx) throw new Error('useWindowsContext must be used within WindowsProvider')
  return ctx
}

