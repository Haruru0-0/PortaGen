import { Innertube, Platform, YTNodes } from 'youtubei.js';
import { getQuickJS, shouldInterruptAfterDeadline } from 'quickjs-emscripten';
import { parseYouTubePlaylistUrl, type YouTubePlaylist, type YouTubePlaylistTrack } from '@/lib/music/youtube-playlist';

export class YouTubeMusicError extends Error {
  constructor(message: string, public status = 503) { super(message); }
}

// Never execute downloaded player code in Node's application context.
Platform.shim.eval = async data => {
  const quickJS = await getQuickJS();
  const runtime = quickJS.newRuntime();
  runtime.setMemoryLimit(32 * 1024 * 1024);
  runtime.setMaxStackSize(512 * 1024);
  runtime.setInterruptHandler(shouldInterruptAfterDeadline(Date.now() + 1500));
  const context = runtime.newContext();
  try {
    const result = context.evalCode(`(function(){${data.output}\n})()`);
    if (result.error) {
      result.error.dispose();
      throw new YouTubeMusicError('YouTube audio decoding is temporarily unavailable.');
    }
    const value = context.dump(result.value);
    result.value.dispose();
    return value;
  } finally { context.dispose(); runtime.dispose(); }
};

let session: Promise<Innertube> | undefined;
let sessionUntil = 0;
function getSession() {
  if (!session || Date.now() > sessionUntil) {
    sessionUntil = Date.now() + 60 * 60 * 1000;
    session = Innertube.create({ lang: 'en', location: 'US', retrieve_player: true,
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15_000) }),
    }).catch(error => { session = undefined; throw error; });
  }
  return session;
}

const playlists = new Map<string, { until: number; value: YouTubePlaylist }>();
const loadingPlaylists = new Map<string, Promise<YouTubePlaylist>>();
const audio = new Map<string, { until: number; value: { url: string; length: number } }>();
function trimCache(map: Map<string, unknown>, limit = 100) {
  while (map.size > limit) map.delete(map.keys().next().value!);
}
export async function getYouTubePlaylist(input: string): Promise<YouTubePlaylist> {
  const parsed = parseYouTubePlaylistUrl(input);
  if (!parsed) throw new YouTubeMusicError('Enter a valid YouTube Music or YouTube playlist link.', 400);
  const cached = playlists.get(parsed.id);
  if (cached && cached.until > Date.now()) return cached.value;
  const pending = loadingPlaylists.get(parsed.id);
  if (pending) return pending;
  const load = (async () => {
    try {
      const yt = await getSession();
      let page = await yt.getPlaylist(parsed.id);
      const title = page.info.title || 'YouTube Music playlist';
      const cover = page.info.thumbnails?.at(-1)?.url || '';
      const tracks: YouTubePlaylistTrack[] = [];
      let pages = 0;
      for (;;) {
        for (const item of page.items) {
          let videoId = '', name = '', artist = '', duration = '', thumbnail = '';
          if (item.is(YTNodes.PlaylistVideo)) {
            if (!item.is_playable || item.is_live || item.is_upcoming) continue;
            videoId = item.id; name = item.title.toString(); artist = item.author.name;
            duration = item.duration.text; thumbnail = item.thumbnails.at(-1)?.url || '';
          } else if (item.is(YTNodes.LockupView) && item.content_type === 'VIDEO') {
            videoId = item.content_id || ''; name = item.metadata?.title?.toString() || '';
            artist = item.metadata?.metadata?.metadata_rows[0]?.metadata_parts?.[0]?.text?.toString() || '';
            duration = item.duration.text;
          }
          if (!/^[A-Za-z0-9_-]{11}$/.test(videoId) || !name || tracks.length >= 500) continue;
          tracks.push({ id: tracks.length + 1, videoId, title: name, artist: artist || 'YouTube Music',
            duration: duration || '0:00', cover: thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
            src: `/api/music/youtube/audio/${videoId}` });
        }
        if (!page.has_continuation || tracks.length >= 500 || ++pages >= 10) break;
        page = await page.getContinuation();
      }
      if (!tracks.length) throw new YouTubeMusicError('This playlist has no publicly available tracks.', 422);
      const value = { ...parsed, title, cover: cover || tracks[0].cover, tracks, truncated: page.has_continuation || tracks.length >= 500 };
      playlists.set(parsed.id, { until: Date.now() + 5 * 60_000, value });
      trimCache(playlists);
      return value;
    } catch (error) {
      if (error instanceof YouTubeMusicError) throw error;
      throw new YouTubeMusicError('Could not load this playlist. Use a public or unlisted playlist and try again.', 422);
    } finally { loadingPlaylists.delete(parsed.id); }
  })();
  loadingPlaylists.set(parsed.id, load);
  return load;
}

export async function getYouTubeAudioSource(videoId: string, refresh = false) {
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) throw new YouTubeMusicError('Invalid track ID.', 400);
  const cached = audio.get(videoId);
  if (!refresh && cached && cached.until > Date.now()) return cached.value;
  try {
    const yt = await getSession();
    const format = await yt.getStreamingData(videoId, { client: 'YTMUSIC', type: 'audio', quality: 'best', format: 'mp4' });
    const url = new URL(format.url!);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.googlevideo.com') || url.username || url.password || url.port) throw new Error('Unexpected stream host');
    const length = Number(format.content_length);
    if (!Number.isSafeInteger(length) || length <= 0) throw new Error('Missing media length');
    if (length > 64 * 1024 * 1024) throw new YouTubeMusicError('This track is too large for inline playback.', 422);
    const value = { url: url.href, length };
    audio.set(videoId, { until: Date.now() + 60_000, value });
    trimCache(audio, 300);
    return value;
  } catch {
    throw new YouTubeMusicError('This track is unavailable right now. Try another track or refresh the playlist.', 422);
  }
}

const requests = new Map<string, { count: number; until: number }>();
export function musicRequestAllowed(request: Request, kind: 'playlist' | 'audio') {
  const key = `${kind}:${request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'}`;
  let entry = requests.get(key);
  if (!entry || entry.until < Date.now()) { entry = { count: 0, until: Date.now() + 60_000 }; requests.set(key, entry); }
  trimCache(requests, 1000);
  return ++entry.count <= (kind === 'audio' ? 180 : 30);
}
