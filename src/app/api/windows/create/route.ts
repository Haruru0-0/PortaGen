// app/api/windows/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios, windows } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserByClerkId(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json().catch(() => ({}))
    const { portfolioId, name, baseWindowId, content } = body || {}
    if (!portfolioId || !name) return NextResponse.json({ error: 'portfolioId and name required' }, { status: 400 })

    const owned = await db.query.portfolios.findFirst({ where: and(eq(portfolios.id, Number(portfolioId)), eq(portfolios.userId, user.id)) })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const base = (baseWindowId || name).toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'window'
    let candidate = base
    let i = 1
    // ensure unique
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const exists = await db.query.windows.findFirst({ where: and(eq(windows.portfolioId, Number(portfolioId)), eq(windows.windowId, candidate)) })
      if (!exists) break
      i += 1
      candidate = `${base}-${i}`
    }

    const [created] = await db
      .insert(windows)
      .values({ portfolioId: Number(portfolioId), windowId: candidate, name, enabled: true, content })
      .returning()

    return NextResponse.json(created)
  } catch (error) {
    console.error('Windows CREATE error:', error)
    return NextResponse.json({ error: 'Failed to create window' }, { status: 500 })
  }
}

