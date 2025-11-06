import { useEffect, useState } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { PixelInput } from "@/components/pixel-input"

export function MusicTab() {
  const [connected, setConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/spotify/status')
        if (res.ok) {
          const data = await res.json()
          setConnected(!!data.connected)
        }
      } catch {}
    }
    check()
  }, [])

  const connectSpotify = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/spotify/connect')
      const data = await res.json()
      if (data.authUrl) window.location.href = data.authUrl
    } finally {
      setLoading(false)
    }
  }

  return (
    <PixelCard>
      <div className="space-y-4">
        <h3 className="text-sm pixel-text-shadow">MUSIC (SPOTIFY)</h3>

        <div className="space-y-2">
          <label className="block text-[10px]">SPOTIFY PLAYLIST URL</label>
          <PixelInput
            placeholder="https://open.spotify.com/playlist/..."
          />
          <p className="text-[10px] text-muted-foreground">Private playlists require Spotify connect. Full playback requires Premium.</p>
        </div>

        {!connected && (
          <PixelButton
            variant="secondary"
            className="w-full text-[10px]"
            onClick={connectSpotify}
            disabled={loading}
          >
            {loading ? 'CONNECTING…' : 'CONNECT SPOTIFY'}
          </PixelButton>
        )}
      </div>
      <div className="mt-6">
        <PixelButton className="w-full text-[10px]">
          SAVE
        </PixelButton>
      </div>
    </PixelCard>
  )
}

