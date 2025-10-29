import { Github, Linkedin, Twitter, Globe } from "lucide-react"

export default function Links() {
  const links = [
    { icon: Github, label: "GitHub", url: "https://github.com" },
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com" },
    { icon: Twitter, label: "Twitter", url: "https://twitter.com" },
    { icon: Globe, label: "Website", url: "https://example.com" },
  ]

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-4">My Links</h3>
      <div className="grid grid-cols-2 gap-3">
        {links.map((link, index) => {
          const Icon = link.icon
          return (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{link.label}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
