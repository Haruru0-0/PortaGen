// app/api/desktop/spotify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { desktopSettings, portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'
import { completeChecklistTask } from '@/lib/activity'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserByClerkId(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json().catch(() => ({}))
    const { portfolioId, spotifyPlaylistUrl } = body || {}
    if (!portfolioId) return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })

    const owned = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
    })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [updated] = await db
      .update(desktopSettings)
      .set({ spotifyPlaylistUrl: spotifyPlaylistUrl ?? null, updatedAt: new Date() })
      .where(eq(desktopSettings.portfolioId, portfolioId))
      .returning()

    if (spotifyPlaylistUrl) {
      await completeChecklistTask(user.id, "EMBED_MUSIC");
    }

    return NextResponse.json(updated)
  } catch (e) {
    console.error('Desktop spotify update error:', e)
    return NextResponse.json({ error: 'Failed to update desktop spotify url' }, { status: 500 })
  }
}

