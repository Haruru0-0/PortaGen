// app/api/portfolio/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios, users, lockScreenSettings, desktopSettings, themeSettings, soundEffects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { logActivity, completeChecklistTask } from '@/lib/activity'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserByClerkId(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json().catch(() => ({}))
    const name: string = body?.portfolioName || 'MY PORTFOLIO'
    const bio: string = body?.bio || ''

    const [portfolio] = await db.insert(portfolios).values({
      userId: user.id,
      portfolioName: name,
      bio,
    }).returning()

    // Log activity and checklist
    await logActivity(user.id, "CREATED", `Created portfolio: ${name}`);
    await completeChecklistTask(user.id, "CREATE_PORTFOLIO");
    // Also mark PUBLISH_PORTFOLIO as done when created? No, that's probably separate.
    // The checklist says "PUBLISH YOUR PORTFOLIO". Usually that implies a separate action.
    // But for now, let's just do CREATE_PORTFOLIO.

    // initialize defaults for settings to keep editor happy
    await db.insert(lockScreenSettings).values({ portfolioId: portfolio.id })
    await db.insert(desktopSettings).values({ portfolioId: portfolio.id })
    await db.insert(themeSettings).values({
      portfolioId: portfolio.id,
      theme: {
        name: 'Default',
        colors: {
          primary: '#8B5CF6',
          secondary: '#EC4899',
          accent: '#FBBF24',
          background: '#1F2937',
          text: '#F9FAFB',
        },
        font: 'Press Start 2P',
        taskbarStyleId: "liquid-glass",
        menubarStyleId: "liquid-glass",
      },
    })

    // Initialize sound effects with default preset
    await db.insert(soundEffects).values({
      portfolioId: portfolio.id,
      presetId: 'arcade',
    } as any)

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Portfolio create error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}
