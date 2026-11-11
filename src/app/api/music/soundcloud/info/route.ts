import { NextRequest, NextResponse } from 'next/server';
import { getSoundCloudInfo, SoundCloudError } from '@/lib/services/soundcloud';
import { musicRequestAllowed } from '@/lib/services/youtube-music';
export const runtime = 'nodejs';
export async function GET(request: NextRequest) {
  if (!musicRequestAllowed(request, 'playlist')) return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
  try {
    const info = await getSoundCloudInfo(request.nextUrl.searchParams.get('url') || '');
    return NextResponse.json(info, { headers: { 'Cache-Control': 'public, max-age=60' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof SoundCloudError ? error.message : 'SoundCloud is temporarily unavailable.' },
      { status: error instanceof SoundCloudError ? error.status : 503 });
  }
}
