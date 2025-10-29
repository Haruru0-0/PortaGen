"use client"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  url?: string
}

interface BlogWindowProps {
  data?: {
    posts?: BlogPost[]
  }
}

export function BlogWindow({ data }: BlogWindowProps) {
  const posts = data?.posts || [
    {
      id: "1",
      title: "BUILDING RETRO UIS",
      excerpt: "HOW TO CREATE PIXEL-PERFECT INTERFACES...",
      date: "2024-01-15",
      url: "#",
    },
    {
      id: "2",
      title: "GSAP ANIMATIONS",
      excerpt: "SMOOTH ANIMATIONS WITH GSAP LIBRARY...",
      date: "2024-01-10",
      url: "#",
    },
  ]

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div key={post.id} className="border-2 border-border p-3 space-y-1 hover:bg-muted transition-colors">
          <div className="text-[10px] pixel-text-shadow">{post.title}</div>
          <div className="text-[8px] text-muted-foreground">{post.date}</div>
          <div className="text-[8px]">{post.excerpt}</div>
          {post.url && (
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[8px] text-primary hover:underline"
            >
              READ MORE →
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
