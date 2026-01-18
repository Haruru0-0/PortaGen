// app/api/portfolio/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { portfolios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'

export async function GET(req: NextRequest) {
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

        const userPortfolios = await db.query.portfolios.findMany({
            where: eq(portfolios.userId, user.id),
            columns: {
                id: true,
                portfolioName: true,
                bio: true,
                createdAt: true,
            },
        })

        return NextResponse.json({ portfolios: userPortfolios })
    } catch (error) {
        console.error('Portfolios list error:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
    }
}