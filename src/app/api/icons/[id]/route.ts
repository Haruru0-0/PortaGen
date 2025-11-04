import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { icons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserByClerkId(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { id } = params

        if (!id) {
            return NextResponse.json({ error: 'Icon ID required' }, { status: 400 })
        }

        const icon = await db.query.icons.findFirst({
            where: eq(icons.id, parseInt(id)),
            with: {
                asset: true, // Include the associated asset
                portfolio: {
                    columns: {
                        id: true,
                        userId: true, // Verify ownership
                    }
                }
            },
        })

        // Verify the icon belongs to the user's portfolio
        if (!icon || icon.portfolio.userId !== user.id) {
            return NextResponse.json({ error: 'Icon not found' }, { status: 404 })
        }

        return NextResponse.json(icon)
    } catch (error) {
        console.error('Icon fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch icon' }, { status: 500 })
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserByClerkId(userId)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { id } = params
        const data = await req.json()

        // Verify the icon belongs to the user
        const existingIcon = await db.query.icons.findFirst({
            where: eq(icons.id, parseInt(id)),
            with: {
                portfolio: {
                    columns: {
                        userId: true,
                    }
                }
            },
        })

        if (!existingIcon || existingIcon.portfolio.userId !== user.id) {
            return NextResponse.json({ error: 'Icon not found' }, { status: 404 })
        }

        const [updated] = await db
            .update(icons)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(icons.id, parseInt(id)))
            .returning()

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Icon update error:', error)
        return NextResponse.json({ error: 'Failed to update icon' }, { status: 500 })
    }
}