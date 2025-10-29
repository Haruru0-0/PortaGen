import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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

        const userPortfolios = await db.query.portfolios.findMany({
            where: eq(portfolios.userId, user.id),
            columns: {
                id: true,
                portfolioName: true,
                slug: true,
                isPublished: true,
                createdAt: true,
            },
        })

        return NextResponse.json({ portfolios: userPortfolios })
    } catch (error) {
        console.error('Portfolios list error:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
    }
}