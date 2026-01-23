// app/api/icons/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { icons, portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'

function format(row: any) {
  return {
    id: row.id,
    name: row.name,
    linkType: row.linkType || 'window',
    url: row.linkUrl || undefined,
    icon: row.asset,
    iconImageUrl: row.iconImageUrl,
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserBySupabaseId(supabaseUser.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const portfolioIdParam = searchParams.get('portfolioId')
    if (!portfolioIdParam) {
      return NextResponse.json({ error: 'portfolioId required' }, { status: 400 })
    }
    const portfolioId = Number(portfolioIdParam)

    // Verify portfolio ownership
    const owned = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
    })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const rows = await db.query.icons.findMany({
      where: eq(icons.portfolioId, portfolioId),
      with: { asset: true },
    })

    return NextResponse.json({ icons: rows.map(format) })
  } catch (error) {
    console.error('Icons list GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch icons' }, { status: 500 })
  }
}
