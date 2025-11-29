import { useState, useEffect } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { PixelInput } from "@/components/pixel-input"
import { Trash2, Save, Layout, User, Briefcase, Mail, FileText, Link, BookOpen, ArrowLeft, Eye, EyeOff } from "lucide-react"
import type { WindowContent, WindowContentType, TemplateData } from "@/lib/types"
import { LinksForm } from "./forms/links-form"
import { AboutMeForm } from "./forms/about-me-form"
import { ProjectsForm } from "./forms/projects-form"
import { ContactForm } from "./forms/contact-form"
import { ResumeForm } from "./forms/resume-form"
import { BlogForm } from "./forms/blog-form"

// Template definitions metadata
const CONTENT_TEMPLATES: Record<WindowContentType, {
    name: string
    icon: JSX.Element
    description: string
}> = {
    blank: {
        name: "Blank",
        icon: <Layout className="w-4 h-4" />,
        description: "Start from scratch with custom HTML"
    },
    about: {
        name: "About Me",
        icon: <User className="w-4 h-4" />,
        description: "Personal introduction and skills"
    },
    projects: {
        name: "Projects",
        icon: <Briefcase className="w-4 h-4" />,
        description: "Showcase your work and portfolio"
    },
    contact: {
        name: "Contact",
        icon: <Mail className="w-4 h-4" />,
        description: "Contact information and form"
    },
    resume: {
        name: "Resume",
        icon: <FileText className="w-4 h-4" />,
        description: "Professional experience and education"
    },
    blog: {
        name: "Blog",
        icon: <BookOpen className="w-4 h-4" />,
        description: "Articles and blog posts"
    },
    links: {
        name: "Links",
        icon: <Link className="w-4 h-4" />,
        description: "Social media and external links"
    }
}

interface WindowContentEditorProps {
    windowContent: WindowContent | null
    onSave: (content: WindowContent) => void
    onCancel: () => void
    onDelete?: (id: string) => void
}

export function WindowContentEditor({ windowContent, onSave, onCancel, onDelete }: WindowContentEditorProps) {
    const [selectedType, setSelectedType] = useState<WindowContentType>(windowContent?.type || "about")
    const [contentData, setContentData] = useState<TemplateData>({})
    const [windowName, setWindowName] = useState(windowContent?.name || "")
    const isEditing = !!windowContent

    // Initialize form when windowContent changes
    useEffect(() => {
        if (windowContent) {
            setWindowName(windowContent.name)
            setSelectedType(windowContent.type)

            if (windowContent.data && windowContent.data.content) {
                setContentData(windowContent.data.content)
            } else {
                setContentData({})
            }
        }
    }, [windowContent])

    const handleTemplateChange = (templateType: WindowContentType) => {
        setSelectedType(templateType)
        setContentData({})

        // Update window name to match template if it's a new window or using default name
        if (!windowContent || windowName === CONTENT_TEMPLATES[selectedType].name) {
            setWindowName(CONTENT_TEMPLATES[templateType].name)
        }
    }

    const handleSave = () => {
        if (!windowName.trim()) return

        const content = {
            type: selectedType,
            template: CONTENT_TEMPLATES[selectedType].name,
            description: CONTENT_TEMPLATES[selectedType].description,
            content: contentData
        }

        onSave({
            id: windowContent?.id || `window-${Date.now()}`,
            name: windowName,
            enabled: windowContent?.enabled ?? true,
            type: selectedType,
            data: content
        })
    }

    return (
        <PixelCard>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-border pb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="w-8 h-8 border-2 border-border bg-card hover:bg-muted transition-colors flex items-center justify-center"
                        >
                            <ArrowLeft className="w-3 h-3" />
                        </button>
                        <div>
                            <h3 className="text-sm dashboard-pixel-text-shadow">
                                {isEditing ? "EDIT WINDOW" : "CREATE WINDOW"}
                            </h3>
                            <p className="text-[10px] text-muted-foreground">
                                {isEditing ? "Modify window content and settings" : "Create a new content window"}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {isEditing && onDelete && (
                            <PixelButton
                                variant="secondary"
                                className="text-[10px] flex items-center gap-2"
                                onClick={() => onDelete(windowContent!.id)}
                            >
                                <Trash2 className="w-3 h-3" />
                                DELETE
                            </PixelButton>
                        )}
                        <PixelButton
                            variant="primary"
                            className="text-[10px] flex items-center gap-2"
                            onClick={handleSave}
                        >
                            <Save className="w-3 h-3" />
                            {isEditing ? "UPDATE" : "CREATE"}
                        </PixelButton>
                    </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-wider">CONTENT TEMPLATE</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(Object.entries(CONTENT_TEMPLATES) as [WindowContentType, typeof CONTENT_TEMPLATES[WindowContentType]][]).map(([key, template]) => (
                            <button
                                key={key}
                                onClick={() => handleTemplateChange(key)}
                                className={`p-3 border-2 text-left transition-all ${selectedType === key
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-card hover:bg-muted hover:border-muted-foreground"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {template.icon}
                                    <span className="text-[10px] font-bold">{template.name}</span>
                                </div>
                                <p className="text-[8px] text-muted-foreground">
                                    {template.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Specific Form Rendering */}
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 border-2 border-border p-4 bg-muted/20">
                    {selectedType === 'links' && (
                        <LinksForm
                            initialData={contentData}
                            onChange={setContentData}
                        />
                    )}
                    {selectedType === 'about' && (
                        <AboutMeForm
                            initialData={contentData}
                            onChange={setContentData}
                        />
                    )}
                    {selectedType === 'projects' && (
                        <ProjectsForm
                            initialData={contentData}
                            onChange={setContentData}
                        />
                    )}
                    {selectedType === 'contact' && (
                        <ContactForm
                            initialData={contentData}
                            onChange={setContentData}
                        />
                    )}
                    {selectedType === 'resume' && (
                        <ResumeForm
                            initialData={contentData}
                            onChange={setContentData}
                        />
                    )}
                    {selectedType === 'blog' && (
                        <BlogForm
                            initialData={contentData}
                            onChange={setContentData}
                        />
                    )}
                    {(selectedType === 'blank') && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Custom content editing is coming soon.</p>
                            <p className="text-xs mt-2">For now, please use one of the structured templates.</p>
                        </div>
                    )}
                </div>
            </div>
        </PixelCard>
    )
}