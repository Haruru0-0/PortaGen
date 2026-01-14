import { Asset } from "../types"

export interface LockScreenData {
  portfolioId: number
  enabled: boolean
  password: string | null
  hint: string | null
  wallpaperAsset?: Asset
}

export async function getLockScreen(portfolioId: number): Promise<LockScreenData | undefined> {
  try {
    const res = await fetch(`/api/lock-screen?portfolioId=${portfolioId}`)
    if (!res.ok) return undefined
    return await res.json()
  } catch (e) {
    console.error('getLockScreen error:', e)
  }
}

export async function updateLockScreenWallpaper(portfolioId: number, wallpaperAssetId: number | null) {
  const res = await fetch('/api/lock-screen/wallpaper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, wallpaperAssetId }),
  })
  if (!res.ok) throw new Error('Failed to update lock screen wallpaper')
  return res.json()
}

export async function updateLockScreenPass(portfolioId: number, data: { enabled?: boolean; password?: string; }) {
  const res = await fetch('/api/lock-screen/pass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, ...data }),
  })
  if (!res.ok) throw new Error('Failed to update lock screen settings')
  return res.json()
}

export async function displayLockScreen(username: string, portfolioId: number) {
  try {
    const res = await fetch(`/api/lock-screen/display?username=${encodeURIComponent(username)}&portfolioId=${portfolioId}`)
    if (!res.ok) return undefined
    return await res.json()
  } catch (e) {
    console.error('displayLockScreen error:', e)
  }
}

