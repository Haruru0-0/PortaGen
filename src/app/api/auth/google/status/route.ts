import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        const userId = supabaseUser?.id

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await db.query.users.findFirst({
            where: eq(users.supabaseUserId, userId),
            columns: {
                googleDriveConnected: true,
                googleTokenExpiry: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const isExpired = user.googleTokenExpiry
            ? new Date() >= user.googleTokenExpiry
            : false

        return NextResponse.json({
            connected: user.googleDriveConnected,
            tokenExpired: isExpired,
        })
    } catch (error) {
        console.error('Status check error:', error)
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
    }
}