import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import { useQuery } from '@tanstack/react-query'
import { fetchBlogPosts, type PostNode } from '@/lib/services/hashnode'
import { format } from 'date-fns'
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPost {
  id: string
  title: string
  brief: string
  publishedAt: string
  readTimeInMinutes: number
  coverImage?: {
    url: string
  }
  tags: Array<{
    name: string
  }>
  url: string
}

export default function Blog() {
  const { data: posts, isLoading, isError } = useQuery<PostNode[]>({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts,
  })

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pixel-text">
        <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2 rounded-none" />
            <Skeleton className="h-4 w-64 rounded-none" />
          </div>
          <Skeleton className="h-10 w-64 rounded-none" />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-none" />
          ))}
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-video w-full rounded-none" />
              <Skeleton className="h-4 w-20 rounded-none" />
              <Skeleton className="h-6 w-full rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pixel-text">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2 pixel-title">Failed to load posts</h2>
          <p className="text-muted-foreground mb-4 opacity-80">
            We couldn't fetch the blog posts. Please try again later.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const blogPosts = posts?.map((post: BlogPost) => ({
    id: post.id,
    title: post.title,
    excerpt: post.brief,
    date: format(new Date(post.publishedAt), "MMM dd, yyyy"),
    readTime: `${post.readTimeInMinutes} min read`,
    category: post.tags.length > 0 ? post.tags[0].name : "General",
    image: post.coverImage?.url || "/placeholder.svg",
    url: post.url
  })) || []

  const allCategories = ["All", ...new Set(posts?.flatMap(post =>
    post.tags.map(tag => tag.name)
  ) || [])]

  return (
    <div className="space-y-8 max-w-5xl mx-auto pixel-text">
      <AnimatedSection variant="slideUp" duration={0.6}>
        <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1 pixel-title">Blog</h1>
            <p className="opacity-80">Thoughts, tutorials, and insights on web development</p>
          </div>
          <div className="flex items-center w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search articles..." className="pl-8 w-full bg-[var(--card-bg)] border-2 border-[var(--cute-text)] rounded-none focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]" />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} threshold={0.1}>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {blogPosts.map((post) => (
            <AnimatedItem key={post.id}>
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-0 pixel-card">
                <div className="aspect-video overflow-hidden border-b-2 border-[var(--cute-text)] relative">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                    <Badge variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)]">{post.category}</Badge>
                    <span className="text-xs opacity-60">{post.date}</span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 pixel-title">{post.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-sm opacity-80 line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <span className="text-xs opacity-60">{post.readTime}</span>
                  <Button variant="ghost" size="sm" asChild className="hover:bg-[var(--cute-highlight)] rounded-none">
                    <a href={post.url} target="_blank" rel="noopener noreferrer">
                      Read More
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="fadeIn" delay={0.4} className="flex justify-center">
        <Button variant="outline" className="border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">Load More Articles</Button>
      </AnimatedSection>
    </div>
  )
}