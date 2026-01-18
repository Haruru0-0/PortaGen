import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { soundEffects, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (!supabaseUser) return new NextResponse('Unauthorized', { status: 401 })

        const body = await req.json()
        const { portfolioId, presetId } = body

        if (!portfolioId || !presetId) {
            return new NextResponse('portfolioId and presetId are required', { status: 400 })
        }

        // Verify ownership
        const user = await db.query.users.findFirst({
            where: eq(users.supabaseUserId, supabaseUser.id),
            with: {
                portfolios: true
            }
        })

        if (!user || !user.portfolios.some(p => p.id === portfolioId)) {
            return new NextResponse('Unauthorized access to portfolio', { status: 403 })
        }

        // Upsert sound effects
        const existing = await db.query.soundEffects.findFirst({
            where: eq(soundEffects.portfolioId, portfolioId)
        })

        const soundEffectData = {
            presetId,
            updatedAt: new Date()
        }

        if (existing) {
            await db.update(soundEffects)
                .set(soundEffectData)
                .where(eq(soundEffects.id, existing.id))
        } else {
            await db.insert(soundEffects).values({
                portfolioId,
                ...soundEffectData
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating sound effects:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}