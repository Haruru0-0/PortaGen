const hosts = new Set(["soundcloud.com", "www.soundcloud.com", "m.soundcloud.com"])

/** Accepts a public SoundCloud track or set (playlist) link and returns its canonical form. */
export function parseSoundCloudUrl(input: string): { url: string } | null {
  try {
    const text = input.trim()
    if (!text || text.length > 2048) return null
    const value = new URL(text.includes("://") ? text : `https://${text}`)
    if (value.protocol !== "https:" && value.protocol !== "http:") return null
    if (!hosts.has(value.hostname) || value.username || value.password || value.port) return null
    const parts = value.pathname.split("/").filter(Boolean)
    if (parts.length < 2) return null
    if (!parts.every(part => /^[A-Za-z0-9_.%~-]+$/.test(part))) return null
    // Keep the private-link token if there is one; drop everything else.
    const secret = value.searchParams.get("secret_token")
    const base = `https://soundcloud.com/${parts.join("/")}`
    return { url: secret && /^[A-Za-z0-9_-]+$/.test(secret) ? `${base}?secret_token=${secret}` : base }
  } catch {
    return null
  }
}

export function isSoundCloudUrl(input?: string) {
  if (!input) return false
  try {
    const text = input.trim()
    const value = new URL(text.includes("://") ? text : `https://${text}`)
    return hosts.has(value.hostname)
  } catch {
    return false
  }
}
