import { NextRequest, NextResponse } from 'next/server';
import { getYouTubeAudioSource, musicRequestAllowed, YouTubeMusicError } from '@/lib/services/youtube-music';
import { normalizeMusicRange, sliceAudioStream } from '@/lib/music/audio-range';
export const runtime = 'nodejs';
export const maxDuration = 300;
export async function GET(request: NextRequest, { params }: { params: Promise<{ videoId: string }> }) {
  if (!musicRequestAllowed(request, 'audio')) return NextResponse.json({ error: 'Too many playback requests. Try again shortly.' }, { status: 429 });
  const requestedRange = request.headers.get('range');
  if (!normalizeMusicRange(requestedRange)) return new Response(null, { status: 416 });
  try {
    const { videoId } = await params;
    const headers = new Headers();
    let source = await getYouTubeAudioSource(videoId);
    let range = normalizeMusicRange(requestedRange, source.length);
    if (!range) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${source.length}` } });
    headers.set('Range', `bytes=0-${source.length - 1}`);
    let response = await fetch(source.url, { headers, signal: request.signal, redirect: 'error' });
    if (response.status === 403 || response.status === 410) {
      await response.body?.cancel();
      source = await getYouTubeAudioSource(videoId, true);
      range = normalizeMusicRange(requestedRange, source.length);
      if (!range) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${source.length}` } });
      headers.set('Range', `bytes=0-${source.length - 1}`);
      response = await fetch(source.url, { headers, signal: request.signal, redirect: 'error' });
    }
    if (!response.ok || !response.headers.get('content-type')?.startsWith('audio/')) {
      console.warn('YouTube audio response rejected', JSON.stringify({ videoId, status: response.status, type: response.headers.get('content-type'), range }));
      await response.body?.cancel();
      return NextResponse.json({ error: 'This track cannot be played right now.' }, { status: response.status === 416 ? 416 : 502 });
    }
    const outgoing = new Headers({ 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' });
    const [start, end] = range.slice(6).split('-').map(Number);
    outgoing.set('Content-Type', response.headers.get('content-type')!);
    outgoing.set('Content-Length', String(end - start + 1));
    outgoing.set('Accept-Ranges', 'bytes');
    if (requestedRange) outgoing.set('Content-Range', `bytes ${start}-${end}/${source.length}`);
    if (!response.body) return new Response(null, { status: 502 });
    return new Response(sliceAudioStream(response.body, start, end), { status: requestedRange ? 206 : 200, headers: outgoing });
  } catch (error) {
    return NextResponse.json({ error: error instanceof YouTubeMusicError ? error.message : 'Audio playback is temporarily unavailable.' },
      { status: error instanceof YouTubeMusicError ? error.status : 503 });
  }
}
