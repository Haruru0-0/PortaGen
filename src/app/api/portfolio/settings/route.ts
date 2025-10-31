// app/api/portfolio/settings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { lockScreenSettings, desktopSettings, themeSettings } from '@/lib/db/schema'
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

        const { type, portfolioId, data } = await req.json()

        switch (type) {
            case 'lockScreen':
                await db
                    .update(lockScreenSettings)
                    .set({ ...data, updatedAt: new Date() })
                    .where(eq(lockScreenSettings.portfolioId, portfolioId))
                break

            case 'desktop':
                await db
                    .update(desktopSettings)
                    .set({ ...data, updatedAt: new Date() })
                    .where(eq(desktopSettings.portfolioId, portfolioId))
                break

            case 'theme':
                await db
                    .update(themeSettings)
                    .set({ theme: data, updatedAt: new Date() })
                    .where(eq(themeSettings.portfolioId, portfolioId))
                break

            default:
                return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Settings update error:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}