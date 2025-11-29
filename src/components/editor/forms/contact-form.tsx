import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Mail, Phone, MapPin, Send, Linkedin, Github, Twitter, Link as LinkIcon, Plus, Trash2, Settings2 } from "lucide-react"
import { AnimatedSection, AnimatedItem } from "@/components/portfolio/animated-section"
import type { ContactData, ContactInfoItem, SocialLink } from "@/lib/types"

const ICON_MAP: Record<string, any> = {
    email: Mail,
    phone: Phone,
    location: MapPin,
    custom: LinkIcon,
    linkedin: Linkedin,
    github: Github,
    twitter: Twitter
}

const INFO_TYPES = [
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'location', label: 'Location', icon: MapPin },
    { value: 'custom', label: 'Custom', icon: LinkIcon },
]

const SOCIAL_PLATFORMS = [
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'custom', label: 'Custom', icon: LinkIcon },
]

interface ContactFormProps {
    initialData: ContactData
    onChange: (data: ContactData) => void
}

export function ContactForm({ initialData, onChange }: ContactFormProps) {
    const [data, setData] = useState<ContactData>(initialData)

    useEffect(() => {
        setData(initialData)
    }, [initialData])

    const updateData = (newData: ContactData) => {
        setData(newData)
        onChange(newData)
    }

    const getIcon = (type: string) => {
        const Icon = ICON_MAP[type.toLowerCase()] || LinkIcon
        return <Icon className="h-5 w-5" />
    }

    // Contact Info Management
    const addContactInfo = () => {
        const newItem: ContactInfoItem = {
            type: 'email',
            value: 'New Contact',
            label: 'Email',
            link: ''
        }
        updateData({ ...data, contactInfo: [...(data.contactInfo || []), newItem] })
    }

    const updateContactInfo = (index: number, field: keyof ContactInfoItem, value: any) => {
        const newInfo = [...(data.contactInfo || [])]
        newInfo[index] = { ...newInfo[index], [field]: value }
        updateData({ ...data, contactInfo: newInfo })
    }

    const removeContactInfo = (index: number) => {
        const newInfo = (data.contactInfo || []).filter((_, i) => i !== index)
        updateData({ ...data, contactInfo: newInfo })
    }

    // Social Links Management
    const addSocialLink = () => {
        const newLink: SocialLink = {
            platform: 'github',
            url: 'https://',
            icon: 'github'
        }
        updateData({ ...data, socialLinks: [...(data.socialLinks || []), newLink] })
    }

    const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
        const newLinks = [...(data.socialLinks || [])]
        newLinks[index] = { ...newLinks[index], [field]: value }
        updateData({ ...data, socialLinks: newLinks })
    }

    const removeSocialLink = (index: number) => {
        const newLinks = (data.socialLinks || []).filter((_, i) => i !== index)
        updateData({ ...data, socialLinks: newLinks })
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pixel-text relative">
            {/* Header Section */}
            <AnimatedSection variant="scale" duration={0.7} className="text-center group relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <Input
                    value={data.title || "Get In Touch"}
                    onChange={(e) => updateData({ ...data, title: e.target.value })}
                    className="text-3xl font-bold mb-2 pixel-title text-center border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary h-auto p-0"
                />
                <Textarea
                    value={data.description || "Have a question or want to work together? Drop me a message!"}
                    onChange={(e) => updateData({ ...data, description: e.target.value })}
                    className="text-center opacity-80 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary min-h-[40px] resize-none p-0"
                />
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Info & Socials */}
                <AnimatedSection variant="slideRight" delay={0.1} className="md:col-span-1 space-y-6 group/section relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium pixel-text opacity-50">Contact Details</h3>
                        <div className="flex gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" onClick={addContactInfo} className="h-6 w-6 p-0" title="Add Info">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {(data.contactInfo || []).map((info, index) => (
                        <AnimatedItem key={index}>
                            <Card className="hover:shadow-md transition-shadow border-0 pixel-card relative group">
                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                <Settings2 className="w-3 h-3" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="grid gap-4">
                                                <div className="space-y-2">
                                                    <h4 className="font-medium leading-none">Edit Contact Info</h4>
                                                </div>
                                                <div className="grid gap-2">
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        <Label>Type</Label>
                                                        <select
                                                            value={info.type}
                                                            onChange={(e) => updateContactInfo(index, "type", e.target.value)}
                                                            className="col-span-2 h-8 w-full border rounded-md px-2 text-sm"
                                                        >
                                                            {INFO_TYPES.map(type => (
                                                                <option key={type.value} value={type.value}>{type.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="grid grid-cols-3 items-center gap-4">
                                                        <Label>Link</Label>
                                                        <Input
                                                            value={info.link || ""}
                                                            onChange={(e) => updateContactInfo(index, "link", e.target.value)}
                                                            className="col-span-2 h-8"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">
                                                    <Button variant="destructive" size="sm" onClick={() => removeContactInfo(index)}>
                                                        <Trash2 className="w-4 h-4 mr-2" /> Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="bg-[var(--cute-highlight)] p-3 rounded-none shrink-0 border-2 border-[var(--cute-text)] text-[var(--cute-text)]">
                                        {getIcon(info.type)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Input
                                            value={info.label || info.type}
                                            onChange={(e) => updateContactInfo(index, "label", e.target.value)}
                                            className="font-medium pixel-text h-6 p-0 border-none shadow-none focus-visible:ring-0 bg-transparent"
                                        />
                                        <Input
                                            value={info.value}
                                            onChange={(e) => updateContactInfo(index, "value", e.target.value)}
                                            className="text-sm opacity-70 h-6 p-0 border-none shadow-none focus-visible:ring-0 bg-transparent"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </AnimatedItem>
                    ))}

                    <div className="pt-4 border-t-2 border-dashed border-border mt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-medium pixel-title">Social Media</h3>
                            <Button variant="ghost" size="sm" onClick={addSocialLink} className="h-6 w-6 p-0 opacity-0 group-hover/section:opacity-100 transition-opacity">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {(data.socialLinks || []).map((social, index) => (
                                <Popover key={index}>
                                    <PopoverTrigger asChild>
                                        <button
                                            className="bg-[var(--cute-highlight)] hover:bg-[var(--cute-highlight)]/80 p-2 rounded-none border-2 border-[var(--cute-text)] text-[var(--cute-text)] transition-colors relative group"
                                        >
                                            {getIcon(social.platform)}
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Edit Social Link</h4>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label>Platform</Label>
                                                    <select
                                                        value={social.platform}
                                                        onChange={(e) => {
                                                            updateSocialLink(index, "platform", e.target.value)
                                                            updateSocialLink(index, "icon", e.target.value)
                                                        }}
                                                        className="col-span-2 h-8 w-full border rounded-md px-2 text-sm"
                                                    >
                                                        {SOCIAL_PLATFORMS.map(platform => (
                                                            <option key={platform.value} value={platform.value}>{platform.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label>URL</Label>
                                                    <Input
                                                        value={social.url}
                                                        onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                                                        className="col-span-2 h-8"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button variant="destructive" size="sm" onClick={() => removeSocialLink(index)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ))}
                            <Button variant="outline" size="sm" className="h-[42px] w-[42px] border-dashed border-2 p-0" onClick={addSocialLink}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </AnimatedSection>

                {/* Contact Form Preview (Non-editable) */}
                <AnimatedSection variant="slideLeft" delay={0.2} className="md:col-span-2 relative group border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-md border border-border">
                            <input
                                type="checkbox"
                                id="showForm"
                                checked={data.showForm !== false}
                                onChange={(e) => updateData({ ...data, showForm: e.target.checked })}
                                className="w-4 h-4"
                            />
                            <label htmlFor="showForm" className="text-xs font-bold">SHOW FORM</label>
                        </div>
                    </div>

                    <div className={data.showForm === false ? "opacity-50 grayscale pointer-events-none" : ""}>
                        <Card className="border-0 pixel-card">
                            <CardContent className="p-6">
                                <form className="space-y-4 pointer-events-none">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="pixel-text">Your Name</Label>
                                            <Input placeholder="John Doe" className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)]" disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="pixel-text">Email Address</Label>
                                            <Input placeholder="john@example.com" className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)]" disabled />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="pixel-text">Subject</Label>
                                        <Input placeholder="Project Inquiry" className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)]" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="pixel-text">Message</Label>
                                        <Textarea placeholder="Tell me about your project..." rows={5} className="rounded-none border-2 border-[var(--cute-text)] bg-[var(--card-bg)]" disabled />
                                    </div>
                                    <Button className="w-full rounded-none border-2 border-[var(--cute-text)] bg-[var(--cute-text)] text-white" disabled>
                                        <Send className="mr-2 h-4 w-4" /> Send Message
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </AnimatedSection>
            </div>

            {/* Map URL Section */}
            <AnimatedSection variant="fadeIn" delay={0.4} className="group relative border-2 border-transparent hover:border-dashed hover:border-primary/50 p-4 rounded-lg transition-colors">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-2 pixel-title">Map Embed URL</h3>
                <p className="text-sm opacity-70 mb-3">Paste your Google Maps embed URL here (get it from Google Maps → Share → Embed a map)</p>
                <Input
                    value={data.mapUrl || ""}
                    onChange={(e) => updateData({ ...data, mapUrl: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="border-2 border-[var(--cute-text)] bg-[var(--card-bg)] focus-visible:ring-0 focus-visible:border-[var(--cute-highlight)]"
                />
            </AnimatedSection>
        </div>
    )
}
