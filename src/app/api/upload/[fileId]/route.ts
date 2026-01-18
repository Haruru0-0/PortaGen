/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/upload/[fileId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { deleteFromUserDrive, decryptToken } from '@/lib/services/google-drive'
import { db } from '@/lib/db'
import { users, uploadedAssets } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ fileId: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()

        if (!supabaseUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { fileId } = await params

        // Get user
        const user = await db.query.users.findFirst({
            where: eq(users.supabaseUserId, supabaseUser.id),
        })

        if (!user || !user.googleAccessToken || !user.googleRefreshToken) {
            return NextResponse.json(
                { error: 'Google Drive not connected' },
                { status: 400 }
            )
        }

        // Find asset in database
        const asset = await db.query.uploadedAssets.findFirst({
            where: and(
                eq(uploadedAssets.fileId, fileId),
                eq(uploadedAssets.userId, user.id)
            ),
        })

        if (!asset) {
            return NextResponse.json({ error: 'Asset not found' }, { status: 404 })
        }

        // Decrypt tokens
        const accessToken = decryptToken(user.googleAccessToken)
        const refreshToken = decryptToken(user.googleRefreshToken)

        // Delete from Google Drive
        await deleteFromUserDrive(accessToken, refreshToken, fileId)

        // Delete from database
        await db
            .delete(uploadedAssets)
            .where(eq(uploadedAssets.id, asset.id))

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Delete error:', error)

        if (error.message === 'REFRESH_TOKEN_NEEDED') {
            return NextResponse.json(
                { error: 'Please reconnect your Google Drive' },
                { status: 401 }
            )
        }

        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}