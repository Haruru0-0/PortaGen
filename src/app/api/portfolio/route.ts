import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios, lockScreenSettings, desktopSettings, themeSettings } from '@/lib/db/schema'
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

        const portfolio = await db.query.portfolios.findFirst({
            where: eq(portfolios.userId, user.id),
            with: {
                lockScreenSettings: true,
                desktopSettings: true,
                icons: { orderBy: (icons, { asc }) => [asc(icons.position)] },
                musicTracks: { orderBy: (musicTracks, { asc }) => [asc(musicTracks.position)] },
                windowContents: { orderBy: (windowContents, { asc }) => [asc(windowContents.position)] },
                themeSettings: true,
                soundEffects: true,
            },
        })

        if (!portfolio) {
            // Create default portfolio
            const [newPortfolio] = await db.insert(portfolios).values({
                userId: user.id,
                portfolioName: 'MY PORTFOLIO',
                username: user.username || `user_${userId.slice(0, 8)}`,
                slug: user.username?.toLowerCase() || `user_${userId.slice(0, 8)}`,
            }).returning()

            // Create default settings
            await db.insert(lockScreenSettings).values({ portfolioId: newPortfolio.id })
            await db.insert(desktopSettings).values({ portfolioId: newPortfolio.id })
            await db.insert(themeSettings).values({
                portfolioId: newPortfolio.id,
                theme: {
                    name: 'Default',
                    colors: {
                        primary: '#8B5CF6',
                        secondary: '#EC4899',
                        accent: '#FBBF24',
                        background: '#1F2937',
                        text: '#F9FAFB',
                    },
                    fonts: {
                        primary: 'Press Start 2P',
                        secondary: 'Courier New',
                    },
                },
            })

            return NextResponse.json(newPortfolio)
        }

        return NextResponse.json(portfolio)
    } catch (error) {
        console.error('Portfolio fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserByClerkId(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const data = await req.json()

        const existing = await db.query.portfolios.findFirst({
            where: eq(portfolios.userId, user.id),
        })

        if (existing) {
            const [updated] = await db
                .update(portfolios)
                .set({
                    portfolioName: data.portfolioName,
                    username: data.username,
                    slug: data.slug || data.username?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    bio: data.bio,
                    isPublic: data.isPublic,
                    isPublished: data.isPublished,
                    updatedAt: new Date(),
                })
                .where(eq(portfolios.id, existing.id))
                .returning()

            return NextResponse.json(updated)
        } else {
            const [created] = await db
                .insert(portfolios)
                .values({
                    userId: user.id,
                    portfolioName: data.portfolioName || 'MY PORTFOLIO',
                    username: data.username || user.username || `user_${userId.slice(0, 8)}`,
                    slug: data.slug || user.username?.toLowerCase() || `user_${userId.slice(0, 8)}`,
                    bio: data.bio,
                })
                .returning()

            return NextResponse.json(created)
        }
    } catch (error) {
        console.error('Portfolio save error:', error)
        return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 })
    }
}
