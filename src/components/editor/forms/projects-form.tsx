import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { Plus, Trash2, Settings2, X, ExternalLink, Github } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import type { ProjectsData, ProjectItem } from "@/lib/types"

interface ProjectsFormProps {
    initialData: ProjectsData
    onChange: (data: ProjectsData) => void
}

export function ProjectsForm({ initialData, onChange }: ProjectsFormProps) {
    const [data, setData] = useState<ProjectsData>(initialData)
    const [activeProject, setActiveProject] = useState(0)
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

    useEffect(() => {
        setData(initialData)
    }, [initialData])

    useEffect(() => {
        if (!carouselApi) return
        const onSelect = () => setActiveProject(carouselApi.selectedScrollSnap())
        onSelect()
        carouselApi.on("select", onSelect)
        return () => { carouselApi.off("select", onSelect) }
    }, [carouselApi])

    const updateData = (newData: ProjectsData) => {
        setData(newData)
        onChange(newData)
    }

    const addProject = () => {
        const newProject: ProjectItem = {
            id: `project-${Date.now()}`,
            title: "New Project",
            description: "Project description...",
            image: "",
            tags: ["Tag"],
            demoUrl: "",
            githubUrl: ""
        }
        updateData({ ...data, projects: [...(data.projects || []), newProject] })
    }

    const updateProject = (index: number, field: keyof ProjectItem, value: any) => {
        const newProjects = [...(data.projects || [])]
        newProjects[index] = { ...newProjects[index], [field]: value }
        updateData({ ...data, projects: newProjects })
    }

    const removeProject = (index: number) => {
        const newProjects = (data.projects || []).filter((_, i) => i !== index)
        updateData({ ...data, projects: newProjects })
    }

    const addTag = (projectIndex: number, tag: string) => {
        if (!tag.trim()) return
        const project = (data.projects || [])[projectIndex]
        const newTags = [...(project.tags || []), tag.trim()]
        updateProject(projectIndex, "tags", newTags)
    }

    const removeTag = (projectIndex: number, tagIndex: number) => {
        const project = (data.projects || [])[projectIndex]
        const newTags = (project.tags || []).filter((_, i) => i !== tagIndex)
        updateProject(projectIndex, "tags", newTags)
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pixel-text relative">
            {/* Header Section */}
            <AnimatedSection variant="fadeIn" duration={0.6} className="text-center group relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                    value={data.title || "My Projects"}
                    onChange={(e) => updateData({ ...data, title: e.target.value })}
                    className="text-3xl font-bold mb-2 pixel-title text-center border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary h-auto p-0"
                />
                <Textarea
                    value={data.description || "A showcase of my best work and side projects"}
                    onChange={(e) => updateData({ ...data, description: e.target.value })}
                    className="text-center opacity-80 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary min-h-[40px] resize-none p-0"
                />
            </AnimatedSection>

            {/* Carousel View */}
            <AnimatedSection variant="scale" delay={0.1} duration={0.7} className="relative group/section border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold pixel-title opacity-50">Featured View</h2>
                    <Button variant="ghost" size="sm" onClick={addProject} className="h-6 w-6 p-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <Carousel setApi={setCarouselApi} className="w-full">
                    <CarouselContent>
                        {(data.projects || []).map((project, index) => (
                            <CarouselItem key={project.id}>
                                <Card className="pixel-card border-0 shadow-lg overflow-hidden relative group">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md border border-border">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                    <Settings2 className="w-3 h-3" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium leading-none">Project Links</h4>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                            <Label>Demo URL</Label>
                                                            <Input
                                                                value={project.demoUrl || ""}
                                                                onChange={(e) => updateProject(index, "demoUrl", e.target.value)}
                                                                className="col-span-2 h-8"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                            <Label>GitHub URL</Label>
                                                            <Input
                                                                value={typeof project.githubUrl === 'string' ? project.githubUrl : ''}
                                                                onChange={(e) => updateProject(index, "githubUrl", e.target.value)}
                                                                className="col-span-2 h-8"
                                                                placeholder="https://github.com/..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button variant="destructive" size="sm" onClick={() => removeProject(index)}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove Project
                                                        </Button>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="grid gap-2 px-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))" }}>
                                        <div className="aspect-video overflow-hidden w-full max-w-full mt-4 border-2 border-[var(--cute-text)] relative group/image">
                                            {project.image ? (
                                                <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity">
                                                <FileUpload
                                                    accept="image/*"
                                                    onFileSelect={(file) => {
                                                        const url = URL.createObjectURL(file)
                                                        updateProject(index, "image", url)
                                                    }}
                                                    label="Change Image"
                                                    maxSize={5}
                                                    className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
                                                />
                                                <span className="text-white font-bold pointer-events-none">CHANGE IMAGE</span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col">
                                            <Input
                                                value={project.title}
                                                onChange={(e) => updateProject(index, "title", e.target.value)}
                                                className="text-2xl font-bold mb-2 pixel-title border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                            />
                                            <Textarea
                                                value={project.description}
                                                onChange={(e) => updateProject(index, "description", e.target.value)}
                                                className="text-muted-foreground mb-4 opacity-80 border-none bg-transparent shadow-none focus-visible:ring-0 resize-none p-0 min-h-[80px]"
                                            />
                                            <div className="flex flex-wrap gap-2 mb-6 items-center">
                                                {(project.tags || []).map((tag, tagIndex) => (
                                                    <Badge key={tagIndex} variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)] gap-1 pr-1">
                                                        {tag}
                                                        <button onClick={() => removeTag(index, tagIndex)} className="hover:text-red-500">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                                <Input
                                                    placeholder="Add tag..."
                                                    className="w-20 h-6 text-xs border-dashed border-2 px-1"
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            addTag(index, (e.target as HTMLInputElement).value)
                                                                ; (e.target as HTMLInputElement).value = ''
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="static translate-y-0 mr-2 inline-flex" />
                    <CarouselNext className="static translate-y-0 inline-flex" />
                </Carousel>
            </AnimatedSection>

            {/* Grid View Preview (Simplified) */}
            <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} className="mt-8 opacity-50 pointer-events-none grayscale">
                <div className="text-center mb-4 text-sm text-muted-foreground">Grid View Preview (Edit above)</div>
                <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                    {(data.projects || []).slice(0, 3).map((project) => (
                        <Card key={project.id} className="h-full flex flex-col border-0 pixel-card">
                            <div className="aspect-video bg-muted border-b-2 border-[var(--cute-text)]">
                                {project.image && <img src={project.image} className="w-full h-full object-cover" />}
                            </div>
                            <CardContent className="pt-4">
                                <h3 className="font-bold mb-2">{project.title}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </AnimatedSection>
        </div>
    )
}
