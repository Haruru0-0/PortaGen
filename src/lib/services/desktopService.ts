export interface DesktopData {
  portfolioId: number
  spotifyPlaylistUrl: string
  wallpaperAssetId?: number
  wallpaperUrl?: string
  desktopGifAssetId?: number
  desktopGifUrl?: string
  widget1AssetId?: number
  widget1Url?: string
  widget2AssetId?: number
  widget2Url?: string
  musicPlayerIconAssetId?: number
  musicPlayerIconUrl?: string
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

export async function updateDesktopWallpaper(portfolioId: number, wallpaperAssetId: number | null) {
  const res = await fetch('/api/desktop/wallpaper', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, wallpaperAssetId }),
  })
  if (!res.ok) throw new Error('Failed to update desktop wallpaper')
  return res.json()
}

export async function updateDesktopGif(portfolioId: number, desktopGifAssetId: number | null) {
  const res = await fetch('/api/desktop/gif', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, desktopGifAssetId }),
  })
  if (!res.ok) throw new Error('Failed to update desktop gif')
  return res.json()
}

export async function updateDesktopWidget(portfolioId: number, index: 1 | 2, assetId: number | null) {
  const res = await fetch('/api/desktop/widget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ portfolioId, index, assetId }),
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

