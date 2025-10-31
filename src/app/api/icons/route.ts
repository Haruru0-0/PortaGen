// app/api/icons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { icons } from '@/lib/db/schema'
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

        const { portfolioId, icons: iconData } = await req.json()

        // Delete existing icons
        await db.delete(icons).where(eq(icons.portfolioId, portfolioId))

        // Insert new icons
        if (iconData && iconData.length > 0) {
            await db.insert(icons).values(
                iconData.map((icon: any, index: number) => ({
                    portfolioId,
                    name: icon.name,
                    iconUrl: icon.icon,
                    iconFileId: icon.iconFileId,
                    linkUrl: icon.url,
                    position: index,
                }))
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Icons update error:', error)
        return NextResponse.json({ error: 'Failed to update icons' }, { status: 500 })
    }
}