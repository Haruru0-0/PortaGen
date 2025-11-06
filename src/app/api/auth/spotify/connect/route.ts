import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSpotifyAuthUrl } from '@/lib/services/spotify'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/spotify/callback`
    const state = encodeURIComponent(userId)
    const authUrl = getSpotifyAuthUrl(redirectUri, state)
    return NextResponse.json({ authUrl })
  } catch (error) {
    console.error('Spotify OAuth connect error:', error)
    return NextResponse.json({ error: 'Failed to generate auth URL' }, { status: 500 })
  }
}

