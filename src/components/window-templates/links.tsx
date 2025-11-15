import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail, FileText, Bookmark } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"

export default function Links() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/username",
      icon: <Github className="h-5 w-5" />,
      color: "bg-gray-900 hover:bg-gray-800",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/username",
      icon: <Linkedin className="h-5 w-5" />,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/username",
      icon: <Twitter className="h-5 w-5" />,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/username",
      icon: <Instagram className="h-5 w-5" />,
      color: "bg-pink-600 hover:bg-pink-700",
    },
  ]

  const projectLinks = [
    {
      name: "Personal Blog",
      url: "https://blog.example.com",
      icon: <FileText className="h-5 w-5" />,
      description: "Articles about web development and design",
    },
    {
      name: "Portfolio",
      url: "https://portfolio.example.com",
      icon: <Globe className="h-5 w-5" />,
      description: "Showcase of my best work and projects",
    },
    {
      name: "YouTube Channel",
      url: "https://youtube.com/c/username",
      icon: <Youtube className="h-5 w-5" />,
      description: "Tutorials and coding livestreams",
    },
    {
      name: "Bookmarks",
      url: "https://links.example.com",
      icon: <Bookmark className="h-5 w-5" />,
      description: "Curated resources for developers",
    },
  ]

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <AnimatedSection variant="scale" duration={0.7} className="text-center">
        <h1 className="text-3xl font-bold mb-2">Connect With Me</h1>
        <p className="text-gray-700 dark:text-gray-300">Find me across the web and get in touch</p>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.1} staggerChildren={0.1}>
        <h2 className="text-xl font-bold mb-4">Social Media</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {socialLinks.map((link, index) => (
            <AnimatedItem key={index}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
                <Button variant="default" className={`w-full ${link.color} text-white`}>
                  {link.icon}
                  <span className="ml-2">{link.name}</span>
                </Button>
              </a>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1}>
        <h2 className="text-xl font-bold mb-4">Projects & Resources</h2>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {projectLinks.map((link, index) => (
            <AnimatedItem key={index}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full shrink-0">{link.icon}</div>
                    <div>
                      <h3 className="font-medium">{link.name}</h3>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
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
          <Card className="bg-primary/5 border-dashed">
            <CardContent className="p-6">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h2 className="text-xl font-bold mb-1">Get in Touch</h2>
              <p className="text-muted-foreground mb-4">Have a project in mind or just want to say hello?</p>
              <Button variant="default">
                <Mail className="mr-2 h-4 w-4" /> Contact Me
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedSection>
    </div>
  )
}