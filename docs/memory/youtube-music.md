# YouTube Music

Updated 2026-11-11. See [[architecture]], [[decisions]], [[gotchas]] and [[roadmap]].

## Agreed behavior

- For now, use a playlist link without Google login. Accept public or unlisted YouTube Music and YouTube playlists. The music tab also accepts public SoundCloud track or set links (see the SoundCloud section below).
- Editor flow: paste link → preview title/artwork/count/sample tracks → save or remove. Saving still requires the normal PortaGen account and portfolio ownership.
- Keep existing portfolio music-player skins, queue controls, seek and volume. Do not autoplay after loading or saving a playlist.
- Keep previously saved Spotify sources compatible until the owner replaces or removes them.

## Implementation

- `src/components/editor/music-tab.tsx`: preview/save/remove UI, loading/error feedback and stale-request cancellation.
- `src/lib/music/youtube-playlist.ts`: strict link validation, canonicalization and shared playlist types.
- `src/lib/services/youtube-music.ts`: anonymous youtubei.js metadata/audio lookup; downloaded player decoding runs in QuickJS WASM with resource limits, outside Node's application context.
- `GET /api/music/youtube/playlist`: public metadata, bounded cache and request limits.
- `GET /api/music/youtube/audio/[videoId]`: validated audio proxy and byte ranges. Some seeks require a fresh full upstream transfer; songs are streamed rather than fully buffered in memory. Maximum track size is 64MB.
- `POST /api/desktop/music`: authenticated, owner-checked save/remove. Reuses `desktop_settings.spotify_playlist_url` / `spotifyPlaylistUrl` for the canonical provider URL. No database migration, Google credentials or API keys were added.
- `use-youtube-playlist.ts`, `MusicPlayerWidget.tsx` and `AudioProvider` connect metadata to the existing skins. Duplicate entries advance correctly, and responsive remounts preserve playback for the same source. Signed audio URLs are short-lived server cache entries and are never stored in the database.

## Known limitation

Public playlist retrieval does not guarantee that every song can stream. In local testing, one song played fully and could seek near its end; another allowed an initial small range but returned upstream HTTP 403 for complete/later audio requests. This was not a sign-in prompt. The exact upstream restriction is unconfirmed, and Google login has not been shown to fix it.

Unavailable tracks show Retry, Next track and an external Open on YouTube Music link. No iframe fallback was added. Do not promise full-catalog playback or diagnose every 403 as missing login.

## Verified and remaining

- 13 native Node tests passed; focused feature lint passed. Existing lint errors remain in older player-control files.
- Isolated browser checks passed for real playlist/audio playback, seeking, remount continuity, no autoplay, unavailable-track feedback and editor widths 390/1100/1440.
- Save/remove/error UI used mocked persistence; no real database mutation was performed.
- `yarn build --webpack` passed, including TypeScript. Required QuickJS WASM files are included in production route traces. Local production metadata and audio requests passed.
- Still needed: authenticated real save/remove verification and deployed-host playback checks. YouTube restrictions may vary by hosting IP.

Evidence: [QA record](../qa/2026-11-11-youtube-music-links.md) and [implementation plan](../superpowers/plans/2026-11-10-youtube-music-links.md).

## Embed engine prototype (2026-11-11)

Why: the server proxy returns upstream 403s for many tracks (anonymous server-side client, QuickJS instead of a real browser, hosting IP). limusic works because it runs on the user's machine; the web equivalent is YouTube's IFrame Player running in the visitor's browser.

- `src/lib/music/youtube-iframe.ts` loads the IFrame API; `AudioProvider` (`src/contexts/audio-context.tsx`) drives it when the engine is `embed` and the current track has a `videoId` (`Track.videoId`). The engine is `proxy` by default; use `NEXT_PUBLIC_YT_ENGINE=embed` or `?ytEngine=embed` / `?ytEngine=proxy` on the page URL to compare. The context now exposes `seek(percent)` (the widget uses it instead of touching the `<audio>` element) and `engine`.
- The embed is a visible 200x200 box fixed bottom-left (YouTube requires it visible and at least 200x200). Hiding it would break their terms.
- Tested locally on a temporary page (removed) with a real playlist: the first track that failed through the proxy ("could not be played") played in the embed, progress and duration showed, and next-track played the second track. Not tested: seek, volume, mobile, ended-track auto-advance, retry, embedding-disabled tracks (errors 101/150), ads, or any deployed host.
- Open decision: make `embed` the default, and where to place or style the visible player box.


## SoundCloud engine prototype (2026-11-11)

A SoundCloud set or track link can play through the same player skins, with the SoundCloud widget hidden (the user decided the widget need not be visible). Only SoundCloud's API terms, widget docs and attribution guidelines were read; they do not forbid hiding the widget, but the general Terms of Use page could not be read, so this is unconfirmed.

- `src/lib/music/soundcloud.ts` (link parser), `soundcloud-widget.ts` (API loader, typings, hidden-iframe style), `src/hooks/use-soundcloud-playlist.ts` (reads the set's tracks through a throwaway hidden widget and caches them). `Track` gained `soundcloudUrl`, `scIndex`, `permalinkUrl`.
- `AudioProvider` runs one hidden widget per source while a SoundCloud track is current: play, pause, skip to the track's index, seek (`seekTo`), volume, progress events, and it follows the widget when it moves to the next sound. `MusicPlayerWidget` shows an attribution link ("<title> by <artist> on SoundCloud") to the track's page, as the guidelines require for custom players.
- Tested on a temporary page (removed) with a real public set: tracks, cover and durations loaded, play, next track, seek (to 3:12 of 4:34) and pause worked in the existing default skin.
- Editor (added later the same day): the music tab accepts YouTube Music or SoundCloud links. SoundCloud preview = `GET /api/music/soundcloud/info` (server, SoundCloud's public oEmbed lookup: title, author, thumbnail; 404 for missing/private links; shares the playlist rate limit) plus the track list read in the browser by `readSoundCloudTracks` (`src/lib/music/soundcloud-playlist.ts`, also used by the player hook). `POST /api/desktop/music` validates SoundCloud links with the same oEmbed lookup and stores the canonical URL in `spotifyPlaylistUrl`. Tested on a temporary page: preview of a real set (title, 11 tracks, sample list) and the not-found error; the API returns 200/404/400 for good/missing/foreign links and 401 when logged out. Not tested: saving and removing with a real login and database.
- Attribution moved into the skins (the banner above the player was removed): `music-player/SoundCloudCredit.tsx` renders a small "Listen on SoundCloud" link to the track under the artist name in the expanded and mobile views of all skins (default via `SongInfo.tsx` and `MobilePlayer.tsx`, the other six through two inserts each). The artist line is the uploader. Collapsed players show no track data, so no credit there. Checked on the default skin only.
- Not done: the official SoundCloud logo (guidelines require a logo next to attribution; the asset was not added), auto-advance across the end of the set, retry and error paths, the other seven skins, phones, and any restricted or preview-only tracks. Saved links would reuse `spotifyPlaylistUrl`.
