// app/api/icons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { icons } from '@/lib/db/schema'
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
        const { portfolioId, ...iconData } = data

        if (!portfolioId) {
            return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
        }

        const [created] = await db
            .insert(icons)
            .values({
                portfolioId,
                ...iconData,
            })
            .returning()

        return NextResponse.json(created)
    } catch (error) {
        console.error('Icon create error:', error)
        return NextResponse.json({ error: 'Failed to create icon' }, { status: 500 })
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
        const { id, ...iconData } = data

        if (!id) {
            return NextResponse.json({ error: 'Icon ID required' }, { status: 400 })
        }

        const [updated] = await db
            .update(icons)
            .set({
                ...iconData,
                updatedAt: new Date(),
            })
            .where(eq(icons.id, id))
            .returning()

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Icon update error:', error)
        return NextResponse.json({ error: 'Failed to update icon' }, { status: 500 })
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
            return NextResponse.json({ error: 'Icon ID required' }, { status: 400 })
        }

        await db.delete(icons).where(eq(icons.id, parseInt(id)))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Icon delete error:', error)
        return NextResponse.json({ error: 'Failed to delete icon' }, { status: 500 })
    }
}
