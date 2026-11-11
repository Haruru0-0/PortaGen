import React, { useState, useEffect, JSX } from "react"
import { WorkspacePanel as PixelCard } from "@/components/workspace/workspace-primitives"
import { WorkspaceAction as PixelButton } from "@/components/workspace/workspace-primitives"
import { Save, Layout, User, Briefcase, Mail, FileText, Link, BookOpen, ArrowLeft, Terminal as TerminalIcon, Trophy } from "lucide-react"
import type { WindowContent, WindowContentType, TemplateData, AboutMeData, ProjectsData, ContactData, ResumeData, BlogData, LinksData, TerminalData, AchievementsData } from "@/lib/types"
import { LinksForm } from "./forms/links-form"
import { AboutMeForm } from "./forms/about-me-form"
import { ProjectsForm } from "./forms/projects-form"
import { ContactForm } from "./forms/contact-form"
import { ResumeForm } from "./forms/resume-form"
import { BlogForm } from "./forms/blog-form"
import { BlankTemplateEditor } from "./forms/blank-template-editor"
import { TerminalForm } from "./forms/terminal-form"
import { AchievementsForm } from "./forms/achievements-form"
import { DEFAULT_CONTENT_BY_TYPE } from "@/lib/portfolio-extras"
import { uploadFile } from "@/lib/services/uploadService"
import { useWindowsContext } from "@/contexts/windowsContext"
import { assetUrl } from "@/lib/asset-url"

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
    },
    terminal: {
        name: "Terminal",
        icon: <TerminalIcon className="w-4 h-4" />,
        description: "Interactive command line with your own files and commands"
    },
    achievements: {
        name: "Achievements",
        icon: <Trophy className="w-4 h-4" />,
        description: "Unlockable achievements for visitors who explore"
    }
}

interface WindowContentEditorProps {
    windowId?: number
    portfolioId: number
    onSave: (content: WindowContent) => void
    onCancel: () => void
}

// Helper to set deep value
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
        setContentData((DEFAULT_CONTENT_BY_TYPE[type] as TemplateData) ?? {})
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

        setContentData((prev: TemplateData) => setDataDeep(prev, path, blobUrl))
    }

    const handleUrlUpdate = (path: string, url: string) => {
        setFilesToUpload(prev => {
            const next = new Map(prev)
            next.delete(path)
            return next
        })
        setContentData((prev: TemplateData) => setDataDeep(prev, path, url))
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
                    uploadedUrls.set(path, assetUrl(asset))
                }
            }

            // Replace blob URLs with real URLs in contentData
            let finalContentData = { ...contentData }

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
                return <AboutMeForm initialData={contentData as AboutMeData} onChange={setContentData} onFileSelect={handleFileSelect} onUrlSelect={handleUrlUpdate} />
            case "projects":
                return <ProjectsForm initialData={contentData as ProjectsData} onChange={setContentData} onFileSelect={handleFileSelect} onUrlSelect={handleUrlUpdate} />
            case "contact":
                return <ContactForm initialData={contentData as ContactData} onChange={setContentData} />
            case "resume":
                return <ResumeForm initialData={contentData as ResumeData} onChange={setContentData} />
            case "blog":
                return <BlogForm initialData={contentData as BlogData} onChange={setContentData} onFileSelect={handleFileSelect} onUrlSelect={handleUrlUpdate} />
            case "links":
                return <LinksForm initialData={contentData as LinksData} onChange={setContentData} />
            case "terminal":
                return <TerminalForm initialData={contentData as TerminalData} onChange={setContentData} />
            case "achievements":
                return <AchievementsForm initialData={contentData as AchievementsData} onChange={setContentData} />
            case "blank":
                return <BlankTemplateEditor initialData={contentData as any} onChange={setContentData} />
            default:
                return <div className="p-4 text-center text-muted-foreground">Select a content type to start editing</div>
        }
    }

    return (
        <PixelCard className="w-full h-full flex flex-col">
            <div className="flex-none space-y-6 flex flex-col h-full">
                <div className="flex flex-wrap gap-4 items-center justify-between border-b-2 border-border pb-4 flex-none">
                    <div className="flex items-center gap-3">
                        <button data-workspace-control
                            onClick={onCancel}
                            aria-label="Back to portfolio controls"
                            className="min-w-11 min-h-11 border-2 border-border bg-card hover:bg-muted transition-colors flex items-center justify-center"
                            disabled={isLoading}
                        >
                            <ArrowLeft className="w-3 h-3" />
                        </button>
                        <div>
                            <h1 tabIndex={-1} className="workspace-editor-page-title persona-page-title" data-page-heading>
                                {isEditing ? "EDIT WINDOW" : "CREATE WINDOW"}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {isEditing ? "Modify window content and settings" : "Create a new content window"}
                            </p>
                        </div>
                    </div>

                    <PixelButton
                        variant="primary"
                        className="text-sm flex items-center gap-2"
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
                            <button data-workspace-control
                                key={key}
                                aria-pressed={selectedType === key}
                                onClick={() => handleTypeChange(key)}
                                className={`p-3 border-2 text-left transition-all ${selectedType === key
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border bg-card hover:bg-muted hover:border-muted-foreground"
                                    }`}
                                disabled={isLoading}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {template.icon}
                                    <span className="text-sm font-bold">{template.name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {template.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Specific Form Rendering */}
                <div className="workspace-editor-form flex-1 min-w-0 p-2 sm:p-4">
                    {renderForm()}
                </div>
            </div>
        </PixelCard>
    )
}