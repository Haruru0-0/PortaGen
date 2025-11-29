import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail, FileText, Bookmark } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import { LinksData } from "@/lib/types"

const ICON_MAP: Record<string, any> = {
  Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail, FileText, Bookmark
}

export default function Links({ data }: { data?: LinksData }) {
  const socialLinks = data?.socials || [
    {
      name: "GitHub",
      url: "https://github.com",
      icon: "Github",
      color: "bg-gray-900 hover:bg-gray-800",
    }
  ]

  const projectLinks = data?.projects || [
    {
      name: "Portfolio",
      url: "https://example.com",
      icon: "Globe",
      description: "My personal portfolio",
    }
  ]

  const getIcon = (iconName?: string) => {
    const Icon = ICON_MAP[iconName || "Globe"] || Globe
    return <Icon className="h-5 w-5" />
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto pixel-text">
      <AnimatedSection variant="scale" duration={0.7} className="text-center">
        <h1 className="text-3xl font-bold mb-2 pixel-title">Connect With Me</h1>
        <p className="opacity-80">Find me across the web and get in touch</p>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.1} staggerChildren={0.1}>
        <h2 className="text-xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Social Media</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {socialLinks.map((link: any, index: number) => (
            <AnimatedItem key={index}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" className={`w-full ${link.color || 'bg-primary'} text-white rounded-none border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.2)] transition-all`}>
                  {getIcon(link.icon)}
                  <span className="ml-2">{link.name || link.platform}</span>
                </Button>
              </a>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1}>
        <h2 className="text-xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">Projects & Resources</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {projectLinks.map((link: any, index: number) => (
            <AnimatedItem key={index}>
              <Card className="h-full hover:shadow-md transition-shadow pixel-card border-0">
                <CardContent className="p-4">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3">
                    <div className="bg-[var(--cute-highlight)] p-2 rounded-none shrink-0 border-2 border-[var(--cute-text)] text-[var(--cute-text)]">
                      {getIcon(link.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium pixel-text">{link.name || link.title}</h3>
                      <p className="text-sm opacity-70">{link.description}</p>
                    </div>
                  </a>
                </CardContent>
              </Card>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="slideUp" delay={0.3}>
        <div className="text-center">
          <Card className="bg-[var(--cute-bg)] border-2 border-dashed border-[var(--cute-text)] rounded-none shadow-none">
            <CardContent className="p-6">
              <Mail className="h-8 w-8 mx-auto mb-2 text-[var(--cute-text)]" />
              <h2 className="text-xl font-bold mb-1 pixel-title">Get in Touch</h2>
              <p className="opacity-80 mb-4">Have a project in mind or just want to say hello?</p>
              <Button variant="default" className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--cute-text)] text-white hover:bg-[var(--cute-text)]/90">
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
    </div>
  )
}