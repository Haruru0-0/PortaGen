import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { getOAuth2Client } from '@/lib/services/google-drive'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        const userId = supabaseUser?.id

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const oauth2Client = getOAuth2Client()

        // Generate auth URL with appropriate scopes
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
            ],
            prompt: 'consent', // Force consent screen to get refresh token
        })

        return NextResponse.json({ authUrl })
    } catch (error) {
        console.error('Google OAuth connect error:', error)
        return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 })
    }
}