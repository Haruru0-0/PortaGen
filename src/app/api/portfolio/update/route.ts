// app/api/portfolio/info/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { portfolios } from '@/lib/db/schema'
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
        const { portfolioId, portfolioName, bio } = body

        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
        }

        // Verify ownership
        const existing = await db.query.portfolios.findFirst({
            where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
        })

        if (!existing) {
            return NextResponse.json({ error: 'Portfolio not found or access denied' }, { status: 404 })
        }

        const [updated] = await db
            .update(portfolios)
            .set({
                portfolioName: portfolioName ?? existing.portfolioName,
                bio: bio ?? existing.bio,
                updatedAt: new Date(),
            })
            .where(eq(portfolios.id, portfolioId))
            .returning({
                id: portfolios.id,
                portfolioName: portfolios.portfolioName,
                bio: portfolios.bio,
            })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Portfolio info UPDATE error:', error)
        return NextResponse.json({ error: 'Failed to update portfolio info' }, { status: 500 })
    }
}
