import { db } from './index'
import { users } from './schema'
import { eq } from 'drizzle-orm'

export async function getOrCreateUser(supabaseUserId: string, email: string, username?: string) {
    // Try to find existing user
    let user = await db.query.users.findFirst({
        where: eq(users.supabaseUserId, supabaseUserId),
    })

    // If user doesn't exist, create them
    if (!user) {
        const [newUser] = await db
            .insert(users)
            .values({
                supabaseUserId,
                email,
                username: username || `user_${supabaseUserId.slice(0, 8)}`,
            })
            .returning()

        user = newUser
    }

    return user
}

export async function getUserBySupabaseId(supabaseUserId: string) {
    return await db.query.users.findFirst({
        where: eq(users.supabaseUserId, supabaseUserId),
    })
}

export async function getUserWithPortfolio(supabaseUserId: string) {
    return await db.query.users.findFirst({
        where: eq(users.supabaseUserId, supabaseUserId),
        with: {
            portfolios: {
                with: {
                    lockScreenSettings: true,
                    desktopSettings: true,
                    icons: true,
                    windowContents: true,
                    themeSettings: true,
                    soundEffects: true,
                },
            },
        },
    })
}