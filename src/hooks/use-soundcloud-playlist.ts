"use client";

import { useEffect, useState } from "react";
import type { Track } from "@/lib/types";
import { isSoundCloudUrl, parseSoundCloudUrl } from "@/lib/music/soundcloud";
import { readSoundCloudTracks } from "@/lib/music/soundcloud-playlist";

export interface SoundCloudPlaylist {
  url: string;
  tracks: Track[];
}

const cache = new Map<string, SoundCloudPlaylist>();

/** Loads the tracks of a saved SoundCloud link for the player. */
export function useSoundCloudPlaylist(url?: string) {
  const configured = isSoundCloudUrl(url);
  const parsedUrl = url ? parseSoundCloudUrl(url)?.url ?? null : null;
  const [result, setResult] = useState<{ url: string; playlist: SoundCloudPlaylist | null; error: boolean } | null>(null);

  useEffect(() => {
    if (!parsedUrl || cache.has(parsedUrl)) return;
    let cancelled = false;
    readSoundCloudTracks(parsedUrl)
      .then(tracks => {
        const playlist = { url: parsedUrl, tracks };
        cache.set(parsedUrl, playlist);
        if (!cancelled) setResult({ url: parsedUrl, playlist, error: false });
      })
      .catch(() => {
        if (!cancelled) setResult({ url: parsedUrl, playlist: null, error: true });
      });
    return () => { cancelled = true; };
  }, [parsedUrl]);

  const cached = parsedUrl ? cache.get(parsedUrl) : null;
  const current = cached ? { url: parsedUrl, playlist: cached, error: false } : result?.url === parsedUrl ? result : null;
  return {
    sourceKey: parsedUrl ? `soundcloud:${parsedUrl}` : `unavailable:${url?.trim()}`,
    configured,
    playlist: current?.playlist ?? null,
    loading: !!parsedUrl && !current,
    error: configured && !parsedUrl || (current?.error ?? false),
  };
}
