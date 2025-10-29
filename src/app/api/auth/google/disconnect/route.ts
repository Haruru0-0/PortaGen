import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Clear Google Drive tokens
        await db
            .update(users)
            .set({
                googleAccessToken: null,
                googleRefreshToken: null,
                googleTokenExpiry: null,
                googleDriveConnected: false,
                updatedAt: new Date(),
            })
            .where(eq(users.clerkUserId, userId))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Google Drive disconnect error:', error)
        return NextResponse.json({ error: 'Failed to disconnect' }, { status: 500 })
    }
}