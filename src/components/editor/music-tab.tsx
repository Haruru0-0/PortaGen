"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { WorkspacePanel, WorkspaceAction, WorkspaceInput } from "@/components/workspace/workspace-primitives"
import { useDesktopContext } from "@/contexts/desktopContext"
import { isSpotifyMusicUrl, parseYouTubePlaylistUrl, type YouTubePlaylist } from "@/lib/music/youtube-playlist"

export function MusicTab() {
  const params = useParams<{ id: string }>()
  const portfolioId = Number(params?.id)
  const { data, getDesktopData, updateMusic, loading, fetching } = useDesktopContext()
  const savedUrl = data?.portfolioId === portfolioId ? data.spotifyPlaylistUrl || "" : ""
  const [url, setUrl] = useState("")
  const [preview, setPreview] = useState<YouTubePlaylist | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState("")
  const request = useRef<AbortController | null>(null)
  const parsed = parseYouTubePlaylistUrl(url)
  const busy = loading || fetching || saving
  const canSave = !!preview && preview.url === parsed?.url && preview.tracks.length > 0

  useEffect(() => {
    if (portfolioId) {
      void getDesktopData(portfolioId).catch(() => setError("Could not load your saved music. Please try again."))
    }
  }, [portfolioId, getDesktopData])

  useEffect(() => {
    request.current?.abort()
    setUrl(parseYouTubePlaylistUrl(savedUrl)?.url || "")
    setPreview(null)
    setPreviewing(false)
  }, [savedUrl, portfolioId])

  useEffect(() => () => request.current?.abort(), [])

  const previewPlaylist = async () => {
    if (busy || previewing) return
    request.current?.abort()
    setError("")
    setStatus("")
    setPreview(null)
    if (!parsed) {
      setError("Enter a YouTube Music or YouTube playlist link containing a playlist ID.")
      return
    }
    const controller = new AbortController()
    request.current = controller
    setPreviewing(true)
    try {
      const response = await fetch(`/api/music/youtube/playlist?url=${encodeURIComponent(parsed.url)}`, { signal: controller.signal })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Could not load this playlist. Check that it is public or unlisted.")
      if (controller.signal.aborted) return
      const playlist = result as YouTubePlaylist
      if (playlist.url !== parsed.url || !Array.isArray(playlist.tracks) || !playlist.tracks.length) {
        throw new Error("This playlist has no available tracks. Try another public or unlisted playlist.")
      }
      setPreview(playlist)
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not load this playlist. Try again.")
    } finally {
      if (!controller.signal.aborted) setPreviewing(false)
    }
  }

  const savePlaylist = async (nextUrl: string) => {
    if (!portfolioId || busy || previewing) return
    setSaving(true)
    setError("")
    setStatus("")
    try {
      await updateMusic(portfolioId, nextUrl)
      setStatus(nextUrl ? "Playlist saved. Visitors can play it from your music player." : "Playlist removed.")
      if (!nextUrl) {
        setUrl("")
        setPreview(null)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your playlist. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <WorkspacePanel>
      <div className="space-y-4">
        <h3 className="text-sm workspace-editor-title">MUSIC (YOUTUBE MUSIC)</h3>
        <p id="music-playlist-help" className="font-dialogue text-sm text-muted-foreground">
          Paste a public or unlisted playlist link, preview its tracks, then save. No Google sign-in needed.
        </p>
        {savedUrl && (
          <p className="font-dialogue text-sm text-muted-foreground">
            {isSpotifyMusicUrl(savedUrl)
              ? "Your saved Spotify source stays in place until you save a YouTube Music playlist or remove it."
              : "A playlist is saved. Preview a link to review or replace it."}
          </p>
        )}
        <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); void previewPlaylist() }} aria-busy={previewing || saving}>
          <WorkspaceInput
            id="music-playlist-url"
            label="YOUTUBE MUSIC PLAYLIST LINK"
            placeholder="https://music.youtube.com/playlist?list=…"
            value={url}
            disabled={busy}
            aria-describedby={`music-playlist-help${error ? " music-playlist-error" : ""}`}
            aria-invalid={!!error}
            onChange={(event) => {
              request.current?.abort()
              setUrl(event.target.value)
              setPreview(null)
              setPreviewing(false)
              setError("")
              setStatus("")
            }}
          />
          <WorkspaceAction type="submit" variant="secondary" className="w-full text-xs" disabled={busy || previewing || !url.trim()}>
            {previewing ? "LOADING PLAYLIST…" : "PREVIEW PLAYLIST"}
          </WorkspaceAction>
          {error && <p id="music-playlist-error" role="alert" className="font-dialogue text-sm text-destructive">{error}</p>}
          <p role="status" className="font-dialogue text-sm text-muted-foreground">{previewing ? "Fetching playlist details…" : status}</p>
          {preview && (
            <div className="space-y-3" aria-label="Playlist preview">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {preview.cover && <img src={preview.cover} alt="" className="size-16 shrink-0 object-cover" />}
                <div className="min-w-0">
                  <h4 className="font-dialogue break-words">{preview.title}</h4>
                  <p className="font-dialogue text-sm text-muted-foreground">{preview.tracks.length}{preview.truncated ? "+" : ""} tracks{preview.truncated ? " · Includes the first 500 available tracks" : ""}</p>
                </div>
              </div>
              <ol className="space-y-1 font-dialogue text-sm" aria-label="Sample tracks">
                {preview.tracks.slice(0, 5).map((track, index) => (
                  <li key={`${track.videoId}-${index}`} className="break-words">{index + 1}. {track.title}{track.artist ? ` — ${track.artist}` : ""}</li>
                ))}
              </ol>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <WorkspaceAction type="button" className="flex-1 text-xs" disabled={busy || previewing || !canSave || !portfolioId} onClick={() => { if (canSave && preview) void savePlaylist(preview.url) }}>
              {saving ? "SAVING…" : "SAVE PLAYLIST"}
            </WorkspaceAction>
            <WorkspaceAction type="button" variant="secondary" className="text-xs" disabled={busy || previewing || !savedUrl || !portfolioId} onClick={() => void savePlaylist("")}>
              REMOVE
            </WorkspaceAction>
          </div>
        </form>
      </div>
    </WorkspacePanel>
  )
}
