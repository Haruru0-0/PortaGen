import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { themeSettings, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (!supabaseUser) return new NextResponse('Unauthorized', { status: 401 })

        const body = await req.json()
        const { portfolioId, theme } = body

        if (!portfolioId || !theme) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        // Verify ownership
        const user = await db.query.users.findFirst({
            where: eq(users.supabaseUserId, supabaseUser.id),
            with: {
                portfolios: true
            }
        })

        const portfolio = user?.portfolios.find(p => p.id === portfolioId)
        if (!portfolio) {
            return new NextResponse('Unauthorized access to portfolio', { status: 403 })
        }

        // Upsert theme settings
        // Check if exists
        const existing = await db.query.themeSettings.findFirst({
            where: eq(themeSettings.portfolioId, portfolioId)
        })

        if (existing) {
            await db.update(themeSettings)
                .set({ theme, updatedAt: new Date() })
                .where(eq(themeSettings.id, existing.id))
        } else {
            await db.insert(themeSettings).values({
                portfolioId,
                theme
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating theme settings:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}