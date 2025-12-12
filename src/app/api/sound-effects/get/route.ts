import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { soundEffects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)
        const portfolioIdParam = searchParams.get('portfolioId')

        if (!portfolioIdParam) {
            return new NextResponse('portfolioId is required', { status: 400 })
        }

        const portfolioId = Number(portfolioIdParam)

        // Verify ownership by checking if user has access to this portfolio
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.clerkUserId, userId),
            with: {
                portfolios: true
            }
        })

        if (!user || !user.portfolios.some(p => p.id === portfolioId)) {
            return new NextResponse('Unauthorized access to portfolio', { status: 403 })
        }

        // Fetch sound effects for the portfolio
        const soundEffect = await db.query.soundEffects.findFirst({
            where: eq(soundEffects.portfolioId, portfolioId)
        })

        return NextResponse.json(soundEffect || {
            presetId: 'arcade'
        })
    } catch (error) {
        console.error('Error fetching sound effects:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}