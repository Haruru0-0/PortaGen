import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { Plus, Trash2, Settings2, X } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { AboutMeData, Testimonial, Hobby } from "@/lib/types"

interface AboutMeFormProps {
    initialData: AboutMeData
    onChange: (data: AboutMeData) => void
    onFileSelect?: (path: string, file: File) => void
}

export function AboutMeForm({ initialData, onChange, onFileSelect }: AboutMeFormProps) {
    const [data, setData] = useState<AboutMeData>(initialData)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    useEffect(() => {
        setData(initialData)
    }, [initialData])

    const updateData = (newData: AboutMeData) => {
        setData(newData)
        onChange(newData)
    }

    // Skills Management
    const addSkill = (skill: string) => {
        if (!skill.trim()) return
        updateData({ ...data, skills: [...(data.skills || []), skill.trim()] })
    }

    const removeSkill = (index: number) => {
        const newSkills = (data.skills || []).filter((_, i) => i !== index)
        updateData({ ...data, skills: newSkills })
    }

    // Testimonials Management
    const addTestimonial = () => {
        const newTestimonial: Testimonial = {
            name: "New Testimonial",
            role: "Role",
            content: "Testimonial content...",
            avatar: ""
        }
        updateData({ ...data, testimonials: [...(data.testimonials || []), newTestimonial] })
    }

    const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
        const newTestimonials = [...(data.testimonials || [])]
        newTestimonials[index] = { ...newTestimonials[index], [field]: value }
        updateData({ ...data, testimonials: newTestimonials })
    }

    const removeTestimonial = (index: number) => {
        const newTestimonials = (data.testimonials || []).filter((_, i) => i !== index)
        updateData({ ...data, testimonials: newTestimonials })
    }

    // Hobbies Management
    const addHobby = () => {
        const newHobby: Hobby = {
            name: "New Hobby",
            icon: "🎨",
            description: "Description..."
        }
        updateData({ ...data, hobbies: [...(data.hobbies || []), newHobby] })
    }

    const updateHobby = (index: number, field: keyof Hobby, value: any) => {
        const newHobbies = [...(data.hobbies || [])]
        newHobbies[index] = { ...newHobbies[index], [field]: value }
        updateData({ ...data, hobbies: newHobbies })
    }

    const removeHobby = (index: number) => {
        const newHobbies = (data.hobbies || []).filter((_, i) => i !== index)
        updateData({ ...data, hobbies: newHobbies })
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pixel-text relative">
            {/* Profile Section */}
            <AnimatedSection variant="scale" duration={0.7} className="text-center group relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                </div>

                <div className="relative inline-block group/avatar mb-4">
                    <Avatar className="w-24 h-24 mx-auto border-2 border-[var(--cute-text)] rounded-none cursor-pointer">
                        <AvatarImage src={data.profileImage || "/profile-photo.jpg"} alt="Profile" />
                        <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">AK</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-none">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                        alert("File too large (max 5MB)")
                                        return
                                    }
                                    const url = URL.createObjectURL(file)
                                    updateData({ ...data, profileImage: url })
                                    onFileSelect?.("profileImage", file)
                                }
                            }}
                        />
                        <span className="text-white text-xs font-bold pointer-events-none">CHANGE</span>
                    </div>
                </div>

                <Input
                    value={data.title || "Ahmad Kanaan"}
                    onChange={(e) => updateData({ ...data, title: e.target.value })}
                    className="text-3xl font-bold mb-2 pixel-title text-center border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary h-auto p-0"
                />
                <Input
                    value={data.subtitle || "Full-Stack Developer"}
                    onChange={(e) => updateData({ ...data, subtitle: e.target.value })}
                    className="text-center opacity-80 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary h-auto p-0 mb-4"
                />

                <div className="flex flex-wrap justify-center gap-2 items-center">
                    {(data.skills || []).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="pixel-badge hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors pr-1 gap-1">
                            {skill}
                            <button onClick={() => removeSkill(index)} className="hover:text-red-500">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                    {isDesktop ? (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Badge
                                    variant="outline"
                                    className="pixel-badge border-dashed border-2 cursor-pointer hover:border-solid hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Skill
                                </Badge>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-[var(--cute-text)] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] bg-white dark:bg-zinc-950">
                                <DialogHeader className="bg-white dark:bg-zinc-950">
                                    <DialogTitle>Add New Skill</DialogTitle>
                                    <DialogDescription>
                                        Enter a skill to add to your profile.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="skill" className="text-right">
                                            Skill
                                        </Label>
                                        <Input
                                            id="skill"
                                            placeholder="e.g. React, TypeScript"
                                            className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    const value = (e.target as HTMLInputElement).value
                                                    if (value.trim()) {
                                                        addSkill(value)
                                                            ; (e.target as HTMLInputElement).value = ''
                                                        const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                                        closeButton?.click()
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <DialogFooter className="bg-white dark:bg-zinc-950">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('skill') as HTMLInputElement
                                            if (input?.value.trim()) {
                                                addSkill(input.value)
                                                input.value = ''
                                                const closeButton = document.querySelector('[data-slot="dialog-close"]') as HTMLButtonElement
                                                closeButton?.click()
                                            }
                                        }}
                                        className="rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--cute-highlight)] hover:text-[var(--cute-text)]"
                                    >
                                        Add Skill
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Badge
                                    variant="outline"
                                    className="pixel-badge border-dashed border-2 cursor-pointer hover:border-solid hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors gap-1"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Skill
                                </Badge>
                            </DrawerTrigger>
                            <DrawerContent className="rounded-t-none border-t-4 border-x-4 border-[var(--cute-text)] shadow-[0px_-4px_0px_0px_rgba(0,0,0,0.2)] bg-white dark:bg-zinc-950">
                                <DrawerHeader className="text-left bg-white dark:bg-zinc-950">
                                    <DrawerTitle>Add New Skill</DrawerTitle>
                                    <DrawerDescription>
                                        Enter a skill to add to your profile.
                                    </DrawerDescription>
                                </DrawerHeader>
                                <div className="grid gap-4 p-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="skill-mobile" className="text-right">
                                            Skill
                                        </Label>
                                        <Input
                                            id="skill-mobile"
                                            placeholder="e.g. React, TypeScript"
                                            className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    const value = (e.target as HTMLInputElement).value
                                                    if (value.trim()) {
                                                        addSkill(value)
                                                            ; (e.target as HTMLInputElement).value = ''
                                                        // Drawer doesn't use data-slot="dialog-close" typically, but radix drawer might.
                                                        // We'll rely on user closing or automated close if needed, but for now standard behavior.
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <DrawerFooter className="bg-white dark:bg-zinc-950">
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const input = document.getElementById('skill-mobile') as HTMLInputElement
                                            if (input?.value.trim()) {
                                                addSkill(input.value)
                                                input.value = ''
                                            }
                                        }}
                                        className="w-full rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--cute-highlight)] hover:text-[var(--cute-text)]"
                                    >
                                        Add Skill
                                    </Button>
                                </DrawerFooter>
                            </DrawerContent>
                        </Drawer>
                    )}
                </div>
            </AnimatedSection>

            {/* About Me Section */}
            <AnimatedSection variant="slideUp" delay={0.1} className="group relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <h2 className="text-2xl font-bold mb-4 pixel-title border-b-2 border-[var(--cute-text)] inline-block">About Me</h2>
                <Textarea
                    value={data.description || ""}
                    onChange={(e) => updateData({ ...data, description: e.target.value })}
                    className="mb-4 leading-relaxed whitespace-pre-wrap border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary min-h-[100px] resize-none p-0"
                    placeholder="Tell your story..."
                />
            </AnimatedSection>

            {/* Testimonials Section */}
            <AnimatedSection variant="stagger" delay={0.2} staggerChildren={0.1} className="group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold pixel-title border-b-2 border-[var(--cute-text)] inline-block">
                        Testimonials
                    </h2>
                    <Button variant="outline" size="sm" onClick={addTestimonial} className="pixel-badge cursor-pointer">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-[calc(100%-96px)] mx-auto"
                >
                    <CarouselContent>
                        {(data.testimonials || []).map((testimonial, index) => (
                            <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                                <div className="p-1 h-full relative group">
                                    <div className="absolute right-2 top-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                                        {isDesktop ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-background/80 backdrop-blur-sm border border-border hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors">
                                                        <Settings2 className="w-3 h-3" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="rounded-none border-4 border-[var(--cute-text)] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] bg-white dark:bg-zinc-950">
                                                    <DialogHeader className="bg-white dark:bg-zinc-950">
                                                        <DialogTitle>Edit Testimonial</DialogTitle>
                                                        <DialogDescription>
                                                            Update the testimonial details below.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Name</Label>
                                                            <Input
                                                                value={testimonial.name}
                                                                onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Role</Label>
                                                            <Input
                                                                value={testimonial.role}
                                                                onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Content</Label>
                                                            <Textarea
                                                                value={testimonial.content}
                                                                onChange={(e) => updateTestimonial(index, "content", e.target.value)}
                                                                className="col-span-3 min-h-[100px] rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Avatar</Label>
                                                            <div className="col-span-3">
                                                                <FileUpload
                                                                    accept="image/*"
                                                                    onFileSelect={(file) => {
                                                                        const url = URL.createObjectURL(file)
                                                                        updateTestimonial(index, "avatar", url)
                                                                        onFileSelect?.(`testimonials[${index}].avatar`, file)
                                                                    }}
                                                                    label="Upload Avatar"
                                                                    maxSize={5}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DialogFooter className="sm:justify-between bg-white dark:bg-zinc-950">
                                                        <Button variant="destructive" size="sm" className="rounded-none border-2 border-destructive shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => {
                                                            removeTestimonial(index)
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
                                        ) : (
                                            <Drawer>
                                                <DrawerTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-background/80 backdrop-blur-sm border border-border hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors">
                                                        <Settings2 className="w-3 h-3" />
                                                    </Button>
                                                </DrawerTrigger>
                                                <DrawerContent className="rounded-t-none border-t-4 border-x-4 border-[var(--cute-text)] shadow-[0px_-4px_0px_0px_rgba(0,0,0,0.2)] bg-white dark:bg-zinc-950">
                                                    <DrawerHeader className="text-left bg-white dark:bg-zinc-950">
                                                        <DrawerTitle>Edit Testimonial</DrawerTitle>
                                                        <DrawerDescription>
                                                            Update the testimonial details below.
                                                        </DrawerDescription>
                                                    </DrawerHeader>
                                                    <div className="grid gap-4 p-4 overflow-y-auto max-h-[70vh]">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Name</Label>
                                                            <Input
                                                                value={testimonial.name}
                                                                onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Role</Label>
                                                            <Input
                                                                value={testimonial.role}
                                                                onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                                                                className="col-span-3 rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Content</Label>
                                                            <Textarea
                                                                value={testimonial.content}
                                                                onChange={(e) => updateTestimonial(index, "content", e.target.value)}
                                                                className="col-span-3 min-h-[100px] rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label className="text-right">Avatar</Label>
                                                            <div className="col-span-3">
                                                                <FileUpload
                                                                    accept="image/*"
                                                                    onFileSelect={(file) => {
                                                                        const url = URL.createObjectURL(file)
                                                                        updateTestimonial(index, "avatar", url)
                                                                        onFileSelect?.(`testimonials[${index}].avatar`, file)
                                                                    }}
                                                                    label="Upload Avatar"
                                                                    maxSize={5}
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <DrawerFooter className="flex-col gap-2 bg-white dark:bg-zinc-950">
                                                        <Button variant="destructive" size="sm" className="w-full rounded-none border-2 border-destructive shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={() => removeTestimonial(index)}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                                                        </Button>
                                                        <Button type="button" className="w-full rounded-none border-2 border-[var(--cute-text)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all hover:bg-[var(--cute-highlight)] hover:text-[var(--cute-text)]">
                                                            Done
                                                        </Button>
                                                    </DrawerFooter>
                                                </DrawerContent>
                                            </Drawer>
                                        )}
                                    </div>

                                    <Card className="h-full pixel-card">
                                        <CardContent className="pt-6 flex-grow flex flex-col">
                                            <div className="flex items-start gap-4 mb-4">
                                                <Avatar className="shrink-0 border-2 border-[var(--cute-text)] rounded-none w-10 h-10">
                                                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                                                    <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">
                                                        {testimonial.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium pixel-text truncate">{testimonial.name}</p>
                                                    <p className="text-sm opacity-70 truncate">{testimonial.role}</p>
                                                </div>
                                            </div>
                                            <Textarea
                                                value={testimonial.content}
                                                onChange={(e) => updateTestimonial(index, "content", e.target.value)}
                                                className="italic flex-grow opacity-90 border-none bg-transparent shadow-none focus-visible:ring-0 resize-none p-0 min-h-[80px]"
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                        <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
                            <div className="p-1 h-full">
                                <Button
                                    variant="ghost"
                                    className="w-full h-full cursor-pointer min-h-[200px] border-4 border-dashed border-[var(--cute-text)]/50 hover:border-solid hover:border-[var(--cute-text)] hover:bg-transparent hover:shadow-[4px_4px_0px_0px_var(--cute-text)] transition-all rounded-none flex flex-col gap-2 pixel-text"
                                    onClick={addTestimonial}
                                >
                                    <Plus className="w-8 h-8" />
                                    <span className="font-medium">Add Testimonial</span>
                                </Button>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious className="border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors" />
                    <CarouselNext className="border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-text)] hover:text-[var(--card-bg)] transition-colors" />
                </Carousel>
            </AnimatedSection>

            {/* Hobbies Section */}
            <AnimatedSection variant="stagger" delay={0.3} staggerChildren={0.1} className="group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold pixel-title border-b-2 border-[var(--cute-text)] inline-block">
                        Hobbies & Interests
                    </h2>
                    <Button variant="outline" size="sm" onClick={addHobby} className="pixel-badge cursor-pointer">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
                    {(data.hobbies || []).map((hobby, index) => (
                        <AnimatedItem key={index}>
                            <Card className="h-full pixel-card hover:shadow-md transition-shadow relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeHobby(index)}
                                        className="h-6 w-6 p-0 bg-white/50 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-[var(--cute-text)] transition-all rounded-none"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <CardContent className="pt-6 text-center">
                                    <Input
                                        value={hobby.icon}
                                        onChange={(e) => updateHobby(index, "icon", e.target.value)}
                                        className="text-4xl mb-2 text-center border-none bg-transparent shadow-none focus-visible:ring-0 h-12 w-full"
                                    />
                                    <Input
                                        value={hobby.name}
                                        onChange={(e) => updateHobby(index, "name", e.target.value)}
                                        className="font-bold mb-1 pixel-text text-center border-none bg-transparent shadow-none focus-visible:ring-0 h-auto p-0"
                                    />
                                    <Textarea
                                        value={hobby.description}
                                        onChange={(e) => updateHobby(index, "description", e.target.value)}
                                        className="text-sm opacity-70 text-center border-none bg-transparent shadow-none focus-visible:ring-0 resize-none p-0 min-h-[40px]"
                                    />
                                </CardContent>
                            </Card>
                        </AnimatedItem>
                    ))}
                    <AnimatedItem>
                        <Button
                            variant="ghost"
                            className="w-full h-full cursor-pointer min-h-[150px] border-4 border-dashed border-[var(--cute-text)]/50 hover:border-solid hover:border-[var(--cute-text)] hover:bg-transparent hover:shadow-[4px_4px_0px_0px_var(--cute-text)] transition-all rounded-none flex flex-col gap-2 pixel-text"
                            onClick={addHobby}
                        >
                            <Plus className="w-6 h-6" />
                            <span>Add Hobby</span>
                        </Button>
                    </AnimatedItem>
                </div>
            </AnimatedSection>
        </div>
    )
}
