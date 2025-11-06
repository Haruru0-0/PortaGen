
import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

export function encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
}

export function decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
}

// Get Spotify OAuth URL
export function getSpotifyAuthUrl(redirectUri: string, state: string) {
    const scopes = [
        'user-read-email',
        'user-read-private',
        'playlist-read-private',
        'user-library-read',
        // Required for Web Playback SDK and controlling playback
        'streaming',
        'user-modify-playback-state',
        'user-read-playback-state',
    ]

    const params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: scopes.join(' '),
        state,
        show_dialog: 'true',
    })

    return `https://accounts.spotify.com/authorize?${params.toString()}`
}

// Exchange code for tokens
export async function getSpotifyTokens(code: string, redirectUri: string) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirectUri,
        }),
    })

    if (!response.ok) {
        throw new Error('Failed to get Spotify tokens')
    }

    return await response.json()
}

// Refresh Spotify token
export async function refreshSpotifyToken(refreshToken: string) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`,
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    })

    if (!response.ok) {
        throw new Error('Failed to refresh Spotify token')
    }

    return await response.json()
}

// Search for track on Spotify
export async function searchSpotifyTrack(
    accessToken: string,
    query: string
) {
    const params = new URLSearchParams({
        q: query,
        type: 'track',
        limit: '5',
    })

    const response = await fetch(
        `https://api.spotify.com/v1/search?${params.toString()}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Failed to search Spotify')
    }

    const data = await response.json()
    return data.tracks.items
}

// Get track details
export async function getSpotifyTrack(
    accessToken: string,
    trackId: string
) {
    const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Failed to get Spotify track')
    }

    return await response.json()
}
