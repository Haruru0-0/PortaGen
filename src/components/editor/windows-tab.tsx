import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { Edit2, Plus, Layout, Eye, EyeOff, Monitor, Smartphone } from "lucide-react"
import { useState } from "react"

interface WindowContent {
    id: string
    name: string
    enabled: boolean
    data: {
        type: "about" | "projects" | "contact" | "resume" | "blog" | "links" | "custom"
        fields: Array<{
            id: string
            type: "text" | "textarea" | "image" | "link" | "list" | "badge"
            label: string
            value: any
            placeholder?: string
        }>
        template?: string
        description?: string
    }
    type: "about" | "projects" | "contact" | "resume" | "blog" | "links" | "custom"
}

interface WindowsTabProps {
    windowContents: WindowContent[]
    onToggleWindow: (id: string) => void
    onWindowUpdate: (windows: WindowContent[]) => void
}

// Template definitions with preview data
const WINDOW_TEMPLATES = [
    {
        id: "about",
        name: "About Me",
        icon: "👤",
        description: "Personal introduction and skills",
        preview: {
            title: "About Me",
            subtitle: "Full-Stack Developer",
            content: "I'm a passionate developer with experience in modern web technologies...",
            skills: ["React", "Node.js", "TypeScript"]
        }
    },
    {
        id: "projects",
        name: "Projects",
        icon: "💼",
        description: "Showcase your work and portfolio",
        preview: {
            title: "My Projects",
            content: "A collection of my best work and side projects...",
            layout: "grid"
        }
    },
    {
        id: "contact",
        name: "Contact",
        icon: "📧",
        description: "Contact information and form",
        preview: {
            title: "Get In Touch",
            content: "Have a project in mind? Let's work together!",
            email: "your.email@example.com"
        }
    },
    {
        id: "resume",
        name: "Resume",
        icon: "📄",
        description: "Professional experience and education",
        preview: {
            title: "Resume",
            content: "Download my resume to learn more about my experience...",
            download: true
        }
    },
    {
        id: "blog",
        name: "Blog",
        icon: "📝",
        description: "Articles and blog posts",
        preview: {
            title: "Blog",
            content: "My thoughts, tutorials, and insights...",
            posts: 12
        }
    },
    {
        id: "links",
        name: "Links",
        icon: "🔗",
        description: "Social media and external links",
        preview: {
            title: "Connect With Me",
            content: "Find me across the web and get in touch...",
            layout: "grid"
        }
    },
    {
        id: "custom",
        name: "Custom",
        icon: "⚙️",
        description: "Create your own custom section",
        preview: {
            title: "Custom Section",
            content: "Add your own custom content here...",
            editable: true
        }
    }
]

