import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { and, eq } from 'drizzle-orm';
import { createClient } from '@/utils/supabase/server';
import { db } from '@/lib/db';
import { desktopSettings, portfolios } from '@/lib/db/schema';
import { getUserBySupabaseId } from '@/lib/db/helpers';
import { completeChecklistTask } from '@/lib/activity';
import { parseYouTubePlaylistUrl } from '@/lib/music/youtube-playlist';
import { getYouTubePlaylist, YouTubeMusicError } from '@/lib/services/youtube-music';
const input = z.object({ portfolioId: z.number().int().positive(), playlistUrl: z.string().max(2048) });
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: NextRequest) {
  try {
    const { data: { user: account } } = await (await createClient()).auth.getUser();
    if (!account) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await getUserBySupabaseId(account.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const parsed = input.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: 'A valid portfolio and playlist link are required.' }, { status: 400 });
    const { portfolioId, playlistUrl } = parsed.data;
    const owned = await db.query.portfolios.findFirst({ where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)) });
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    const link = playlistUrl.trim() ? parseYouTubePlaylistUrl(playlistUrl) : null;
    if (playlistUrl.trim() && !link) return NextResponse.json({ error: 'Enter a valid YouTube playlist link.' }, { status: 400 });
    if (link) await getYouTubePlaylist(link.url);
    // Reuse the legacy URL column; existing Spotify portfolios remain compatible.
    const [updated] = await db.insert(desktopSettings).values({ portfolioId, spotifyPlaylistUrl: link?.url ?? null })
      .onConflictDoUpdate({ target: desktopSettings.portfolioId, set: { spotifyPlaylistUrl: link?.url ?? null, updatedAt: new Date() } }).returning();
    if (link) {
      try { await completeChecklistTask(user.id, 'EMBED_MUSIC'); } catch { console.warn('Music saved; checklist update failed.'); }
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof YouTubeMusicError ? error.message : 'Could not save the music playlist.' },
      { status: error instanceof YouTubeMusicError ? error.status : 500 });
  }
}
