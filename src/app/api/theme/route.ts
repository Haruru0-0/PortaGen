import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios, themeSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const { searchParams } = new URL(req.url)
        const portfolioIdParam = searchParams.get('portfolioId')

        // Fetch user with portfolios
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.clerkUserId, userId),
            with: {
                portfolios: {
                    with: {
                        themeSettings: true
                    }
                }
            }
        })

        if (!user || user.portfolios.length === 0) {
            return new NextResponse('Portfolio not found', { status: 404 })
        }

        let p
        if (portfolioIdParam) {
            const pid = Number(portfolioIdParam)
            p = user.portfolios.find(pt => pt.id === pid)
            if (!p) {
                return new NextResponse('Portfolio not found or access denied', { status: 404 })
            }
        } else {
            // Default to first
            p = user.portfolios[0]
        }

        return NextResponse.json(p.themeSettings || null)
    } catch (error) {
        console.error('Error fetching theme settings:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth()
        if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const body = await req.json()
        const { portfolioId, theme } = body

        if (!portfolioId || !theme) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        // Verify ownership
        const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.clerkUserId, userId),
            with: {
                portfolios: true
            }
        })

        const portfolio = user?.portfolios.find(p => p.id === portfolioId)
        if (!portfolio) {
            return new NextResponse('Unauthorized access to portfolio', { status: 403 })
        }

        // Upsert theme settings
        // Check if exists
        const existing = await db.query.themeSettings.findFirst({
            where: eq(themeSettings.portfolioId, portfolioId)
        })

        if (existing) {
            await db.update(themeSettings)
                .set({ theme, updatedAt: new Date() })
                .where(eq(themeSettings.id, existing.id))
        } else {
            await db.insert(themeSettings).values({
                portfolioId,
                theme
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating theme settings:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
