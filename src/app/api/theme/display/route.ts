import { db } from '@/lib/db'
import { portfolios, themeSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const portfolioId = searchParams.get('portfolioId')
    const username = searchParams.get('username')

    if (!portfolioId && !username) {
        return new NextResponse('Missing portfolioId or username', { status: 400 })
    }

    try {
        let portfolio

        if (portfolioId) {
            portfolio = await db.query.portfolios.findFirst({
                where: eq(portfolios.id, parseInt(portfolioId)),
                with: {
                    themeSettings: true
                }
            })
        } else if (username) {
            portfolio = await db.query.portfolios.findFirst({
                where: eq(portfolios.username, username),
                with: {
                    themeSettings: true
                }
            })
        }

        if (!portfolio) {
            return new NextResponse('Portfolio not found', { status: 404 })
        }

        return NextResponse.json(portfolio.themeSettings || null)
    } catch (error) {
        console.error('Error fetching display theme:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
