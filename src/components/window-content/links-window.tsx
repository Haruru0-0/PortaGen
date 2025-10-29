"use client"

import { PixelButton } from "@/components/pixel-button"

interface Link {
  id: string
  title: string
  url: string
  icon?: string
}

interface LinksWindowProps {
  data?: {
    links?: Link[]
  }
}

export function LinksWindow({ data }: LinksWindowProps) {
  const links = data?.links || [
    { id: "1", title: "GITHUB", url: "#", icon: "🔗" },
    { id: "2", title: "LINKEDIN", url: "#", icon: "💼" },
    { id: "3", title: "TWITTER", url: "#", icon: "🐦" },
    { id: "4", title: "PORTFOLIO", url: "#", icon: "🌐" },
  ]

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <PixelButton key={link.id} variant="secondary" className="text-[10px] w-full justify-start" asChild>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.icon && <span className="mr-2">{link.icon}</span>}
            {link.title}
          </a>
        </PixelButton>
      ))}
    </div>
  )
}
