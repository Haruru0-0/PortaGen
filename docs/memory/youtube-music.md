# YouTube Music

Updated 2026-11-11. See [[architecture]], [[decisions]], [[gotchas]] and [[roadmap]].

## Agreed behavior

- For now, use a playlist link without Google login. Accept public or unlisted YouTube Music and YouTube playlists.
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
