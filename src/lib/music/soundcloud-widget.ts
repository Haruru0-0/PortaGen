// Minimal typings and loader for the SoundCloud HTML5 Widget API.
// https://developers.soundcloud.com/docs/api/html5-widget

export interface SCSound {
  title: string
  duration: number
  permalink_url: string
  artwork_url: string | null
  user?: { username?: string; permalink_url?: string }
}

export interface SCProgress {
  currentPosition: number
  relativePosition: number
  loadedProgress: number
}

export interface SCWidget {
  bind: (event: string, listener: (data?: SCProgress) => void) => void
  unbind: (event: string) => void
  play: () => void
  pause: () => void
  seekTo: (milliseconds: number) => void
  setVolume: (volume: number) => void
  skip: (index: number) => void
  getSounds: (callback: (sounds: SCSound[]) => void) => void
  getDuration: (callback: (milliseconds: number) => void) => void
  getCurrentSoundIndex: (callback: (index: number) => void) => void
}

export interface SCNamespace {
  Widget: ((iframe: HTMLIFrameElement) => SCWidget) & {
    Events: Record<"READY" | "PLAY" | "PAUSE" | "FINISH" | "PLAY_PROGRESS" | "ERROR", string>
  }
}

declare global {
  interface Window {
    SC?: SCNamespace
  }
}

let apiPromise: Promise<SCNamespace> | null = null

export function loadSoundCloudApi(): Promise<SCNamespace> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"))
  if (window.SC?.Widget) return Promise.resolve(window.SC)
  if (apiPromise) return apiPromise
  apiPromise = new Promise<SCNamespace>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://w.soundcloud.com/player/api.js"
    script.async = true
    script.onload = () => (window.SC?.Widget ? resolve(window.SC) : reject(new Error("SoundCloud API unavailable")))
    script.onerror = () => {
      apiPromise = null
      reject(new Error("SoundCloud API failed to load"))
    }
    document.head.appendChild(script)
  })
  return apiPromise
}

/** Embed address for a hidden playback or metadata widget. */
export function soundCloudEmbedSrc(url: string) {
  const params = new URLSearchParams({
    url,
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "false",
    show_reposts: "false",
    visual: "false",
  })
  return `https://w.soundcloud.com/player/?${params.toString()}`
}

/** Keeps a widget in the page (so playback is not throttled) without showing it. */
export const hiddenWidgetStyle = {
  position: "fixed",
  left: 0,
  bottom: 0,
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: "none",
  border: 0,
} as const
