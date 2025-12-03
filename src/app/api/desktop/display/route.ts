import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { desktopSettings, portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const username = searchParams.get('username')
        const portfolioIdParam = searchParams.get('portfolioId')

        if (!username || !portfolioIdParam) {
            return NextResponse.json({ error: 'Username and portfolioId required' }, { status: 400 })
        }
        const portfolioId = Number(portfolioIdParam)

        const portfolio = await db.query.portfolios.findFirst({
            where: and(eq(portfolios.id, portfolioId)),
        })
        if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

        const row = await db.query.desktopSettings.findFirst({
            where: eq(desktopSettings.portfolioId, portfolioId),
            with: { wallpaperAsset: true, desktopGifAsset: true, widget1Asset: true, widget2Asset: true, musicPlayerIconAsset: true },
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
        })
    } catch (e) {
        console.error('Desktop settings fetch error:', e)
        return NextResponse.json({ error: 'Failed to fetch desktop settings' }, { status: 500 })
    }
}

