"use client";

import { useEffect, useState } from "react";
import { isSpotifyMusicUrl, parseYouTubePlaylistUrl, type YouTubePlaylist } from "@/lib/music/youtube-playlist";
import { isSoundCloudUrl } from "@/lib/music/soundcloud";

// Keep successful playlist objects stable across responsive widget remounts.
const playlistCache = new Map<string, YouTubePlaylist>();

export function useYouTubePlaylist(url?: string) {
  const configured = !!url?.trim() && !isSpotifyMusicUrl(url) && !isSoundCloudUrl(url);
  const parsedUrl = url ? parseYouTubePlaylistUrl(url)?.url ?? null : null;
  const [result, setResult] = useState<{ url: string; playlist: YouTubePlaylist | null; error: boolean } | null>(null);
  useEffect(() => {
    if (!parsedUrl || playlistCache.has(parsedUrl)) return;
    const controller = new AbortController();
    fetch(`/api/music/youtube/playlist?url=${encodeURIComponent(parsedUrl)}`, { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Playlist unavailable");
        const playlist: YouTubePlaylist = await response.json();
        if (!playlist.tracks?.length) throw new Error("Playlist empty");
        if (!controller.signal.aborted) {
          playlistCache.set(parsedUrl, playlist);
          setResult({ url: parsedUrl, playlist, error: false });
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ url: parsedUrl, playlist: null, error: true });
      });
    return () => controller.abort();
  }, [parsedUrl]);
  const cached = parsedUrl ? playlistCache.get(parsedUrl) : null;
  const current = cached ? { url: parsedUrl, playlist: cached, error: false } : result?.url === parsedUrl ? result : null;
  return {
    sourceKey: parsedUrl ?? (configured ? `unavailable:${url?.trim()}` : "local"),
    configured,
    playlist: current?.playlist ?? null,
    loading: !!parsedUrl && !current,
    error: configured && !parsedUrl || (current?.error ?? false),
  };
}
