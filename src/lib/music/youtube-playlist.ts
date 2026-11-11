export interface YouTubePlaylistTrack {
  id: number;
  videoId: string;
  title: string;
  artist: string;
  cover: string;
  duration: string;
  src: string;
}
export interface YouTubePlaylist {
  id: string;
  url: string;
  title: string;
  cover: string;
  tracks: YouTubePlaylistTrack[];
  truncated: boolean;
}

const hosts = new Set(['music.youtube.com', 'youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']);
export function parseYouTubePlaylistUrl(input: string): { id: string; url: string } | null {
  try {
    const text = input.trim();
    if (!text || text.length > 2048) return null;
    const value = new URL(text.includes('://') ? text : `https://${text}`);
    if (!['https:', 'http:'].includes(value.protocol) || !hosts.has(value.hostname) || value.username || value.password || value.port) return null;
    if (value.hostname !== 'youtu.be' && !['/playlist', '/watch'].includes(value.pathname)) return null;
    const id = value.searchParams.get('list');
    if (!id || !/^[A-Za-z0-9_-]{10,150}$/.test(id)) return null;
    return { id, url: `https://music.youtube.com/playlist?list=${id}` };
  } catch { return null; }
}

export function isSpotifyMusicUrl(input: string) {
  try { return new URL(input).hostname === 'open.spotify.com'; } catch { return false; }
}
