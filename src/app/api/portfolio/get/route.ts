// app/api/portfolio/info/get/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserByClerkId(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { searchParams } = new URL(req.url)
        const portfolioId = Number(searchParams.get('portfolioId'))
        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
        }

        const portfolio = await db.query.portfolios.findFirst({
            where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
            columns: {
                id: true,
                portfolioName: true,
                bio: true,
            },
        })

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
        }

        return NextResponse.json(portfolio)
    } catch (error) {
        console.error('Portfolio info GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolio info' }, { status: 500 })
    }
}
