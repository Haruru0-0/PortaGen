// app/api/desktop/gif/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { desktopSettings, portfolios, portfolioAssets } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserBySupabaseId(supabaseUser.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json().catch(() => ({}))
    const { portfolioId, desktopGifAssetId, desktopGifUrl } = body || {}
    if (!portfolioId) return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })

    const owned = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
    })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [updated] = await db
      .update(desktopSettings)
      .set({ desktopGifAssetId: desktopGifAssetId ?? null, desktopGifUrl: desktopGifUrl ?? null, updatedAt: new Date() })
      .where(eq(desktopSettings.portfolioId, portfolioId))
      .returning()

    if (desktopGifAssetId) {
      await db
        .insert(portfolioAssets)
        .values({ portfolioId, assetId: desktopGifAssetId })
        .onConflictDoNothing()
    }

    return NextResponse.json(updated)
  } catch (e) {
    console.error('Desktop gif update error:', e)
    return NextResponse.json({ error: 'Failed to update desktop gif' }, { status: 500 })
  }
}
