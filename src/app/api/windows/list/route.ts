// app/api/windows/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { portfolios, windows } from '@/lib/db/schema'
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
    if (!portfolioIdParam) return NextResponse.json({ error: 'portfolioId required' }, { status: 400 })
    const portfolioId = Number(portfolioIdParam)

    const owned = await db.query.portfolios.findFirst({ where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)) })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const rows = await db.query.windows.findMany({ where: eq(windows.portfolioId, portfolioId) })
    const a = rows.map(r => ({ ...r, data: r.content }))
    return NextResponse.json({ windows: a })
  } catch (error) {
    console.error('Windows LIST error:', error)
    return NextResponse.json({ error: 'Failed to list windows' }, { status: 500 })
  }
}

