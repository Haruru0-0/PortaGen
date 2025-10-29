"use client"

import { PixelButton } from "@/components/pixel-button"

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
}

interface ProjectsWindowProps {
  data?: {
    projects?: Project[]
  }
}

export function ProjectsWindow({ data }: ProjectsWindowProps) {
  const projects = data?.projects || [
    {
      id: "1",
      title: "PROJECT ALPHA",
      description: "A RETRO-STYLE GAME BUILT WITH JAVASCRIPT",
      tags: ["JS", "CANVAS", "GAME"],
      demoUrl: "#",
      githubUrl: "#",
    },
    {
      id: "2",
      title: "PROJECT BETA",
      description: "PIXEL ART PORTFOLIO GENERATOR",
      tags: ["REACT", "NEXT.JS", "CSS"],
      demoUrl: "#",
      githubUrl: "#",
    },
  ]

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="border-2 border-border p-4 space-y-2">
          <h3 className="text-[10px] pixel-text-shadow">{project.title}</h3>
          <p className="text-[10px] text-muted-foreground">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-muted text-[8px] border border-border">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            {project.demoUrl && (
              <PixelButton variant="primary" className="text-[8px] px-2 py-1" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  DEMO
                </a>
              </PixelButton>
            )}
            {project.githubUrl && (
              <PixelButton variant="secondary" className="text-[8px] px-2 py-1" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  CODE
                </a>
              </PixelButton>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
