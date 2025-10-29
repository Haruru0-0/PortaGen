import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { musicTracks } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function PUT(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserByClerkId(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { portfolioId, musicTracks: trackData } = await req.json()

        // Delete existing tracks
        await db.delete(musicTracks).where(eq(musicTracks.portfolioId, portfolioId))

        // Insert new tracks
        if (trackData && trackData.length > 0) {
            await db.insert(musicTracks).values(
                trackData.map((track: any, index: number) => ({
                    portfolioId,
                    name: track.name,
                    audioUrl: track.url,
                    audioFileId: track.fileId,
                    type: track.type,
                    position: index,
                }))
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Music update error:', error)
        return NextResponse.json({ error: 'Failed to update music' }, { status: 500 })
    }
}