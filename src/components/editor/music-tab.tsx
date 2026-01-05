import { useEffect, useState } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { PixelInput } from "@/components/pixel-input"
import { useDesktopContext } from "@/contexts/desktopContext"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useParams } from "next/navigation";

export function MusicTab() {
  const [connected, setConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const params = useParams<{ id: string }>()
  const currentPortfolioId = Number(params?.id)
  const { data, getDesktopData, updateSpotify, loading: desktopLoading } = useDesktopContext()

  const schema = z.object({
    spotifyPlaylistUrl: z
      .string()
      .min(1, "Playlist URL is required")
      .refine(
        (val) => /^(https?:\/\/)?open\.spotify\.com\/(playlist|album|track)\//i.test(val.trim()),
        { message: "Enter a valid Spotify playlist/album/track URL" },
      ),
  })
  const form = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { spotifyPlaylistUrl: "" },
  })

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/api/auth/spotify/status')
        if (res.ok) {
          const data = await res.json()
          setConnected(!!data.connected)
        }
      } catch { }
    }
    check()
  }, [])

  useEffect(() => {
    if (currentPortfolioId) {
      void getDesktopData(currentPortfolioId)
    }
  }, [currentPortfolioId, getDesktopData])

  useEffect(() => {
    if (data?.spotifyPlaylistUrl !== undefined) {
      form.reset({ spotifyPlaylistUrl: data.spotifyPlaylistUrl || "" })
    }
  }, [data, form])

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              if (!currentPortfolioId) return
              await updateSpotify(currentPortfolioId, values.spotifyPlaylistUrl.trim())
            })}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="spotifyPlaylistUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SPOTIFY PLAYLIST URL</FormLabel>
                  <FormControl>
                    <PixelInput placeholder="https://open.spotify.com/playlist/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-[10px] text-muted-foreground">Private playlists require Spotify connect. Full playback requires Premium.</p>

            <div className="mt-4">
              <PixelButton
                type="submit"
                className="w-full text-[10px]"
                disabled={desktopLoading || form.formState.isSubmitting}
              >
                {desktopLoading || form.formState.isSubmitting ? 'SAVING…' : 'SAVE'}
              </PixelButton>
            </div>
          </form>
        </Form>

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

    </PixelCard>
  )
}
