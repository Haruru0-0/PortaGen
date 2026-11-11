import type { Track } from "@/lib/types"
import { hiddenWidgetStyle, loadSoundCloudApi, soundCloudEmbedSrc } from "@/lib/music/soundcloud-widget"

function formatDuration(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`
}

/** Reads a SoundCloud track or set through a throwaway hidden widget. Browser only. */
export function readSoundCloudTracks(url: string, timeoutMs = 12000): Promise<Track[]> {
  return new Promise<Track[]>((resolve, reject) => {
    const iframe = document.createElement("iframe")
    Object.assign(iframe.style, hiddenWidgetStyle)
    iframe.setAttribute("aria-hidden", "true")
    iframe.tabIndex = -1
    iframe.allow = "autoplay"
    iframe.src = soundCloudEmbedSrc(url)
    document.body.appendChild(iframe)
    let settled = false
    const finish = (action: () => void) => {
      if (settled) return
      settled = true
      window.clearTimeout(timer)
      iframe.remove()
      action()
    }
    const timer = window.setTimeout(() => finish(() => reject(new Error("SoundCloud did not respond."))), timeoutMs)
    loadSoundCloudApi().then(SC => {
      const widget = SC.Widget(iframe)
      widget.bind(SC.Widget.Events.READY, () => {
        widget.getSounds(sounds => {
          if (!sounds?.length) { finish(() => reject(new Error("No playable tracks found."))); return }
          const tracks: Track[] = sounds.map((sound, index) => ({
            id: index + 1,
            title: sound.title,
            artist: sound.user?.username ?? "SoundCloud",
            cover: (sound.artwork_url ?? "").replace("-large", "-t500x500"),
            duration: formatDuration(sound.duration),
            src: "",
            soundcloudUrl: url,
            scIndex: index,
            permalinkUrl: sound.permalink_url,
          }))
          finish(() => resolve(tracks))
        })
      })
    }).catch(() => finish(() => reject(new Error("SoundCloud could not be loaded."))))
  })
}
