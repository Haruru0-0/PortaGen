 // app/api/portfolio/create/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { portfolios, lockScreenSettings, desktopSettings, themeSettings, soundEffects } from '@/lib/db/schema'
import { logActivity, completeChecklistTask } from '@/lib/activity'
import { getUserBySupabaseId } from '@/lib/db/helpers'
import { DEFAULT_THEME } from '@/lib/constants/theme-templates'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserBySupabaseId(supabaseUser.id)
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

    // initialize defaults for settings to keep editor happy
    await db.insert(lockScreenSettings).values({ portfolioId: portfolio.id })
    await db.insert(desktopSettings).values({ portfolioId: portfolio.id })
    await db.insert(themeSettings).values({
      portfolioId: portfolio.id,
      theme: DEFAULT_THEME,
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
