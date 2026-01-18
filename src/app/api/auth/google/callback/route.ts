import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getOAuth2Client, encryptToken } from '@/lib/services/google-drive'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        const userId = supabaseUser?.id

        if (!userId) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login`)
        }

        const searchParams = req.nextUrl.searchParams
        const code = searchParams.get('code')
        const error = searchParams.get('error')

        if (error) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=google_auth_failed`
            )
        }

        if (!code) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=no_code`
            )
        }

        // Exchange code for tokens
        const oauth2Client = getOAuth2Client()
        const { tokens } = await oauth2Client.getToken(code)

        if (!tokens.access_token || !tokens.refresh_token) {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=no_tokens`
            )
        }

        // Encrypt tokens before storing
        const encryptedAccessToken = encryptToken(tokens.access_token)
        const encryptedRefreshToken = encryptToken(tokens.refresh_token)

        // Update user in database
        await db
            .update(users)
            .set({
                googleAccessToken: encryptedAccessToken,
                googleRefreshToken: encryptedRefreshToken,
                googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
                googleDriveConnected: true,
                updatedAt: new Date(),
            })
            .where(eq(users.supabaseUserId, userId))

        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=google_connected`
        )
    } catch (error) {
        console.error('Google OAuth callback error:', error)
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=auth_failed`
        )
    }
}