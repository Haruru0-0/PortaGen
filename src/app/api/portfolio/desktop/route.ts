// app/api/portfolio/desktop/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { desktopSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

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
        const { portfolioId, ...settings } = data

        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
        }

        const [updated] = await db
            .update(desktopSettings)
            .set({
                ...settings,
                updatedAt: new Date(),
            })
            .where(eq(desktopSettings.portfolioId, portfolioId))
            .returning()

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Desktop settings update error:', error)
        return NextResponse.json({ error: 'Failed to update desktop settings' }, { status: 500 })
    }
}
