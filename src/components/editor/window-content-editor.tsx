import { useState, useEffect } from "react"
import { PixelCard } from "@/components/pixel-card"
import { PixelButton } from "@/components/pixel-button"
import { PixelInput } from "@/components/pixel-input"
import { FileUpload } from "@/components/file-upload"
import { Trash2, Save, Plus, Layout, User, Briefcase, Mail, FileText, Link, BookOpen, ArrowLeft, Eye, EyeOff } from "lucide-react"
import type { ContentField, WindowContent, WindowContentType, ContentFieldType } from "@/types/window-content"

// Template definitions with proper typing
const CONTENT_TEMPLATES: Record<WindowContentType, {
    name: string
    icon: JSX.Element
    description: string
    fields: ContentField[]
}> = {
    about: {
        name: "About Me",
        icon: <User className="w-4 h-4" />,
        description: "Personal introduction and skills",
        fields: [
            { id: "title", type: "text", label: "Title", value: "About Me", placeholder: "Section Title" },
            { id: "subtitle", type: "text", label: "Subtitle", value: "Full-Stack Developer", placeholder: "Your role/title" },
            { id: "description", type: "textarea", label: "Description", value: "I'm a passionate developer with experience in modern web technologies...", placeholder: "Tell your story" },
            { id: "profileImage", type: "image", label: "Profile Image", value: "", placeholder: "" },
            { id: "skills", type: "badge", label: "Skills", value: ["React", "Node.js", "TypeScript"], placeholder: "Add skills" }
        ]
    },
    projects: {
        name: "Projects",
        icon: <Briefcase className="w-4 h-4" />,
        description: "Showcase your work and portfolio",
        fields: [
            { id: "title", type: "text", label: "Title", value: "My Projects", placeholder: "Section Title" },
            { id: "description", type: "textarea", label: "Description", value: "A collection of my best work and side projects...", placeholder: "Projects section description" },
            { id: "showcaseLayout", type: "text", label: "Layout Type", value: "grid", placeholder: "grid or carousel" }
        ]
    },
    contact: {
        name: "Contact",
        icon: <Mail className="w-4 h-4" />,
        description: "Contact information and form",
        fields: [
            { id: "title", type: "text", label: "Title", value: "Get In Touch", placeholder: "Section Title" },
            { id: "description", type: "textarea", label: "Description", value: "Have a project in mind? Let's work together!", placeholder: "Contact section description" },
            { id: "email", type: "text", label: "Email", value: "your.email@example.com", placeholder: "Your email" },
            { id: "phone", type: "text", label: "Phone", value: "+1234567890", placeholder: "Your phone number" },
            { id: "location", type: "text", label: "Location", value: "Your City, Country", placeholder: "Your location" },
            { id: "showForm", type: "text", label: "Show Contact Form", value: "true", placeholder: "true or false" }
        ]
    },
    resume: {
        name: "Resume",
        icon: <FileText className="w-4 h-4" />,
        description: "Professional experience and education",
        fields: [
            { id: "title", type: "text", label: "Title", value: "Resume", placeholder: "Section Title" },
            { id: "downloadUrl", type: "link", label: "Resume PDF", value: "", placeholder: "Link to your resume PDF" },
            { id: "showExperience", type: "text", label: "Show Experience", value: "true", placeholder: "true or false" },
            { id: "showEducation", type: "text", label: "Show Education", value: "true", placeholder: "true or false" },
            { id: "showSkills", type: "text", label: "Show Skills", value: "true", placeholder: "true or false" }
        ]
    },
    blog: {
        name: "Blog",
        icon: <BookOpen className="w-4 h-4" />,
        description: "Articles and blog posts",
        fields: [
            { id: "title", type: "text", label: "Title", value: "Blog", placeholder: "Section Title" },
            { id: "description", type: "textarea", label: "Description", value: "My thoughts, tutorials, and insights...", placeholder: "Blog description" },
            { id: "rssUrl", type: "link", label: "RSS Feed", value: "", placeholder: "Your blog RSS feed URL" },
            { id: "source", type: "text", label: "Blog Source", value: "hashnode", placeholder: "hashnode, devto, or custom" }
        ]
    },
    links: {
        name: "Links",
        icon: <Link className="w-4 h-4" />,
        description: "Social media and external links",
        fields: [
            { id: "title", type: "text", label: "Title", value: "Connect With Me", placeholder: "Section Title" },
            { id: "description", type: "textarea", label: "Description", value: "Find me across the web and get in touch...", placeholder: "Links description" },
            { id: "layout", type: "text", label: "Layout", value: "grid", placeholder: "grid or list" }
        ]
    },
    custom: {
        name: "Custom",
        icon: <Layout className="w-4 h-4" />,
        description: "Create your own custom section",
        fields: [
            { id: "title", type: "text", label: "Title", value: "Custom Section", placeholder: "Section Title" },
            { id: "content", type: "textarea", label: "Content", value: "", placeholder: "Your custom content (supports HTML)" },
            { id: "style", type: "text", label: "Custom CSS", value: "", placeholder: "Custom CSS classes" }
        ]
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
    const [contentFields, setContentFields] = useState<ContentField[]>([])
    const [windowName, setWindowName] = useState(windowContent?.name || "")
    const isEditing = !!windowContent

    // Initialize form when windowContent changes
    useEffect(() => {
        if (windowContent) {
            setWindowName(windowContent.name)
            setSelectedType(windowContent.type)
            
            // Load existing fields or use template
            if (windowContent.data && windowContent.data.fields) {
                setContentFields(windowContent.data.fields)
            } else {
                setContentFields([...CONTENT_TEMPLATES[windowContent.type].fields])
            }
        }
    }, [windowContent])

    const handleFieldChange = (fieldId: string, value: any) => {
        setContentFields(prev =>
            prev.map(field =>
                field.id === fieldId ? { ...field, value } : field
            )
        )
    }

    const addListItem = (fieldId: string, newItem: string) => {
        if (!newItem.trim()) return

        setContentFields(prev =>
            prev.map(field =>
                field.id === fieldId
                    ? { ...field, value: [...(field.value || []), newItem.trim()] }
                    : field
            )
        )
    }

    const removeListItem = (fieldId: string, index: number) => {
        setContentFields(prev =>
            prev.map(field =>
                field.id === fieldId
                    ? { ...field, value: (field.value as string[]).filter((_: string, i: number) => i !== index) }
                    : field
            )
        )
    }

    const handleTemplateChange = (templateType: WindowContentType) => {
        setSelectedType(templateType)
        setContentFields([...CONTENT_TEMPLATES[templateType].fields])

        // Update window name to match template if it's a new window or using default name
        if (!windowContent || windowName === CONTENT_TEMPLATES[selectedType].name) {
            setWindowName(CONTENT_TEMPLATES[templateType].name)
        }
    }

    const handleSave = () => {
        if (!windowName.trim()) return

        const contentData = {
            type: selectedType,
            fields: contentFields,
            template: CONTENT_TEMPLATES[selectedType].name,
            description: CONTENT_TEMPLATES[selectedType].description
        }

        onSave({
            id: windowContent?.id || `window-${Date.now()}`,
            name: windowName,
            enabled: windowContent?.enabled ?? true,
            type: selectedType,
            data: contentData
        })
    }

    const renderField = (field: ContentField) => {
        switch (field.type) {
            case "text":
                return (
                    <PixelInput
                        label={field.label}
                        value={field.value as string || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                    />
                )

            case "textarea":
                return (
                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider">{field.label}</label>
                        <textarea
                            value={field.value as string || ""}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            className="w-full p-2 text-xs border-2 border-border bg-card resize-none focus:outline-none focus:border-primary"
                        />
                    </div>
                )

            case "image":
                return (
                    <FileUpload
                        accept="image/*"
                        onFileSelect={(file) => {
                            const url = URL.createObjectURL(file)
                            handleFieldChange(field.id, url)
                        }}
                        preview={field.value as string}
                        label={field.label}
                        maxSize={5}
                    />
                )

            case "link":
                return (
                    <PixelInput
                        label={field.label}
                        value={field.value as string || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        type="url"
                    />
                )

            case "badge":
            case "list":
                const fieldValue = field.value as string[] || []
                return (
                    <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider">{field.label}</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {fieldValue.map((item: string, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-1 px-2 py-1 text-xs border-2 border-border bg-muted"
                                >
                                    <span>{item}</span>
                                    <button
                                        onClick={() => removeListItem(field.id, index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder={field.placeholder || `Add ${field.label.toLowerCase()}...`}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        addListItem(field.id, (e.target as HTMLInputElement).value)
                                        ;(e.target as HTMLInputElement).value = ''
                                    }
                                }}
                                className="flex-1 p-2 text-xs border-2 border-border bg-card focus:outline-none focus:border-primary"
                            />
                            <button
                                onClick={() => {
                                    const input = document.querySelector(`input[placeholder*="${field.label}"]`) as HTMLInputElement
                                    if (input?.value) {
                                        addListItem(field.id, input.value)
                                        input.value = ''
                                    }
                                }}
                                className="w-8 h-8 border-2 border-border bg-card hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                )

            default:
                return null
        }
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
                            <h3 className="text-sm pixel-text-shadow">
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

                {/* Window Name */}
                <PixelInput
                    label="WINDOW NAME"
                    value={windowName}
                    onChange={(e) => setWindowName(e.target.value)}
                    placeholder="Enter window name..."
                />

                {/* Template Selection */}
                <div className="space-y-3">
                    <label className="block text-xs uppercase tracking-wider">CONTENT TEMPLATE</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {(Object.entries(CONTENT_TEMPLATES) as [WindowContentType, typeof CONTENT_TEMPLATES[WindowContentType]][]).map(([key, template]) => (
                            <button
                                key={key}
                                onClick={() => handleTemplateChange(key)}
                                className={`p-3 border-2 text-left transition-all ${
                                    selectedType === key
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

                {/* Content Fields */}
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    <label className="block text-xs uppercase tracking-wider">CONTENT FIELDS</label>
                    {contentFields.map((field) => (
                        <div key={field.id} className="border-2 border-border p-3 bg-muted">
                            {renderField(field)}
                        </div>
                    ))}
                </div>

                {/* Preview Section */}
                <div className="border-t-2 border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs uppercase tracking-wider">PREVIEW</label>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            {windowContent?.enabled ? (
                                <>
                                    <Eye className="w-3 h-3" />
                                    VISIBLE
                                </>
                            ) : (
                                <>
                                    <EyeOff className="w-3 h-3" />
                                    HIDDEN
                                </>
                            )}
                        </div>
                    </div>

                    <div className="border-2 border-border p-4 bg-card">
                        <div className="text-center">
                            <div className="text-[10px] text-muted-foreground mb-2">
                                Window Preview: <strong>{windowName}</strong>
                            </div>
                            <div className="text-[8px] text-muted-foreground">
                                Type: {selectedType} • Fields: {contentFields.length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PixelCard>
    )
}