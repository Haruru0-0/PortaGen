import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/editor/editor-form-controls"
import { Input } from "@/components/editor/editor-form-controls"
import { Textarea } from "@/components/editor/editor-form-controls"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogContent } from "@/components/workspace/workspace-overlays"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { Plus, Trash2, Settings2, X, Link } from "lucide-react"
import { WorkspaceInput as PixelInput } from "@/components/workspace/workspace-primitives"
import { AnimatedSection } from "@/components/editor/editor-form-section"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Drawer, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/workspace/workspace-overlays"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { ProjectsData, ProjectItem } from "@/lib/types"

interface ProjectsFormProps {
    initialData: ProjectsData
    onChange: (data: ProjectsData) => void
    onFileSelect?: (path: string, file: File) => void
    onUrlSelect?: (path: string, url: string) => void
}

export function ProjectsForm({ initialData, onChange, onFileSelect, onUrlSelect }: ProjectsFormProps) {
    const [data, setData] = useState<ProjectsData>(initialData)
    const [activeProject, setActiveProject] = useState(0)
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
    const isDesktop = useMediaQuery("(min-width: 768px)")

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
        <div className="space-y-8 max-w-5xl mx-auto workspace-editor-copy relative">
            {/* Header Section */}
            <AnimatedSection variant="fadeIn" duration={0.6} className="text-center group relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="absolute right-2 top-2 opacity-70 lg:group-hover:opacity-100 focus-within:opacity-100 focus-visible:opacity-100 transition-opacity">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                    value={data.title || "My Projects"}
                    onChange={(e) => updateData({ ...data, title: e.target.value })}
                    className="text-3xl font-bold mb-2 workspace-editor-title text-center border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary h-auto p-0"
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
                    <h2 className="text-xl font-bold workspace-editor-title opacity-50">Featured View</h2>
                    <Button variant="ghost" size="sm" onClick={addProject} className="h-8 w-8 p-0 opacity-70 lg:group-hover/section:opacity-100 focus-within:opacity-100 focus-visible:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <Carousel setApi={setCarouselApi} className="w-full">
                    <CarouselContent>
                        {(data.projects || []).map((project, index) => (
                            <CarouselItem key={project.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                                <Card className="workspace-editor-form-card border-0 shadow-lg overflow-hidden relative group">
                                    <div className="absolute right-2 top-2 opacity-70 lg:group-hover:opacity-100 focus-within:opacity-100 focus-visible:opacity-100 transition-opacity z-10 flex gap-1 bg-background/80 backdrop-blur-sm p-1 rounded-md border border-border">
                                        {isDesktop ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                        <Settings2 className="w-3 h-3" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="workspace-controls sm:max-w-[425px] rounded-none border-4 border-[var(--workspace-white,#fffef5)]  bg-card ">
                                                    <DialogHeader className="bg-card ">
                                                        <DialogTitle>Project Links</DialogTitle>
                                                        <DialogDescription>
                                                            Manage your project URLs.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Demo URL</Label>
                                                            <Input
                                                                value={project.demoUrl || ""}
                                                                onChange={(e) => updateProject(index, "demoUrl", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">GitHub URL</Label>
                                                            <Input
                                                                value={typeof project.githubUrl === 'string' ? project.githubUrl : ''}
                                                                onChange={(e) => updateProject(index, "githubUrl", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                                placeholder="https://github.com/..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter className="sm:justify-between bg-card ">
                                                        <Button variant="destructive" size="sm" className="rounded-none border-2 border-destructive  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => {
                                                            removeProject(index)
                                                            const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                                            closeButton?.click()
                                                        }}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove Project
                                                        </Button>
                                                        <Button type="button" className="rounded-none border-2 border-[var(--workspace-white,#fffef5)]  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--workspace-blue,#0755d8)] hover:text-[var(--workspace-white,#fffef5)]" onClick={() => {
                                                            const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                                            closeButton?.click()
                                                        }}>
                                                            Done
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <Drawer>
                                                <DrawerTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                        <Settings2 className="w-3 h-3" />
                                                    </Button>
                                                </DrawerTrigger>
                                                <DrawerContent className="workspace-controls rounded-t-none border-t border-x border-[var(--workspace-white,#fffef5)]  bg-card ">
                                                    <DrawerHeader className="text-left bg-card ">
                                                        <DrawerTitle>Project Links</DrawerTitle>
                                                        <DrawerDescription>
                                                            Manage your project URLs.
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <div className="grid gap-4 p-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Demo URL</Label>
                                                            <Input
                                                                value={project.demoUrl || ""}
                                                                onChange={(e) => updateProject(index, "demoUrl", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">GitHub URL</Label>
                                                            <Input
                                                                value={typeof project.githubUrl === 'string' ? project.githubUrl : ''}
                                                                onChange={(e) => updateProject(index, "githubUrl", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                                placeholder="https://github.com/..."
                                                            />
                                                        </div>
                                                    </div>
                                                    <DrawerFooter className="flex-col gap-2 bg-card ">
                                                        <Button variant="destructive" size="sm" className="w-full rounded-none border-2 border-destructive  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => removeProject(index)}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove Project
                                                        </Button>
                                                        <Button type="button" className="w-full rounded-none border-2 border-[var(--workspace-white,#fffef5)]  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--workspace-blue,#0755d8)] hover:text-[var(--workspace-white,#fffef5)]">
                                                            Done
                                                        </Button>
                                                    </DrawerFooter>
                                                </DrawerContent>
                                            </Drawer>
                                        )}
                                    </div>

                                    <div className="grid gap-2 px-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 400px), 1fr))" }}>
                                        <div className="aspect-video overflow-hidden w-full max-w-full mt-4 border-2 border-[var(--workspace-white,#fffef5)] relative group/image">
                                            {project.image ? (
                                                <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/image:opacity-100 focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
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
                                        {/* URL Input for Project Image */}
                                        <div className="mt-2 mb-2">
                                            <PixelInput
                                                placeholder="Or image URL..."
                                                className="h-8 text-xs"
                                                value={project.image || ""}
                                                onChange={(e) => {
                                                    updateProject(index, "image", e.target.value)
                                                    onUrlSelect?.(`projects[${index}].image`, e.target.value)
                                                }}
                                            />
                                        </div>
                                        <div className="p-6 flex flex-col pt-2">
                                            <Input
                                                value={project.title}
                                                onChange={(e) => updateProject(index, "title", e.target.value)}
                                                className="text-2xl font-bold mb-2 workspace-editor-title border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                            />
                                            <Textarea
                                                value={project.description}
                                                onChange={(e) => updateProject(index, "description", e.target.value)}
                                                className="text-muted-foreground mb-4 opacity-80 border-none bg-transparent shadow-none focus-visible:ring-0 resize-none p-0 min-h-[80px]"
                                            />
                                            <div className="flex flex-wrap gap-2 mb-6 items-center">
                                                {(project.tags || []).map((tag, tagIndex) => (
                                                    <Badge key={tagIndex} variant="secondary" className="workspace-editor-badge hover:bg-[var(--workspace-blue,#0755d8)] gap-1 pr-1">
                                                        {tag}
                                                        <button data-workspace-control onClick={() => removeTag(index, tagIndex)} className="hover:text-red-500">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </Badge>
                                                ))}
                                                <Input
                                                    placeholder="Add tag..."
                                                    className="w-20 h-6 text-xs border-dashed border-2 px-1 rounded-none border-[var(--workspace-white,#fffef5)]"
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
                        <CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <Button
                                    variant="ghost"
                                    className="w-full h-full cursor-pointer min-h-[300px] border-4 border-dashed border-[var(--workspace-white,#fffef5)]/50 hover:border-solid hover:border-[var(--workspace-white,#fffef5)] hover:bg-transparent  transition-all rounded-none flex flex-col gap-2 workspace-editor-copy"
                                    onClick={addProject}
                                >
                                    <Plus className="w-8 h-8" />
                                    <span className="font-medium">Add Project</span>
                                </Button>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="static translate-y-0 mr-2 inline-flex border-2 border-[var(--workspace-white,#fffef5)] rounded-none text-[var(--workspace-white,#fffef5)] hover:bg-[var(--workspace-white,#fffef5)] hover:text-[var(--workspace-ink,#061039)] transition-colors" />
                    <CarouselNext className="static translate-y-0 inline-flex border-2 border-[var(--workspace-white,#fffef5)] rounded-none text-[var(--workspace-white,#fffef5)] hover:bg-[var(--workspace-white,#fffef5)] hover:text-[var(--workspace-ink,#061039)] transition-colors" />
                </Carousel>
            </AnimatedSection>

            {/* Grid View Preview (Simplified) */}
            <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} className="mt-8 opacity-50 pointer-events-none grayscale">
                <div className="text-center mb-4 text-sm text-muted-foreground">Grid View Preview (Edit above)</div>
                <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                    {(data.projects || []).slice(0, 3).map((project) => (
                        <Card key={project.id} className="h-full flex flex-col border-0 workspace-editor-form-card">
                            <div className="aspect-video bg-muted border-b-2 border-[var(--workspace-white,#fffef5)]">
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
