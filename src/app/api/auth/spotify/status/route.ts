import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
      columns: {
        spotifyConnected: true,
        spotifyTokenExpiry: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const tokenExpired = user.spotifyTokenExpiry
      ? new Date() >= user.spotifyTokenExpiry
      : false

    return NextResponse.json({ connected: user.spotifyConnected, tokenExpired })
  } catch (error) {
    console.error('Spotify status error:', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}

