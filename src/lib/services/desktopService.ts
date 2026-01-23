import { Asset } from "../types"

export interface DesktopData {
  portfolioId: number
  spotifyPlaylistUrl: string
  wallpaperAsset?: Asset
  wallpaperUrl?: string
  desktopGifAsset?: Asset
  widget1Asset?: Asset
  widget2Asset?: Asset
  musicPlayerIconAsset?: Asset
  menubarIconAsset?: Asset
  menubarIconUrl?: string
  menubarText?: string
  desktopGifUrl?: string
  widget1Url?: string
  widget2Url?: string
}

export async function getDesktop(portfolioId: number): Promise<DesktopData | undefined> {
  try {
    const res = await fetch(`/api/desktop?portfolioId=${portfolioId}`)
    if (!res.ok) return undefined
    return await res.json()
  } catch (e) {
    console.error('getDesktop error:', e)
  }
}

export async function updateDesktopWallpaper(portfolioId: number, wallpaperAssetId: number | null, wallpaperUrl?: string) {
  const res = await fetch('/api/desktop/wallpaper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, wallpaperAssetId, wallpaperUrl }),
  })
  if (!res.ok) throw new Error('Failed to update desktop wallpaper')
  return res.json()
}

export async function updateDesktopGif(portfolioId: number, desktopGifAssetId: number | null, desktopGifUrl?: string) {
  const res = await fetch('/api/desktop/gif', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, desktopGifAssetId, desktopGifUrl }),
  })
  if (!res.ok) throw new Error('Failed to update desktop gif')
  return res.json()
}

export async function updateDesktopWidget(portfolioId: number, index: 1 | 2, assetId: number | null, url?: string) {
  const res = await fetch('/api/desktop/widget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, index, assetId, url }),
  })
  if (!res.ok) throw new Error('Failed to update desktop widget')
  return res.json()
}

export async function updateDesktopSpotify(portfolioId: number, spotifyPlaylistUrl: string) {
  const res = await fetch('/api/desktop/spotify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, spotifyPlaylistUrl }),
  })
  if (!res.ok) throw new Error('Failed to update desktop spotify url')
  return res.json()
}

export async function updateDesktopMenubar(portfolioId: number, menubarIconAssetId: number | null, menubarText: string, menubarIconUrl?: string) {
  const res = await fetch('/api/desktop/menubar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, menubarIconAssetId, menubarText, menubarIconUrl }),
  })
  if (!res.ok) throw new Error('Failed to update desktop menubar settings')
  return res.json()
}

export async function displayDesktop(username: string, portfolioId: number) {
  try {
    const res = await fetch(`/api/desktop/display?username=${encodeURIComponent(username)}&portfolioId=${portfolioId}`)
    if (!res.ok) return undefined
    return await res.json()
  } catch (e) {
    console.error('displayDesktop error:', e)
  }
}

