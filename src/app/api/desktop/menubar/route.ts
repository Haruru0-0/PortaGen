import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { desktopSettings, portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (!supabaseUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserBySupabaseId(supabaseUser.id)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const body = await req.json()
        const { portfolioId, menubarIconAssetId, menubarText } = body

        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
        }

        const existingPortfolio = await db.query.portfolios.findFirst({
            where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
        })

        if (!existingPortfolio) {
            return NextResponse.json({ error: 'Portfolio not found or access denied' }, { status: 404 })
        }

        // Upsert desktop settings
        await db
            .insert(desktopSettings)
            .values({
                portfolioId,
                menubarIconAssetId: menubarIconAssetId,
                menubarText: menubarText,
            })
            .onConflictDoUpdate({
                target: desktopSettings.portfolioId,
                set: {
                    menubarIconAssetId: menubarIconAssetId === undefined ? undefined : menubarIconAssetId,
                    menubarText: menubarText === undefined ? undefined : menubarText,
                    updatedAt: new Date(),
                },
            })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Desktop menubar update error:', error)
        return NextResponse.json({ error: 'Failed to update menubar settings' }, { status: 500 })
    }
}
