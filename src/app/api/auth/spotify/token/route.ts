import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { decryptToken, encryptToken, refreshSpotifyToken } from '@/lib/services/spotify'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
      columns: {
        spotifyAccessToken: true,
        spotifyRefreshToken: true,
        spotifyTokenExpiry: true,
      },
    })

    if (!user || !user.spotifyAccessToken || !user.spotifyRefreshToken) {
      return NextResponse.json({ error: 'Not connected' }, { status: 400 })
    }

    const now = new Date()
    let accessToken = decryptToken(user.spotifyAccessToken)
    const refreshToken = decryptToken(user.spotifyRefreshToken)

    if (!user.spotifyTokenExpiry || now >= user.spotifyTokenExpiry) {
      // Refresh
      const refreshed = await refreshSpotifyToken(refreshToken)
      if (!refreshed.access_token) {
        return NextResponse.json({ error: 'Failed to refresh' }, { status: 400 })
      }
      accessToken = refreshed.access_token

      await db
        .update(users)
        .set({
          spotifyAccessToken: encryptToken(accessToken),
          spotifyTokenExpiry: refreshed.expires_in
            ? new Date(Date.now() + refreshed.expires_in * 1000)
            : now,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkUserId, userId))
    }

    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error('Spotify token error:', error)
    return NextResponse.json({ error: 'Failed to obtain token' }, { status: 500 })
  }
}

