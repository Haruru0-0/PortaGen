export type ContentFieldType = "text" | "textarea" | "image" | "link" | "list" | "badge"

export interface ContentField {
    id: string
    type: ContentFieldType
    label: string
    value: any
    placeholder?: string
}

export type WindowContentType = "about" | "projects" | "contact" | "resume" | "blog" | "links" | "custom"

export interface WindowContent {
    id: string
    name: string
    enabled: boolean
    data: {
        type: WindowContentType
        fields: ContentField[]
        template?: string
        description?: string
    }
    type: WindowContentType
}