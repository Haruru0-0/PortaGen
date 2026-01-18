// app/api/assets/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { uploadedAssets } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (!supabaseUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await getUserBySupabaseId(supabaseUser.id)
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { id } = await params
        const { name } = await req.json()

        if (!name || name.trim().length === 0) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        // Update the asset name
        const [updatedAsset] = await db
            .update(uploadedAssets)
            .set({
                fileName: name.trim(),
                uploadedAt: new Date()
            })
            .where(
                and(
                    eq(uploadedAssets.id, parseInt(id)),
                    eq(uploadedAssets.userId, user.id)
                )
            )
            .returning()

        if (!updatedAsset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, asset: updatedAsset })
    } catch (error) {
        console.error('Asset rename error:', error)
        return NextResponse.json({ error: 'Failed to rename asset' }, { status: 500 })
    }
}