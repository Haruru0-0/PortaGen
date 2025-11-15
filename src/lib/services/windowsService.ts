export type WindowContent = {
  id: number
  portfolioId: number
  windowId: string
  name: string
  enabled: boolean
  position: number
  iconId?: number | null
  content?: { type: 'text' | 'markdown' | 'html' | 'projects' | 'links'; data: any }
}

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

export const getWindow = async (portfolioId: number, windowId: string) => {
  try {
    const res = await fetch(`/api/windows/get?portfolioId=${portfolioId}&windowId=${encodeURIComponent(windowId)}`)
    if (!res.ok) return undefined
    return (await res.json()) as WindowContent
  } catch (e) {
    console.error('getWindow error:', e)
  }
}

export const createWindow = async (portfolioId: number, name: string, baseWindowId?: string, content?: WindowContent['content']) => {
  try {
    const res = await fetch('/api/windows/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolioId, name, baseWindowId, content }),
    })
    if (!res.ok) throw new Error('Failed to create window')
    return (await res.json()) as WindowContent
  } catch (e) {
    console.error('createWindow error:', e)
  }
}

export const updateWindow = async (portfolioId: number, windowId: string, payload: Partial<Omit<WindowContent, 'id' | 'portfolioId' | 'windowId'>>) => {
  try {
    const res = await fetch('/api/windows/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolioId, windowId, ...payload }),
    })
    if (!res.ok) throw new Error('Failed to update window')
    return (await res.json()) as WindowContent
  } catch (e) {
    console.error('updateWindow error:', e)
  }
}

export const deleteWindow = async (portfolioId: number, windowId: string) => {
  try {
    const res = await fetch(`/api/windows/delete?portfolioId=${portfolioId}&windowId=${encodeURIComponent(windowId)}`, { method: 'DELETE' })
    return res.ok
  } catch (e) {
    console.error('deleteWindow error:', e)
    return false
  }
}

