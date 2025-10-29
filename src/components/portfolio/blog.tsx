export default function Blog() {
  const posts = [
    {
      title: "Getting Started with Next.js",
      date: "2024-01-15",
      excerpt: "Learn the basics of Next.js and build your first app.",
    },
    {
      title: "TypeScript Best Practices",
      date: "2024-01-10",
      excerpt: "Tips and tricks for writing better TypeScript code.",
    },
    {
      title: "Building Responsive UIs",
      date: "2024-01-05",
      excerpt: "Create beautiful responsive designs with Tailwind CSS.",
    },
  ]

  return (
    <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Blog Posts</h3>
      {posts.map((post, index) => (
        <article
          key={index}
          className="border border-border rounded-lg p-4 hover:bg-accent transition-colors cursor-pointer"
        >
          <h4 className="font-semibold mb-1">{post.title}</h4>
          <p className="text-xs text-muted-foreground mb-2">{post.date}</p>
          <p className="text-sm">{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
