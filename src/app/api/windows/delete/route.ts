// app/api/windows/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { portfolios, windows } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserBySupabaseId(supabaseUser.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const portfolioIdParam = searchParams.get('portfolioId')
    const windowIdParam = searchParams.get('windowId')
    if (!portfolioIdParam || !windowIdParam) return NextResponse.json({ error: 'portfolioId and windowId required' }, { status: 400 })
    const portfolioId = Number(portfolioIdParam)
    const windowId = Number(windowIdParam)

    const owned = await db.query.portfolios.findFirst({ where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)) })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [deleted] = await db
      .delete(windows)
      .where(and(eq(windows.portfolioId, portfolioId), eq(windows.id, windowId)))
      .returning()

    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Windows DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete window' }, { status: 500 })
  }
}

