import React from "react"
import type { Track } from "@/lib/types"

/**
 * Attribution SoundCloud asks for when a custom player streams its tracks: the uploader is credited as the
 * artist next to this link, and the link goes to the track on SoundCloud.
 * TODO: add SoundCloud's official logo next to the text (the guidelines ask for it; the asset is not in the repo).
 */
export function SoundCloudCredit({ track, className = "" }: { track: Pick<Track, "permalinkUrl" | "soundcloudUrl">; className?: string }) {
  if (!track.soundcloudUrl || !track.permalinkUrl) return null
  return (
    <a
      href={track.permalinkUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={`inline-block max-w-full truncate text-[10px] leading-tight underline underline-offset-2 opacity-70 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      Listen on SoundCloud
    </a>
  )
}
