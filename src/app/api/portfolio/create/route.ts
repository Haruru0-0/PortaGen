// app/api/portfolio/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios, lockScreenSettings, desktopSettings, themeSettings, soundEffects } from '@/lib/db/schema'
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

    const [created] = await db.insert(portfolios).values({
      userId: user.id,
      portfolioName: name,
      bio,
    }).returning()

    // initialize defaults for settings to keep editor happy
    await db.insert(lockScreenSettings).values({ portfolioId: created.id })
    await db.insert(desktopSettings).values({ portfolioId: created.id })
    await db.insert(themeSettings).values({
      portfolioId: created.id,
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
      portfolioId: created.id,
      presetId: 'arcade',
    } as any)

    return NextResponse.json(created)
  } catch (error) {
    console.error('Portfolio create error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}

