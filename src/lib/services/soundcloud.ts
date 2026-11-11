import { parseSoundCloudUrl } from '@/lib/music/soundcloud'

export class SoundCloudError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export interface SoundCloudInfo {
  url: string
  title: string
  author: string
  thumbnail: string
}

/**
 * Looks a SoundCloud link up through SoundCloud's public oEmbed endpoint. This confirms the link exists and
 * can be embedded; the track list itself is read in the browser through the widget.
 */
export async function getSoundCloudInfo(input: string): Promise<SoundCloudInfo> {
  const link = parseSoundCloudUrl(input)
  if (!link) throw new SoundCloudError('Enter a public SoundCloud track or playlist link.', 400)
  let response: Response
  try {
    response = await fetch(`https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(link.url)}`, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new SoundCloudError('SoundCloud did not answer. Try again in a moment.', 503)
  }
  if (response.status === 404 || response.status === 403) {
    throw new SoundCloudError('This SoundCloud link was not found, or it is private. Use a public link.', 404)
  }
  if (!response.ok) throw new SoundCloudError('SoundCloud is temporarily unavailable.', 503)
  const body = await response.json().catch(() => null) as { title?: string; author_name?: string; thumbnail_url?: string } | null
  if (!body?.title) throw new SoundCloudError('SoundCloud did not return details for this link.', 502)
  return {
    url: link.url,
    title: String(body.title).slice(0, 200),
    author: String(body.author_name ?? '').slice(0, 120),
    thumbnail: typeof body.thumbnail_url === 'string' && body.thumbnail_url.startsWith('https://') ? body.thumbnail_url : '',
  }
}
