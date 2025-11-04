// app/api/music/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { musicTracks } from '@/lib/db/schema'
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
        const { portfolioId, ...musicData } = data

        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
        }

        const [created] = await db
            .insert(musicTracks)
            .values({
                portfolioId,
                ...musicData,
            })
            .returning()

        return NextResponse.json(created)
    } catch (error) {
        console.error('Music create error:', error)
        return NextResponse.json({ error: 'Failed to create music track' }, { status: 500 })
    }
}

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

        const data = await req.json()
        const { id, ...musicData } = data

        if (!id) {
            return NextResponse.json({ error: 'Music ID required' }, { status: 400 })
        }

        const [updated] = await db
            .update(musicTracks)
            .set({
                ...musicData,
                updatedAt: new Date(),
            })
            .where(eq(musicTracks.id, id))
            .returning()

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Music update error:', error)
        return NextResponse.json({ error: 'Failed to update music track' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserByClerkId(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'Music ID required' }, { status: 400 })
        }

        await db.delete(musicTracks).where(eq(musicTracks.id, parseInt(id)))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Music delete error:', error)
        return NextResponse.json({ error: 'Failed to delete music track' }, { status: 500 })
    }
}
