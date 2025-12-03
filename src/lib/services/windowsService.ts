import type { WindowContent } from '@/lib/types'

export const listWindows = async (portfolioId: number) => {
  try {
    const res = await fetch(`/api/windows/list?portfolioId=${portfolioId}`)
    if (!res.ok) return { windows: [] as WindowContent[] }
    return (await res.json()) as { windows: WindowContent[] }
  } catch (e) {
    console.error('listWindows error:', e)
    return { windows: [] as WindowContent[] }
  }
}

export const getWindow = async (portfolioId: number, windowId: number) => {
  try {
    const res = await fetch(`/api/windows/get?portfolioId=${portfolioId}&windowId=${windowId}`)
    if (!res.ok) return undefined
    return (await res.json()) as WindowContent
  } catch (e) {
    console.error('getWindow error:', e)
  }
}

export const createWindow = async (portfolioId: number, name: string, content?: WindowContent['data']['content']) => {
  try {
    const res = await fetch('/api/windows/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portfolioId,
        name,
        content: (content as any)?.data || content // Handle both structures if needed
      }),
    })
    if (!res.ok) throw new Error('Failed to create window')
    return (await res.json()) as WindowContent
  } catch (e) {
    console.error('createWindow error:', e)
  }
}

export const updateWindow = async (portfolioId: number, windowId: number, payload: Partial<Omit<WindowContent, 'id' | 'portfolioId'>>) => {
  try {
    const res = await fetch('/api/windows/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portfolioId,
        windowId,
        ...payload,
        content: (payload as any).data // Map 'data' to 'content' for the API
      }),
    })
    if (!res.ok) throw new Error('Failed to update window')
    return (await res.json()) as WindowContent
  } catch (e) {
    console.error('updateWindow error:', e)
  }
}

export const deleteWindow = async (portfolioId: number, windowId: number) => {
  try {
    const res = await fetch(`/api/windows/delete?portfolioId=${portfolioId}&windowId=${windowId}`, { method: 'DELETE' })
    return res.ok
  } catch (e) {
    console.error('deleteWindow error:', e)
    return false
  }
}

export const displayWindows = async (username: string, portfolioId: number) => {
  try {
    const res = await fetch(`/api/windows/display?username=${encodeURIComponent(username)}&portfolioId=${portfolioId}`)
    if (!res.ok) return { windows: [] as WindowContent[] }
    return (await res.json()) as { windows: WindowContent[] }
  } catch (e) {
    console.error('displayWindows error:', e)
    return { windows: [] as WindowContent[] }
  }
}

