// app/api/desktop/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { desktopSettings, portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserBySupabaseId(supabaseUser.id)
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
      wallpaperAsset: row.wallpaperAsset ?? undefined,
      desktopGifAsset: row.desktopGifAsset ?? undefined,
      widget1Asset: row.widget1Asset ?? undefined,
      widget2Asset: row.widget2Asset ?? undefined,
      musicPlayerIconAsset: row.musicPlayerIconAsset ?? undefined,
      menubarIconAsset: row.menubarIconAsset ?? undefined,
      menubarText: row.menubarText || '',
    })
  } catch (e) {
    console.error('Desktop settings fetch error:', e)
    return NextResponse.json({ error: 'Failed to fetch desktop settings' }, { status: 500 })
  }
}

