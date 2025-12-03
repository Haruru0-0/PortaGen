"use client"

import React, { createContext, useContext, useState } from 'react'
import type { WindowContent } from '@/lib/types'
import { displayWindows as displayWindowsAPI, listWindows, getWindow as getWindowAPI, createWindow as createWindowAPI, updateWindow as updateWindowAPI, deleteWindow as deleteWindowAPI } from '@/lib/services/windowsService'

interface WindowsContextType {
  windows: WindowContent[]
  loading: boolean
  setWindows: (rows: WindowContent[]) => void
  fetchWindows: (portfolioId: number) => Promise<void>
  displayWindows: (username: string, portfolioId: number) => Promise<void>
  getWindow: (portfolioId: number, windowId: number) => Promise<WindowContent | undefined>
  createWindow: (portfolioId: number, name: string, content?: WindowContent['data']['content']) => Promise<WindowContent | undefined>
  updateWindow: (portfolioId: number, windowId: number, payload: Partial<Omit<WindowContent, 'id' | 'portfolioId'>>) => Promise<WindowContent | undefined>
  deleteWindow: (portfolioId: number, windowId: number) => Promise<boolean>
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

  const getWindow = async (portfolioId: number, windowId: number) => {
    try {
      return await getWindowAPI(portfolioId, windowId)
    } catch {
      return undefined
    }
  }

  const createWindow = async (portfolioId: number, name: string, content?: WindowContent['data']['content']) => {
    setLoading(true)
    try {
      const created = await createWindowAPI(portfolioId, name, content)
      if (created) setWindows((prev) => [...prev, created])
      return created
    } finally {
      setLoading(false)
    }
  }

  const updateWindow = async (portfolioId: number, windowId: number, payload: Partial<Omit<WindowContent, 'id' | 'portfolioId'>>) => {
    setLoading(true)
    try {
      const updated = await updateWindowAPI(portfolioId, windowId, payload)
      if (updated) setWindows((prev) => prev.map((w) => (w.id === windowId ? updated : w)))
      return updated
    } finally {
      setLoading(false)
    }
  }

  const deleteWindow = async (portfolioId: number, windowId: number) => {
    setLoading(true)
    try {
      const ok = await deleteWindowAPI(portfolioId, windowId)
      if (ok) setWindows((prev) => prev.filter((w) => w.id !== windowId))
      return ok
    } finally {
      setLoading(false)
    }
  }

  const displayWindows = async (username: string, portfolioId: number) => {
    setLoading(true)
    try {
      const res = await displayWindowsAPI(username, portfolioId)
      if (res?.windows) setWindows(res.windows)
    } finally {
      setLoading(false)
    }
  }

  return (
    <WindowsContext.Provider
      value={{ windows, loading, setWindows, fetchWindows, displayWindows, getWindow, createWindow, updateWindow, deleteWindow }}
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

