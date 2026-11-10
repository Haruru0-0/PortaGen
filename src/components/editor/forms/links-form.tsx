import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/editor/editor-form-controls"
import { Input } from "@/components/editor/editor-form-controls"
import { Textarea } from "@/components/editor/editor-form-controls"
import { Dialog, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogContent } from "@/components/workspace/workspace-overlays"
import { Drawer, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { DrawerContent } from "@/components/workspace/workspace-overlays"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Label } from "@/components/ui/label"
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, Mail, FileText, Bookmark, Plus, Trash2, Settings2 } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/editor/editor-form-section"
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
    const isDesktop = useMediaQuery("(min-width: 768px)")

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
        <div className="space-y-8 max-w-3xl mx-auto workspace-editor-copy relative">
            {/* Header Section */}
            <AnimatedSection variant="scale" duration={0.7} className="text-center group relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="absolute right-2 top-2 opacity-70 group-hover:opacity-100 focus-within:opacity-100 focus-visible:opacity-100 transition-opacity">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                    value={data.title || "Connect With Me"}
                    onChange={(e) => updateData({ ...data, title: e.target.value })}
                    className="text-3xl font-bold mb-2 workspace-editor-title text-center border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary h-auto p-0"
                />
                <Textarea
                    value={data.description || "Find me across the web and get in touch"}
                    onChange={(e) => updateData({ ...data, description: e.target.value })}
                    className="text-center opacity-80 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary min-h-[60px] resize-none p-0"
                />
            </AnimatedSection>

            {/* Social Media Section */}
            <AnimatedSection variant="stagger" delay={0.1} staggerChildren={0.1} className="relative group/section border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[var(--workspace-white,#fffef5)] pb-2">
                    <h2 className="text-xl font-bold workspace-editor-title">Social Media</h2>
                    <Button variant="outline" size="sm" onClick={addSocial} className="workspace-editor-badge cursor-pointer">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
                    {(data.socials || []).map((link, index) => (
                        <AnimatedItem key={index}>
                            {isDesktop ? (
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="relative group cursor-pointer">
                                            <Button variant="default" className={`w-full ${link.color || 'bg-primary'} text-white rounded-none border-2 border-black  hover:translate-x-[1px] hover:translate-y-[1px]  transition-all`}>
                                                {getIcon(link.icon)}
                                                <span className="ml-2 truncate">{link.name || link.platform}</span>
                                            </Button>
                                            <div className="absolute -top-2 -right-2 opacity-70 group-hover:opacity-100 focus-within:opacity-100 focus-visible:opacity-100 transition-opacity z-10">
                                                <div className="bg-background border border-border rounded-full p-1 shadow-sm">
                                                    <Settings2 className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="workspace-controls sm:max-w-[425px] rounded-none border-4 border-[var(--workspace-white,#fffef5)]  bg-card ">
                                        <DialogHeader className="bg-card ">
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
                                                    className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={`url-${index}`} className="text-right">URL</Label>
                                                <Input
                                                    id={`url-${index}`}
                                                    value={link.url || ""}
                                                    onChange={(e) => updateSocial(index, "url", e.target.value)}
                                                    className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={`icon-${index}`} className="text-right">Icon</Label>
                                                <select
                                                    id={`icon-${index}`}
                                                    value={link.icon || "Globe"}
                                                    onChange={(e) => updateSocial(index, "icon", e.target.value)}
                                                    className="col-span-3 h-10 w-full border-2 border-[var(--workspace-white,#fffef5)] rounded-none px-2 text-sm bg-background focus:outline-none focus:ring-0"
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
                                                    className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                    placeholder="bg-primary"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter className="sm:justify-between bg-card ">
                                            <Button variant="destructive" size="sm" className="rounded-none border-2 border-destructive  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => {
                                                removeSocial(index)
                                                const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                                closeButton?.click()
                                            }}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Remove
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
                                        <div className="relative group cursor-pointer">
                                            <Button variant="default" className={`w-full ${link.color || 'bg-primary'} text-white rounded-none border-2 border-black  hover:translate-x-[1px] hover:translate-y-[1px]  transition-all`}>
                                                {getIcon(link.icon)}
                                                <span className="ml-2 truncate">{link.name || link.platform}</span>
                                            </Button>
                                            <div className="absolute -top-2 -right-2 opacity-70 group-hover:opacity-100 focus-within:opacity-100 focus-visible:opacity-100 transition-opacity z-10">
                                                <div className="bg-background border border-border rounded-full p-1 shadow-sm">
                                                    <Settings2 className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </DrawerTrigger>
                                    <DrawerContent className="workspace-controls rounded-t-none border-t border-x border-[var(--workspace-white,#fffef5)]  bg-card ">
                                        <DrawerHeader className="text-left bg-card ">
                                            <DrawerTitle>Edit Link</DrawerTitle>
                                            <DrawerDescription>
                                                Update social link details.
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="grid gap-4 p-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={`name-${index}`} className="text-right">Name</Label>
                                                <Input
                                                    id={`name-${index}`}
                                                    value={link.name || ""}
                                                    onChange={(e) => updateSocial(index, "name", e.target.value)}
                                                    className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={`url-${index}`} className="text-right">URL</Label>
                                                <Input
                                                    id={`url-${index}`}
                                                    value={link.url || ""}
                                                    onChange={(e) => updateSocial(index, "url", e.target.value)}
                                                    className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor={`icon-${index}`} className="text-right">Icon</Label>
                                                <select
                                                    id={`icon-${index}`}
                                                    value={link.icon || "Globe"}
                                                    onChange={(e) => updateSocial(index, "icon", e.target.value)}
                                                    className="col-span-3 h-10 w-full border-2 border-[var(--workspace-white,#fffef5)] rounded-none px-2 text-sm bg-background focus:outline-none focus:ring-0"
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
                                                    className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                    placeholder="bg-primary"
                                                />
                                            </div>
                                        </div>
                                        <DrawerFooter className="flex-col gap-2 bg-card ">
                                            <Button variant="destructive" size="sm" className="w-full rounded-none border-2 border-destructive  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => removeSocial(index)}>
                                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                                            </Button>
                                            <Button type="button" className="w-full rounded-none border-2 border-[var(--workspace-white,#fffef5)]  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--workspace-blue,#0755d8)] hover:text-[var(--workspace-white,#fffef5)]">
                                                Done
                                            </Button>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            )}
                        </AnimatedItem>
                    ))}
                    <AnimatedItem>
                        <Button variant="ghost" className="w-full h-full min-h-[40px] cursor-pointer border-4 border-dashed border-[var(--workspace-white,#fffef5)]/50 hover:border-solid hover:border-[var(--workspace-white,#fffef5)] hover:bg-transparent  transition-all rounded-none flex flex-col gap-2 workspace-editor-copy" onClick={addSocial}>
                            <Plus className="w-4 h-4 mr-2" /> Add Link
                        </Button>
                    </AnimatedItem>
                </div>
            </AnimatedSection>

            {/* Projects Section */}
            <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} className="relative group/section border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4 border-b-2 border-[var(--workspace-white,#fffef5)] pb-2">
                    <h2 className="text-xl font-bold workspace-editor-title">Projects & Resources</h2>
                    <Button variant="outline" size="sm" onClick={addProject} className="workspace-editor-badge cursor-pointer">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
                    {(data.projects || []).map((link, index) => (
                        <AnimatedItem key={index}>
                            <Card className="h-full hover:shadow-md transition-shadow workspace-editor-form-card border-0 relative group">
                                <CardContent className="p-4">
                                    <div className="absolute right-2 top-2 opacity-70 group-hover:opacity-100 focus-within:opacity-100 focus-visible:opacity-100 transition-opacity z-10 flex gap-1">
                                        {isDesktop ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                        <Settings2 className="w-3 h-3" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="workspace-controls sm:max-w-[425px] rounded-none border-4 border-[var(--workspace-white,#fffef5)]  bg-card ">
                                                    <DialogHeader className="bg-card ">
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
                                                                className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Icon</Label>
                                                            <select
                                                                value={link.icon || "Globe"}
                                                                onChange={(e) => updateProject(index, "icon", e.target.value)}
                                                                className="col-span-3 h-10 w-full border-2 border-[var(--workspace-white,#fffef5)] rounded-none px-2 text-sm bg-background focus:outline-none focus:ring-0"
                                                            >
                                                                {AVAILABLE_ICONS.map(icon => (
                                                                    <option key={icon} value={icon}>{icon}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <DialogFooter className="sm:justify-between bg-card ">
                                                        <Button variant="destructive" size="sm" className="rounded-none border-2 border-destructive  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => {
                                                            removeProject(index)
                                                            const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                                            closeButton?.click()
                                                        }}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove
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
                                                        <DrawerTitle>Edit Project</DrawerTitle>
                                                        <DrawerDescription>
                                                            Update project details.
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <div className="grid gap-4 p-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">URL</Label>
                                                            <Input
                                                                value={link.url || ""}
                                                                onChange={(e) => updateProject(index, "url", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--workspace-white,#fffef5)]  focus-visible:ring-0 focus-visible:border-[var(--workspace-blue,#0755d8)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Icon</Label>
                                                            <select
                                                                value={link.icon || "Globe"}
                                                                onChange={(e) => updateProject(index, "icon", e.target.value)}
                                                                className="col-span-3 h-10 w-full border-2 border-[var(--workspace-white,#fffef5)] rounded-none px-2 text-sm bg-background focus:outline-none focus:ring-0"
                                                            >
                                                                {AVAILABLE_ICONS.map(icon => (
                                                                    <option key={icon} value={icon}>{icon}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <DrawerFooter className="flex-col gap-2 bg-card ">
                                                        <Button variant="destructive" size="sm" className="w-full rounded-none border-2 border-destructive  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => removeProject(index)}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                                                        </Button>
                                                        <Button type="button" className="w-full rounded-none border-2 border-[var(--workspace-white,#fffef5)]  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--workspace-blue,#0755d8)] hover:text-[var(--workspace-white,#fffef5)]">
                                                            Done
                                                        </Button>
                                                    </DrawerFooter>
                                                </DrawerContent>
                                            </Drawer>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="bg-[var(--workspace-blue,#0755d8)] p-2 rounded-none shrink-0 border-2 border-[var(--workspace-white,#fffef5)] text-[var(--workspace-white,#fffef5)]">
                                            {getIcon(link.icon)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Input
                                                value={link.title || ""}
                                                onChange={(e) => updateProject(index, "title", e.target.value)}
                                                className="font-medium workspace-editor-copy h-6 p-0 border-none shadow-none focus-visible:ring-0 bg-transparent"
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
                        <Button variant="ghost" className="w-full h-full min-h-[100px] cursor-pointer border-4 border-dashed border-[var(--workspace-white,#fffef5)]/50 hover:border-solid hover:border-[var(--workspace-white,#fffef5)] hover:bg-transparent  transition-all rounded-none flex flex-col gap-2 workspace-editor-copy" onClick={addProject}>
                            <Plus className="w-6 h-6" />
                            <span>Add Project</span>
                        </Button>
                    </AnimatedItem>
                </div>
            </AnimatedSection>
        </div>
    )
}
