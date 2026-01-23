// app/api/lock-screen/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { lockScreenSettings, portfolios } from '@/lib/db/schema'
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

    const row = await db.query.lockScreenSettings.findFirst({
      where: eq(lockScreenSettings.portfolioId, portfolioId),
      with: { wallpaperAsset: true },
    })
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      portfolioId: row.portfolioId,
      enabled: row.enabled,
      password: row.password,
      wallpaperAsset: row.wallpaperAsset ?? undefined,
      wallpaperUrl: row.wallpaperUrl || '',
    })
  } catch (e) {
    console.error('Lock screen fetch error:', e)
    return NextResponse.json({ error: 'Failed to fetch lock screen settings' }, { status: 500 })
  }
}