export function WindowsTab({
                               windowContents,
                               onToggleWindow,
                               onWindowUpdate,
                           }: WindowsTabProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")

    const handleCreateWindow = (templateId: string) => {
        const template = WINDOW_TEMPLATES.find(t => t.id === templateId)
        if (!template) return

        const newWindow: WindowContent = {
            id: `window-${Date.now()}`,
            name: template.name,
            enabled: true,
            type: template.id as any,
            data: {
                type: template.id as any,
                fields: [
                    { id: "title", type: "text", label: "Title", value: template.preview.title },
                    { id: "description", type: "textarea", label: "Description", value: template.preview.content }
                ],
                template: template.name,
                description: template.description
            }
        }

        onWindowUpdate([...windowContents, newWindow])
        setSelectedTemplate(null)
    }

    const handleDeleteWindow = (id: string) => {
        const updatedWindows = windowContents.filter(w => w.id !== id)
        onWindowUpdate(updatedWindows)
    }

    const getTemplatePreview = (templateId: string) => {
        const template = WINDOW_TEMPLATES.find(t => t.id === templateId)
        return template?.preview || null
    }

    return (
        <div className="space-y-4">
            {/* Template Selection Section */}
            <PixelCard>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm pixel-text-shadow">CREATE NEW WINDOW</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPreviewMode("desktop")}
                                className={`px-3 py-1 text-[10px] border-2 border-border flex items-center gap-1 ${
                                    previewMode === "desktop"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-muted"
                                }`}
                            >
                                <Monitor className="w-3 h-3" />
                                DESKTOP
                            </button>
                            <button
                                onClick={() => setPreviewMode("mobile")}
                                className={`px-3 py-1 text-[10px] border-2 border-border flex items-center gap-1 ${
                                    previewMode === "mobile"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-muted"
                                }`}
                            >
                                <Smartphone className="w-3 h-3" />
                                MOBILE
                            </button>
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                        Choose a template to create a new content window
                    </p>

                    {/* Template Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {WINDOW_TEMPLATES.map((template) => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplate(template.id)}
                                className={`p-3 border-2 text-left transition-all ${
                                    selectedTemplate === template.id
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border bg-card hover:bg-muted hover:border-muted-foreground"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{template.icon}</span>
                                    <span className="text-[10px] font-bold">{template.name}</span>
                                </div>
                                <p className="text-[8px] text-muted-foreground">
                                    {template.description}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Template Preview */}
                    {selectedTemplate && (
                        <div className="border-t-2 border-border pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-[10px] font-bold">PREVIEW</h4>
                                <PixelButton
                                    variant="primary"
                                    className="text-[10px]"
                                    onClick={() => handleCreateWindow(selectedTemplate)}
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    CREATE WINDOW
                                </PixelButton>
                            </div>

                            <div className={`border-2 border-border bg-card ${
                                previewMode === "mobile" ? "max-w-[200px] mx-auto" : "w-full"
                            }`}>
                                <div className={`p-4 ${previewMode === "mobile" ? "min-h-[300px]" : "min-h-[200px]"}`}>
                                    <div className="text-center space-y-3">
                                        <h3 className="text-sm font-bold">
                                            {getTemplatePreview(selectedTemplate)?.title}
                                        </h3>
                                        <p className="text-[10px] text-muted-foreground">
                                            {getTemplatePreview(selectedTemplate)?.content}
                                        </p>

                                        {/* Dynamic preview content based on template */}
                                        {selectedTemplate === "about" && (
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {getTemplatePreview(selectedTemplate)?.skills?.map((skill: string, index: number) => (
                                                    <span key={index} className="px-2 py-1 text-[8px] border border-border bg-muted">
                            {skill}
                          </span>
                                                ))}
                                            </div>
                                        )}

                                        {selectedTemplate === "contact" && (
                                            <div className="text-[10px] space-y-1">
                                                <div>📧 {getTemplatePreview(selectedTemplate)?.email}</div>
                                            </div>
                                        )}

                                        {selectedTemplate === "resume" && (
                                            <button className="px-3 py-1 text-[10px] border-2 border-border bg-primary text-primary-foreground">
                                                📥 Download Resume
                                            </button>
                                        )}

                                        {selectedTemplate === "blog" && (
                                            <div className="text-[10px] text-muted-foreground">
                                                {getTemplatePreview(selectedTemplate)?.posts} articles
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-2">
                <span className="text-[8px] text-muted-foreground">
                  {previewMode === "mobile" ? "Mobile Preview" : "Desktop Preview"}
                </span>
                            </div>
                        </div>
                    )}
                </div>
            </PixelCard>

            {/* Existing Windows List */}
            <PixelCard>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm pixel-text-shadow">YOUR WINDOWS</h3>
                        <div className="text-[10px] text-muted-foreground">
                            {windowContents.length} window{windowContents.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground">
                        Manage your existing content windows
                    </p>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {windowContents.length === 0 ? (
                            <div className="text-center p-6 border-2 border-dashed border-border">
                                <Layout className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-[10px] text-muted-foreground">No windows created yet</p>
                                <p className="text-[8px] text-muted-foreground mt-1">
                                    Select a template above to create your first window
                                </p>
                            </div>
                        ) : (
                            windowContents.map((window) => (
                                <div
                                    key={window.id}
                                    className="flex items-center justify-between p-3 border-2 border-border bg-muted hover:bg-accent transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <button
                                            onClick={() => onToggleWindow(window.id)}
                                            className={`w-6 h-6 border-2 border-border flex items-center justify-center transition-colors ${
                                                window.enabled
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-card hover:bg-muted"
                                            }`}
                                        >
                                            {window.enabled ? (
                                                <Eye className="w-3 h-3" />
                                            ) : (
                                                <EyeOff className="w-3 h-3" />
                                            )}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold truncate">{window.name}</span>
                                                <span className="text-[8px] px-1 py-0.5 border border-border bg-card capitalize">
                          {window.type}
                        </span>
                                            </div>
                                            <p className="text-[8px] text-muted-foreground truncate">
                                                {window.data?.description || "No description"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                // You can implement edit functionality here
                                                console.log("Edit window:", window.id)
                                            }}
                                            className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWindow(window.id)}
                                            className="w-8 h-8 border-2 border-border bg-card hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                                        >
                                            <EyeOff className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </PixelCard>
        </div>
    )
}