// app/api/lock-screen/pass/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { lockScreenSettings, portfolios } from '@/lib/db/schema'
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
    const { portfolioId, enabled, password } = body || {}
    if (!portfolioId) return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })

    const owned = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
    })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const updatePayload: Partial<typeof lockScreenSettings.$inferInsert> = {
      updatedAt: new Date(),
    }
    if (typeof enabled === 'boolean') updatePayload.enabled = enabled
    if (typeof password === 'string') updatePayload.password = password

    const [updated] = await db
      .update(lockScreenSettings)
      .set(updatePayload)
      .where(eq(lockScreenSettings.portfolioId, portfolioId))
      .returning()

    return NextResponse.json(updated)
  } catch (e) {
    console.error('Lock screen pass update error:', e)
    return NextResponse.json({ error: 'Failed to update lock screen settings' }, { status: 500 })
  }
}

