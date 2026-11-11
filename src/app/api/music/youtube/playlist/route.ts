import { NextRequest, NextResponse } from 'next/server';
import { getYouTubePlaylist, musicRequestAllowed, YouTubeMusicError } from '@/lib/services/youtube-music';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function GET(request: NextRequest) {
  if (!musicRequestAllowed(request, 'playlist')) return NextResponse.json({ error: 'Too many playlist requests. Try again in a minute.' }, { status: 429 });
  try {
    const playlist = await getYouTubePlaylist(request.nextUrl.searchParams.get('url') || '');
    return NextResponse.json(playlist, { headers: { 'Cache-Control': 'public, max-age=60' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof YouTubeMusicError ? error.message : 'YouTube Music is temporarily unavailable.' },
      { status: error instanceof YouTubeMusicError ? error.status : 503 });
  }
}
