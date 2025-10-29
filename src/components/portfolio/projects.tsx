export default function Projects() {
  const projects = [
    {
      title: "E-commerce Platform",
      description: "Full-stack online store with payment integration",
      tech: ["React", "Node.js", "Stripe"],
    },
    { title: "Task Manager App", description: "Collaborative task management tool", tech: ["Next.js", "PostgreSQL"] },
    {
      title: "Portfolio Generator",
      description: "Create beautiful portfolios with ease",
      tech: ["React", "TypeScript"],
    },
  ]

  return (
    <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">My Projects</h3>
      {projects.map((project, index) => (
        <div key={index} className="border border-border rounded-lg p-4 hover:bg-accent transition-colors">
          <h4 className="font-semibold mb-1">{project.title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span key={tech} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
