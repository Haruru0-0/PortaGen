// app/api/desktop/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { desktopSettings, portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserByClerkId(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const portfolioIdParam = searchParams.get('portfolioId')
    if (!portfolioIdParam) return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
    const portfolioId = Number(portfolioIdParam)

    const owned = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
    })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const row = await db.query.desktopSettings.findFirst({
      where: eq(desktopSettings.portfolioId, portfolioId),
      with: {
        wallpaperAsset: true,
        desktopGifAsset: true,
        widget1Asset: true,
        widget2Asset: true,
        musicPlayerIconAsset: true,
        menubarIconAsset: true
      },
    })
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      portfolioId: row.portfolioId,
      spotifyPlaylistUrl: row.spotifyPlaylistUrl || '',
      wallpaperAssetId: row.wallpaperAssetId ?? undefined,
      wallpaperUrl: row.wallpaperAsset?.thumbnailUrl || '',
      desktopGifAssetId: row.desktopGifAssetId ?? undefined,
      desktopGifUrl: row.desktopGifAsset?.thumbnailUrl || '',
      widget1AssetId: row.widget1AssetId ?? undefined,
      widget1Url: row.widget1Asset?.thumbnailUrl || '',
      widget2AssetId: row.widget2AssetId ?? undefined,
      widget2Url: row.widget2Asset?.thumbnailUrl || '',
      musicPlayerIconAssetId: row.musicPlayerIconAssetId ?? undefined,
      musicPlayerIconUrl: row.musicPlayerIconAsset?.displayUrl || '',
      menubarIconAssetId: row.menubarIconAssetId ?? undefined,
      menubarIconUrl: row.menubarIconAsset?.displayUrl || '',
      menubarText: row.menubarText || '',
    })
  } catch (e) {
    console.error('Desktop settings fetch error:', e)
    return NextResponse.json({ error: 'Failed to fetch desktop settings' }, { status: 500 })
  }
}

