import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { lockScreenSettings, portfolios } from '@/lib/db/schema'
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

        const portfolio = await db.query.portfolios.findFirst({
            where: and(eq(portfolios.id, portfolioId)),
        })
        if (!portfolio) return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })

        const row = await db.query.lockScreenSettings.findFirst({
            where: eq(lockScreenSettings.portfolioId, portfolioId),
            with: { wallpaperAsset: true },
        })
        if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json({
            portfolioId: row.portfolioId,
            enabled: row.enabled,
            password: row.password,
            wallpaperAsset: row.wallpaperAsset ?? undefined,
        })
    } catch (e) {
        console.error('Lock screen fetch error:', e)
        return NextResponse.json({ error: 'Failed to fetch lock screen settings' }, { status: 500 })
    }
}

