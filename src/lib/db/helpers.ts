import { db } from './index'
import { users } from './schema'
import { eq } from 'drizzle-orm'

export async function getOrCreateUser(clerkUserId: string, email: string, username?: string) {
    // Try to find existing user
    let user = await db.query.users.findFirst({
        where: eq(users.clerkUserId, clerkUserId),
    })

    // If user doesn't exist, create them
    if (!user) {
        const [newUser] = await db
            .insert(users)
            .values({
                clerkUserId,
                email,
                username: username || `user_${clerkUserId.slice(0, 8)}`,
            })
            .returning()

        user = newUser
    }

    return user
}

export async function getUserByClerkId(clerkUserId: string) {
    return await db.query.users.findFirst({
        where: eq(users.clerkUserId, clerkUserId),
    })
}

export async function getUserWithPortfolio(clerkUserId: string) {
    return await db.query.users.findFirst({
        where: eq(users.clerkUserId, clerkUserId),
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