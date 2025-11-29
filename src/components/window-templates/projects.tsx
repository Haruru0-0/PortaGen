import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import type { ProjectsData } from "@/lib/types";

interface ProjectsProps {
  data?: ProjectsData;
}

export default function Projects({ data }: ProjectsProps) {
  const [activeProject, setActiveProject] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  const defaultProjects = [
    {
      id: "1",
      title: "Facilify",
      description:
        "A full-featured facilities management platform, it provides owners, general contractors, and specialty contractors with the tools they need to get the job done.",
      image: "",
      tags: ["React", "Spring boot", "Postgres"],
      demoUrl: "https://www.facilify.com.au/",
      githubUrl: "https://github.com/hussamkhaled/nufm-web-deploy",
    },
    {
      id: "2",
      title: "Awqaf Rashaya",
      description:
        "The Awqaf Management System is a platform for managing mosques, cemeteries, religious schools, and imams, with built-in reporting tools to ensure efficient administration and transparency.",
      image: "",
      tags: ["React", "Spring boot", "Postgres", "OpenAi"],
      demoUrl: "https://awqaf-qa.onrender.com",
      githubUrl: {
        frontend: "https://github.com/username/task-management-frontend",
        backend: "https://github.com/username/task-management-backend",
      },
    },
  ]

  const projects = data?.projects || defaultProjects;
  const title = data?.title || "My Projects";
  const description = data?.description || "A showcase of my best work and side projects";

  useEffect(() => {
    if (!carouselApi) return

    const onSelect = () => {
      setActiveProject(carouselApi.selectedScrollSnap())
    }

    onSelect()
    carouselApi.on("select", onSelect)

    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi])

  return (
    <div className="space-y-8 max-w-5xl mx-auto pixel-text">
      <AnimatedSection variant="fadeIn" duration={0.6} className="text-center">
        <h1 className="text-3xl font-bold mb-2 pixel-title">{title}</h1>
        <p className="opacity-80">{description}</p>
      </AnimatedSection>

      <AnimatedSection variant="scale" delay={0.1} duration={0.7} className="relative" threshold={0.3}>
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {projects.map((project) => (
              <CarouselItem key={project.id}>
                <Card className="pixel-card border-0 shadow-lg overflow-hidden">
                  <div
                    className="grid gap-2 px-4"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(min(100%, 400px), 1fr))",
                    }}
                  >
                    <div className="aspect-video overflow-hidden w-full max-w-full mt-4 border-2 border-[var(--cute-text)] relative">
                      <Image
                        src={project.image || `/placeholder.svg?height=300&width=500`}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 flex flex-col">
                      <h2 className="text-2xl font-bold mb-2 pixel-title">{project.title}</h2>
                      <p className="text-muted-foreground mb-4 opacity-80">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-3">
                        {project.demoUrl && (
                          <Button asChild className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none bg-[var(--cute-text)] text-white hover:bg-[var(--cute-text)]/90">
                            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          typeof project.githubUrl === "string" ? (
                            <Button variant="outline" asChild className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Github className="mr-2 h-4 w-4" /> GitHub
                              </a>
                            </Button>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex-grow sm:flex-grow-0 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                                  <Github className="mr-2 h-4 w-4" /> Code
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="z-[9999] border-2 border-[var(--cute-text)] bg-[var(--card-bg)] rounded-none">
                                <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                                  <a href={project.githubUrl.frontend} target="_blank" rel="noopener noreferrer">
                                    Frontend
                                  </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                                  <a href={project.githubUrl.backend} target="_blank" rel="noopener noreferrer">
                                    Backend
                                  </a>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
          <CarouselNext className="border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
        </Carousel>

        <div className="flex justify-center mt-4 gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 border border-[var(--cute-text)] ${index === activeProject ? "bg-[var(--cute-text)]" : "bg-transparent"}`}
              onClick={() => carouselApi?.scrollTo(index)}
            />
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} threshold={0.1}>
        <div className="grid gap-6 mt-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {projects.map((project) => (
            <AnimatedItem key={project.id}>
              <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-0 pixel-card">
                <div className="aspect-video overflow-hidden border-b-2 border-[var(--cute-text)] relative">
                  <Image
                    src={project.image || `/placeholder.svg?height=200&width=400`}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <CardContent className="pt-6 flex-grow">
                  <h3 className="text-xl font-bold mb-2 pixel-title">{project.title}</h3>
                  <p className="text-sm opacity-70 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs pixel-badge hover:bg-[var(--cute-highlight)]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex gap-2 w-full">
                    {project.githubUrl && (
                      typeof project.githubUrl === "string" ? (
                        <Button variant="outline" size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="mr-2 h-4 w-4" /> Code
                          </a>
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none hover:bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                              <Github className="mr-2 h-4 w-4" /> Code
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="z-[9999] border-2 border-[var(--cute-text)] bg-[var(--card-bg)] rounded-none">
                            <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                              <a href={project.githubUrl.frontend} target="_blank" rel="noopener noreferrer">
                                Frontend
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-none focus:bg-[var(--cute-highlight)] cursor-pointer">
                              <a href={project.githubUrl.backend} target="_blank" rel="noopener noreferrer">
                                Backend
                              </a>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    )}
                    {project.demoUrl && (
                      <Button size="sm" className="flex-1 border-2 border-[var(--cute-text)] rounded-none bg-[var(--cute-text)] text-white hover:bg-[var(--cute-text)]/90" asChild>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </AnimatedItem>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}
