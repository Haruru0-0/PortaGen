# YouTube Music playlist links — 2026-11-11

The editor now accepts a public or unlisted YouTube Music/YouTube playlist link without Google login. Preview shows title, artwork, count and sample tracks; save/remove use an authenticated, portfolio-owner-checked endpoint. Published portfolios use their existing music-player skins and audio controls. Existing Spotify sources remain compatible until explicitly replaced.

The existing `spotifyPlaylistUrl` / `spotify_playlist_url` field stores the canonical source URL. No database migration, API key, Google account or cookie is required. Playlist retrieval uses youtubei.js; downloaded player decoding runs inside QuickJS WASM with memory, stack and time limits. Audio URLs are short-lived server cache entries, never persisted. The audio proxy validates video IDs, ranges and upstream hosts, streams without buffering entire songs, and has a 64MB track limit. Seeking can require a fresh full upstream transfer.

## Verification

- Native Node tests: 13 passing, including strict playlist parsing and streamed byte slicing/range validation.
- Focused server/editor/player lint passed. Existing explicit-any lint errors in old default-player control files remain; whole-repository lint is not clean.
- API probes: off-site playlist URL and invalid video ID return 400; malformed range returns 416; unauthenticated save returns 401.
- Isolated Chromium fixture with real metadata and audio: public Rick Astley playlist loads; first song plays; seek to 45 seconds and near the end both continue playback; widget remount preserves playback; initial load/save never autoplay.
- Real second-track restriction produces an accessible error notice with Retry, Next track and Open on YouTube Music. No iframe is injected.
- Editor preview/save/remove/failed-save UI tested with mocked persistence at widths 390, 1100 and 1440; no horizontal overflow or page errors. These checks made no real database writes. The temporary fixture route was removed afterward.
- Playback harnesses cover duplicate queue entries, source changes, remount continuity, mute, media errors, retries and clearing errors on track changes.
- Production `yarn build --webpack` passed, including TypeScript. Release-sync QuickJS WASM is present in the playlist/audio/save route traces. A temporary production server returned 200 with 10 real tracks and 206 audio/mp4 with 65,536 decoded bytes; that server was stopped afterward. Existing next-video experimental-config, middleware and browser-mapping warnings remain.

Screenshots: [mobile editor](youtube-music-links/editor-player-390.png), [desktop editor/player](youtube-music-links/editor-player-1100.png), [unavailable track](youtube-music-links/unavailable-track.png).

## Playback limitations

Anonymous public playlist metadata works, but full audio playback is not guaranteed for every track. In this environment, `dQw4w9WgXcQ` streamed fully and decoded; `yPYZpwSpKmA` allowed an initial small range but rejected complete/later audio requests with upstream HTTP 403. This was not a Google sign-in prompt, and adding Google login has not been demonstrated to resolve it. Exact upstream verification triggers are unknown. Do not describe this as full-catalog playback.

No production deployment or authenticated live database mutation was performed. Hosting/IP restrictions may differ from local results.
