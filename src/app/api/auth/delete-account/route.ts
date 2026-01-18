import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()

        if (!supabaseUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Identify user in our database
        const user = await db.query.users.findFirst({
            where: eq(users.supabaseUserId, supabaseUser.id),
        })

        if (user) {
            // Here you would typically delete all related data too
            // For now, let's just delete the user record
            await db.delete(users).where(eq(users.id, user.id))
        }

        // Use Supabase Admin API to delete the user if you have a service role key,
        // otherwise the user record is deleted in our DB and they'll be signed out on client.
        // Since we don't want to expose service role keys on client, this is a "soft" delete
        // of our internal record until an admin clean up or if we use service role here.

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Account delete error:', error)
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }
}
