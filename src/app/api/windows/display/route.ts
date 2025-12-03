import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { portfolios, windows } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const username = searchParams.get('username')
        const portfolioIdParam = searchParams.get('portfolioId')

        if (!username || !portfolioIdParam) {
            return NextResponse.json({ error: 'Username and portfolioId required' }, { status: 400 })
        }
        const portfolioId = Number(portfolioIdParam)

        // Verify portfolio exists for this username
        const portfolio = await db.query.portfolios.findFirst({
            where: and(eq(portfolios.id, portfolioId)),
        })
        if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

        const rows = await db.query.windows.findMany({ where: eq(windows.portfolioId, portfolioId), orderBy: (t, { asc }) => [asc(t.position)] })
        const a = rows.map(r => ({ ...r, data: r.content }))
        return NextResponse.json({ windows: a })
    } catch (error) {
        console.error('Windows LIST error:', error)
        return NextResponse.json({ error: 'Failed to list windows' }, { status: 500 })
    }
}

