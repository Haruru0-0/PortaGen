import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail, FileText, Bookmark, Plus, Trash2, Settings2 } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import type { LinksData, SocialLink, ProjectLink } from "@/lib/types"

const ICON_MAP: Record<string, any> = {
    Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail, FileText, Bookmark
}

const AVAILABLE_ICONS = Object.keys(ICON_MAP)

interface LinksFormProps {
    initialData: LinksData
    onChange: (data: LinksData) => void
}

export function LinksForm({ initialData, onChange }: LinksFormProps) {
    const [data, setData] = useState<LinksData>(initialData)

    useEffect(() => {
        setData(initialData)
    }, [initialData])

    const updateData = (newData: LinksData) => {
        setData(newData)
        onChange(newData)
    }

    const getIcon = (iconName?: string) => {
        const Icon = ICON_MAP[iconName || "Globe"] || Globe
        return <Icon className="h-5 w-5" />
    }

    // Socials Management
    const addSocial = () => {
        const newSocial: SocialLink = {
            platform: "custom",
            name: "New Link",
            url: "https://",
            icon: "Globe",
            color: "bg-primary"
        }
        updateData({ ...data, socials: [...(data.socials || []), newSocial] })
    }

    const updateSocial = (index: number, field: keyof SocialLink, value: any) => {
        const newSocials = [...(data.socials || [])]
        newSocials[index] = { ...newSocials[index], [field]: value }
        updateData({ ...data, socials: newSocials })
    }

    const removeSocial = (index: number) => {
        const newSocials = (data.socials || []).filter((_, i) => i !== index)
        updateData({ ...data, socials: newSocials })
    }

    // Projects Management
    const addProject = () => {
        const newProject: ProjectLink = {
            title: "New Project",
            description: "Project description",
            url: "https://",
            icon: "Globe"
        }
        updateData({ ...data, projects: [...(data.projects || []), newProject] })
    }

    const updateProject = (index: number, field: keyof ProjectLink, value: any) => {
        const newProjects = [...(data.projects || [])]
        newProjects[index] = { ...newProjects[index], [field]: value }
        updateData({ ...data, projects: newProjects })
    }

    const removeProject = (index: number) => {
        const newProjects = (data.projects || []).filter((_, i) => i !== index)
        updateData({ ...data, projects: newProjects })
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto pixel-text relative">
            {/* Header Section */}
            <AnimatedSection variant="scale" duration={0.7} className="text-center group relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                    value={data.title || "Connect With Me"}
                    onChange={(e) => updateData({ ...data, title: e.target.value })}
                    className="text-3xl font-bold mb-2 pixel-title text-center border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary h-auto p-0"
                />
                <Textarea
                    value={data.description || "Find me across the web and get in touch"}
                    onChange={(e) => updateData({ ...data, description: e.target.value })}
                    className="text-center opacity-80 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary min-h-[60px] resize-none p-0"
                />
            </AnimatedSection>

            {/* Social Media Section */}
            <AnimatedSection variant="stagger" delay={0.1} staggerChildren={0.1} className="relative group/section border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[var(--cute-text)] pb-2">
                    <h2 className="text-xl font-bold pixel-title">Social Media</h2>
                    <Button variant="outline" size="sm" onClick={addSocial} className="pixel-badge cursor-pointer">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
                    {(data.socials || []).map((link, index) => (
                        <AnimatedItem key={index}>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="relative group cursor-pointer">
                                        <Button variant="default" className={`w-full ${link.color || 'bg-primary'} text-white rounded-none border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_rgba(0,0,0,0.2)] transition-all`}>
                                            {getIcon(link.icon)}
                                            <span className="ml-2 truncate">{link.name || link.platform}</span>
                                        </Button>
                                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <div className="bg-background border border-border rounded-full p-1 shadow-sm">
                                                <Settings2 className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-[var(--cute-text)] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                                    <DialogHeader>
                                        <DialogTitle>Edit Link</DialogTitle>
                                        <DialogDescription>
                                            Update social link details.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor={`name-${index}`} className="text-right">Name</Label>
                                            <Input
                                                id={`name-${index}`}
                                                value={link.name || ""}
                                                onChange={(e) => updateSocial(index, "name", e.target.value)}
                                                className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor={`url-${index}`} className="text-right">URL</Label>
                                            <Input
                                                id={`url-${index}`}
                                                value={link.url || ""}
                                                onChange={(e) => updateSocial(index, "url", e.target.value)}
                                                className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor={`icon-${index}`} className="text-right">Icon</Label>
                                            <select
                                                id={`icon-${index}`}
                                                value={link.icon || "Globe"}
                                                onChange={(e) => updateSocial(index, "icon", e.target.value)}
                                                className="col-span-3 h-10 w-full border-2 border-[var(--cute-text)] rounded-none px-2 text-sm bg-background focus:outline-none focus:ring-0"
                                            >
                                                {AVAILABLE_ICONS.map(icon => (
                                                    <option key={icon} value={icon}>{icon}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor={`color-${index}`} className="text-right">Color</Label>
                                            <Input
                                                id={`color-${index}`}
                                                value={link.color || ""}
                                                onChange={(e) => updateSocial(index, "color", e.target.value)}
                                                className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                                placeholder="bg-primary"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="sm:justify-between">
                                        <Button variant="destructive" size="sm" className="rounded-none border-2 border-destructive shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => {
                                            removeSocial(index)
                                            const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                            closeButton?.click()
                                        }}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                                        </Button>
                                        <Button type="button" className="rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--cute-highlight)] hover:text-[var(--cute-text)]" onClick={() => {
                                            const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                            closeButton?.click()
                                        }}>
                                            Done
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </AnimatedItem>
                    ))}
                    <AnimatedItem>
                        <Button variant="ghost" className="w-full h-full min-h-[40px] cursor-pointer border-4 border-dashed border-[var(--cute-text)]/50 hover:border-solid hover:border-[var(--cute-text)] hover:bg-transparent hover:shadow-[4px_4px_0px_0px_var(--cute-text)] transition-all rounded-none flex flex-col gap-2 pixel-text" onClick={addSocial}>
                            <Plus className="w-4 h-4 mr-2" /> Add Link
                        </Button>
                    </AnimatedItem>
                </div>
            </AnimatedSection>

            {/* Projects Section */}
            <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} className="relative group/section border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[var(--cute-text)] pb-2">
                    <h2 className="text-xl font-bold pixel-title">Projects & Resources</h2>
                    <Button variant="outline" size="sm" onClick={addProject} className="pixel-badge cursor-pointer">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                    {(data.projects || []).map((link, index) => (
                        <AnimatedItem key={index}>
                            <Card className="h-full hover:shadow-md transition-shadow pixel-card border-0 relative group">
                                <CardContent className="p-4">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                    <Settings2 className="w-3 h-3" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-[var(--cute-text)] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                                                <DialogHeader>
                                                    <DialogTitle>Edit Project</DialogTitle>
                                                    <DialogDescription>
                                                        Update project details.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">URL</Label>
                                                        <Input
                                                            value={link.url || ""}
                                                            onChange={(e) => updateProject(index, "url", e.target.value)}
                                                            className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label className="text-right">Icon</Label>
                                                        <select
                                                            value={link.icon || "Globe"}
                                                            onChange={(e) => updateProject(index, "icon", e.target.value)}
                                                            className="col-span-3 h-10 w-full border-2 border-[var(--cute-text)] rounded-none px-2 text-sm bg-background focus:outline-none focus:ring-0"
                                                        >
                                                            {AVAILABLE_ICONS.map(icon => (
                                                                <option key={icon} value={icon}>{icon}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <DialogFooter className="sm:justify-between">
                                                    <Button variant="destructive" size="sm" className="rounded-none border-2 border-destructive shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => {
                                                        removeProject(index)
                                                        const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                                        closeButton?.click()
                                                    }}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                                                    </Button>
                                                    <Button type="button" className="rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--cute-highlight)] hover:text-[var(--cute-text)]" onClick={() => {
                                                        const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                                        closeButton?.click()
                                                    }}>
                                                        Done
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-[var(--cute-highlight)] p-2 rounded-none shrink-0 border-2 border-[var(--cute-text)] text-[var(--cute-text)]">
                                            {getIcon(link.icon)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Input
                                                value={link.title || ""}
                                                onChange={(e) => updateProject(index, "title", e.target.value)}
                                                className="font-medium pixel-text h-6 p-0 border-none shadow-none focus-visible:ring-0 bg-transparent"
                                                placeholder="Project Title"
                                            />
                                            <Textarea
                                                value={link.description || ""}
                                                onChange={(e) => updateProject(index, "description", e.target.value)}
                                                className="text-sm opacity-70 min-h-[40px] p-0 border-none shadow-none focus-visible:ring-0 resize-none bg-transparent"
                                                placeholder="Description"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedItem>
                    ))}
                    <AnimatedItem>
                        <Button variant="ghost" className="w-full h-full min-h-[100px] cursor-pointer border-4 border-dashed border-[var(--cute-text)]/50 hover:border-solid hover:border-[var(--cute-text)] hover:bg-transparent hover:shadow-[4px_4px_0px_0px_var(--cute-text)] transition-all rounded-none flex flex-col gap-2 pixel-text" onClick={addProject}>
                            <Plus className="w-6 h-6" />
                            <span>Add Project</span>
                        </Button>
                    </AnimatedItem>
                </div>
            </AnimatedSection>
        </div>
    )
}
