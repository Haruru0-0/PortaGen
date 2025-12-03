// app/api/icons/list/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { icons, portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

function format(row: any) {
    return {
        id: row.id,
        name: row.name,
        position: row.position,
        linkType: row.linkType || 'window',
        url: row.linkUrl || undefined,
        isVisible: row.isVisible,
        iconAssetId: row.iconAssetId || undefined,
        icon: row.asset?.displayUrl || '',
    }
}

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

        const rows = await db.query.icons.findMany({
            where: eq(icons.portfolioId, portfolioId),
            orderBy: (t, { asc }) => [asc(t.position)],
            with: { asset: true },
        })

        return NextResponse.json({ icons: rows.map(format) })
    } catch (error) {
        console.error('Icons list GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch icons' }, { status: 500 })
    }
}
