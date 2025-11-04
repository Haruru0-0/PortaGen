// app/api/windows/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { windowContents } from '@/lib/db/schema'
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
        const { portfolioId, windows } = data

        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
        }

        // This is a simplified implementation. A more robust implementation would
        // handle creating, updating, and deleting individual window contents.
        await db.delete(windowContents).where(eq(windowContents.portfolioId, portfolioId))
        if (windows && windows.length > 0) {
            await db.insert(windowContents).values(windows)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Window contents update error:', error)
        return NextResponse.json({ error: 'Failed to update window contents' }, { status: 500 })
    }
}
