import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios, themeSettings } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function GET(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        const user = await getUserByClerkId(userId)
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const { searchParams } = new URL(req.url)
        const portfolioIdParam = searchParams.get('portfolioId')
        if (!portfolioIdParam) {
            return NextResponse.json({ error: 'portfolioId required' }, { status: 400 })
        }
        const portfolioId = Number(portfolioIdParam)

        // Verify portfolio ownership
        const owned = await db.query.portfolios.findFirst({
            where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
        })
        if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const row = await db.query.themeSettings.findFirst({
            where: eq(themeSettings.portfolioId, portfolioId),
        })
        if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json(row || null)
    } catch (error) {
        console.error('Error fetching theme settings:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}