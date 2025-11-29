import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { Plus, Trash2, Settings2, X } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { AboutMeData, Testimonial, Hobby } from "@/lib/types"

interface AboutMeFormProps {
    initialData: AboutMeData
    onChange: (data: AboutMeData) => void
}

export function AboutMeForm({ initialData, onChange }: AboutMeFormProps) {
    const [data, setData] = useState<AboutMeData>(initialData)

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

                <div className="relative inline-block group/avatar">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-[var(--cute-text)] rounded-none cursor-pointer">
                        <AvatarImage src={data.profileImage || "/profile-photo.jpg"} alt="Profile" />
                        <AvatarFallback className="rounded-none bg-[var(--cute-highlight)] text-[var(--cute-text)]">AK</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-none">
                        <FileUpload
                            accept="image/*"
                            onFileSelect={(file) => {
                                const url = URL.createObjectURL(file)
                                updateData({ ...data, profileImage: url })
                            }}
                            label=""
                            maxSize={5}
                            className="w-full h-full opacity-0 absolute inset-0 cursor-pointer"
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
                        <Badge key={index} variant="secondary" className="pixel-badge hover:bg-[var(--cute-highlight)] pr-1 gap-1">
                            {skill}
                            <button onClick={() => removeSkill(index)} className="hover:text-red-500">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                    <div className="flex items-center gap-1">
                        <Input
                            placeholder="Add skill..."
                            className="w-24 h-6 text-xs border-dashed border-2"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    addSkill((e.target as HTMLInputElement).value)
                                        ; (e.target as HTMLInputElement).value = ''
                                }
                            }}
                        />
                    </div>
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
                    <Button variant="ghost" size="sm" onClick={addTestimonial} className="h-6 w-6 p-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
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
                            <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
                                <div className="p-1 h-full relative group">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-background/80 backdrop-blur-sm border border-border">
                                                    <Settings2 className="w-3 h-3" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                                <div className="grid gap-4">
                                                    <div className="space-y-2">
                                                        <h4 className="font-medium leading-none">Edit Testimonial</h4>
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                            <Label>Name</Label>
                                                            <Input
                                                                value={testimonial.name}
                                                                onChange={(e) => updateTestimonial(index, "name", e.target.value)}
                                                                className="col-span-2 h-8"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                            <Label>Role</Label>
                                                            <Input
                                                                value={testimonial.role}
                                                                onChange={(e) => updateTestimonial(index, "role", e.target.value)}
                                                                className="col-span-2 h-8"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-3 items-center gap-4">
                                                            <Label>Avatar</Label>
                                                            <FileUpload
                                                                accept="image/*"
                                                                onFileSelect={(file) => {
                                                                    const url = URL.createObjectURL(file)
                                                                    updateTestimonial(index, "avatar", url)
                                                                }}
                                                                label="Upload"
                                                                maxSize={5}
                                                                className="col-span-2"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <Button variant="destructive" size="sm" onClick={() => removeTestimonial(index)}>
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove
                                                        </Button>
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
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
                    </CarouselContent>
                    <CarouselPrevious className="border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
                    <CarouselNext className="border-2 border-[var(--cute-text)] rounded-none text-[var(--cute-text)] hover:bg-[var(--cute-highlight)]" />
                </Carousel>
            </AnimatedSection>

            {/* Hobbies Section */}
            <AnimatedSection variant="stagger" delay={0.3} staggerChildren={0.1} className="group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold pixel-title border-b-2 border-[var(--cute-text)] inline-block">
                        Hobbies & Interests
                    </h2>
                    <Button variant="ghost" size="sm" onClick={addHobby} className="h-6 w-6 p-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
                    {(data.hobbies || []).map((hobby, index) => (
                        <AnimatedItem key={index}>
                            <Card className="h-full pixel-card hover:shadow-md transition-shadow relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Button variant="ghost" size="sm" onClick={() => removeHobby(index)} className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
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
                        <Button variant="outline" className="w-full h-full min-h-[150px] border-dashed border-2 flex flex-col gap-2" onClick={addHobby}>
                            <Plus className="w-6 h-6" />
                            <span>Add Hobby</span>
                        </Button>
                    </AnimatedItem>
                </div>
            </AnimatedSection>
        </div>
    )
}
