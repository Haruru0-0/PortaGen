import React, { useState, useEffect, JSX } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { Save, Layout, User, Briefcase, Mail, FileText, Link, BookOpen, ArrowLeft } from "lucide-react"
import type { WindowContent, WindowContentType, TemplateData, AboutMeData, ProjectsData, ContactData, ResumeData, BlogData, LinksData } from "@/lib/types"
import { LinksForm } from "./forms/links-form"
import { AboutMeForm } from "./forms/about-me-form"
import { ProjectsForm } from "./forms/projects-form"
import { ContactForm } from "./forms/contact-form"
import { ResumeForm } from "./forms/resume-form"
import { BlogForm } from "./forms/blog-form"
import { BlankTemplateEditor } from "./forms/blank-template-editor"
import { uploadFile } from "@/lib/services/uploadService"
import { useWindowsContext } from "@/contexts/windowsContext"

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
    windowId?: number
    portfolioId: number
    onSave: (content: WindowContent) => void
    onCancel: () => void
}

export function WindowContentEditor({ windowId, portfolioId, onSave, onCancel }: WindowContentEditorProps) {
    const { windows, getWindow, loading: contextLoading } = useWindowsContext()
    const [name, setName] = useState("")
    const [selectedType, setSelectedType] = useState<WindowContentType>("about")
    const [contentData, setContentData] = useState<TemplateData>({})
    const [filesToUpload, setFilesToUpload] = useState<Map<string, File>>(new Map())
    const [isUploading, setIsUploading] = useState(false)
    const isEditing = !!windowId

    // Combine both loading states
    const isLoading = isUploading || contextLoading

    // Get the current window from context
    const currentWindow = windowId
        ? windows.find(w => w.id === windowId)
        : null

    useEffect(() => {
        // If we have a windowId but no currentWindow, fetch it
        if (windowId && !currentWindow && portfolioId) {
            getWindow(portfolioId, windowId).then(window => {
                if (window) {
                    setName(window.name)
                    setSelectedType(window.data?.type || "about")
                    setContentData(window.data?.content || {})
                }
            })
        } else if (currentWindow) {
            // Update from context changes
            setName(currentWindow.name)
            setSelectedType(currentWindow.data?.type || "about")
            setContentData(currentWindow.data?.content || {})
        }
    }, [windowId, currentWindow, portfolioId, getWindow, windows])

    const handleTypeChange = (type: WindowContentType) => {
        setSelectedType(type)
        // Reset content data when type changes, or set default structure
        setContentData({})
        setFilesToUpload(new Map())

        // Update window name to match template if it's a new window or using default name
        if (!currentWindow || name === CONTENT_TEMPLATES[selectedType].name) {
            setName(CONTENT_TEMPLATES[type].name)
        }
    }

    const handleFileSelect = (path: string, file: File) => {
        setFilesToUpload(prev => new Map(prev).set(path, file))

        // Create temporary blob URL for preview
        const blobUrl = URL.createObjectURL(file)

        // Helper to set deep value
        const setDataDeep = (obj: any, path: string, value: any): any => {
            const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
            const newObj = { ...obj }
            let current = newObj
            for (let i = 0; i < parts.length - 1; i++) {
                const part = parts[i]
                if (!current[part]) current[part] = {}
                current[part] = Array.isArray(current[part]) ? [...current[part]] : { ...current[part] }
                current = current[part]
            }
            current[parts[parts.length - 1]] = value
            return newObj
        }

        setContentData((prev: TemplateData) => setDataDeep(prev, path, blobUrl))
    }

    const handleSave = async () => {
        if (!name.trim()) return

        setIsUploading(true)
        try {
            // Upload files
            const uploadedUrls = new Map<string, string>()

            for (const [path, file] of filesToUpload.entries()) {
                const asset = await uploadFile(file, portfolioId)
                if (asset) {
                    uploadedUrls.set(path, `https://drive.google.com/uc?id=${asset.fileId}`)
                }
            }

            // Replace blob URLs with real URLs in contentData
            let finalContentData = { ...contentData }

            const setDataDeep = (obj: any, path: string, value: any): any => {
                const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
                const newObj = Array.isArray(obj) ? [...obj] : { ...obj }
                let current = newObj
                for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i]
                    if (!current[part]) current[part] = {}
                    current[part] = Array.isArray(current[part]) ? [...current[part]] : { ...current[part] }
                    current = current[part]
                }
                current[parts[parts.length - 1]] = value
                return newObj
            }

            for (const [path, url] of uploadedUrls.entries()) {
                finalContentData = setDataDeep(finalContentData, path, url)
            }

            const content: WindowContent = {
                id: currentWindow?.id || 0,
                name,
                type: selectedType,
                iconId: currentWindow?.iconId || "",
                data: {
                    type: selectedType,
                    template: CONTENT_TEMPLATES[selectedType].name,
                    description: CONTENT_TEMPLATES[selectedType].description,
                    content: finalContentData
                }
            }
            onSave(content)
        } catch (error) {
            console.error("Failed to save window:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const renderForm = () => {
        switch (selectedType) {
            case "about":
                return <AboutMeForm initialData={contentData as AboutMeData} onChange={setContentData} onFileSelect={handleFileSelect} />
            case "projects":
                return <ProjectsForm initialData={contentData as ProjectsData} onChange={setContentData} />
            case "contact":
                return <ContactForm initialData={contentData as ContactData} onChange={setContentData} />
            case "resume":
                return <ResumeForm initialData={contentData as ResumeData} onChange={setContentData} />
            case "blog":
                return <BlogForm initialData={contentData as BlogData} onChange={setContentData} />
            case "links":
                return <LinksForm initialData={contentData as LinksData} onChange={setContentData} />
            case "blank":
                return <BlankTemplateEditor initialData={contentData as any} onChange={setContentData} />
            default:
                return <div className="p-4 text-center text-muted-foreground">Select a content type to start editing</div>
        }
    }

    return (
        <PixelCard className="w-full h-full flex flex-col">
            <div className="flex-none space-y-6 flex flex-col h-full">
                <div className="flex items-center justify-between border-b-2 border-border pb-4 flex-none">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onCancel}
                            className="w-8 h-8 border-2 border-border bg-card hover:bg-muted transition-colors flex items-center justify-center"
                            disabled={isLoading}
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

                    <PixelButton
                        variant="primary"
                        className="text-[10px] flex items-center gap-2"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        <Save className="w-3 h-3" />
                        {isLoading ? "SAVING..." : (isEditing ? "UPDATE" : "CREATE")}
                    </PixelButton>
                </div>

                {/* Template Selection */}
                <div className="space-y-3 flex-none">
                    <label className="block text-xs uppercase tracking-wider">CONTENT TEMPLATE</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(Object.entries(CONTENT_TEMPLATES) as [WindowContentType, typeof CONTENT_TEMPLATES[WindowContentType]][]).map(([key, template]) => (
                            <button
                                key={key}
                                onClick={() => handleTypeChange(key)}
                                className={`p-3 border-2 text-left transition-all ${selectedType === key
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-card hover:bg-muted hover:border-muted-foreground"
                                    }`}
                                disabled={isLoading}
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
                <div className="flex-1 overflow-y-auto border-2 border-border p-4 bg-muted/20">
                    {renderForm()}
                </div>
            </div>
        </PixelCard>
    )
}