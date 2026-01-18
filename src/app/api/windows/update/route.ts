// app/api/windows/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { portfolios, windows } from '@/lib/db/schema'
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
    const { portfolioId, windowId, name, enabled, position, content } = body || {}
    if (!portfolioId || !windowId) return NextResponse.json({ error: 'portfolioId and windowId required' }, { status: 400 })

    const owned = await db.query.portfolios.findFirst({ where: and(eq(portfolios.id, Number(portfolioId)), eq(portfolios.userId, user.id)) })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const payload: Partial<typeof windows.$inferInsert> = {
      name,
      content: content,
      updatedAt: new Date(),
    }

    const [updated] = await db
      .update(windows)
      .set(payload)
      .where(and(eq(windows.portfolioId, Number(portfolioId)), eq(windows.id, Number(windowId))))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ...updated, data: updated.content })
  } catch (error) {
    console.error('Windows UPDATE error:', error)
    return NextResponse.json({ error: 'Failed to update window' }, { status: 500 })
  }
}

