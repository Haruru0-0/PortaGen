import { db } from '@/lib/db'
import { portfolios, themeSettings } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const username = searchParams.get('username')
        const portfolioIdParam = searchParams.get('portfolioId')

        if (!username || !portfolioIdParam) {
            return NextResponse.json({ error: 'Username and portfolioId required' }, { status: 400 })
        }
        const portfolioId = Number(portfolioIdParam)

        const portfolio = await db.query.portfolios.findFirst({
            where: and(eq(portfolios.id, portfolioId)),
        })
        if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

        const row = await db.query.themeSettings.findFirst({
            where: eq(themeSettings.portfolioId, portfolioId),
        })
        if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json(row || null)
    } catch (error) {
        console.error('Error fetching display theme:', error)
        return NextResponse.json({ error: 'Failed to fetch theme settings' }, { status: 500 })
    }
}
