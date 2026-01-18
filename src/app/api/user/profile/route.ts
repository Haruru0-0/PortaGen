import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { getUserBySupabaseId } from '@/lib/db/helpers'

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const user = await getUserBySupabaseId(supabaseUser.id) as any
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        return NextResponse.json({
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl,
        })
    } catch (error) {
        console.error('Error fetching user profile:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { username, avatarUrl } = await req.json()
        if (!username && !avatarUrl) return NextResponse.json({ error: 'Update data required' }, { status: 400 })

        const user = await getUserBySupabaseId(supabaseUser.id)
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        await db.update(users)
            .set({
                ...(username && { username }),
                ...(avatarUrl && { avatarUrl }),
                updatedAt: new Date()
            })
            .where(eq(users.id, user.id))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating user profile:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
