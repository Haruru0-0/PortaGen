import BlueCover from "@/assets/blue.jpg";
import BlueSong from "@/assets/blue.mp4";
import LoveforYouCover from "@/assets/LoveforYou.jpg";
import LoveforYouSong from "@/assets/LoveforYou.mp4";
import LoveWaveToEarthCover from "@/assets/Love-wavetoearth.jpg";
import LoveWaveToEarthSong from "@/assets/Love-wavetoearth.mp4";
import GlueSongCover from "@/assets/GlueSong.jpg";
import GlueSong from "@/assets/GlueSong.mp4";
import type { StaticImageData } from "next/image";
import { Asset as VideoAsset } from "next-video/dist/assets.js";

export interface Track {
    id: number;
    title: string;
    artist: string;
    duration: string;
    cover: string | StaticImageData;
    src: string | VideoAsset;
}

export const playlist: Track[] = [
    {
        id: 1,
        title: "Blue",
        artist: "Yung kai",
        duration: "3:34",
        cover: BlueCover,
        src: BlueSong,
    },
    {
        id: 2,
        title: "Love For You",
        artist: "Loveli Lori",
        duration: "2:51",
        cover: LoveforYouCover,
        src: LoveforYouSong,
    },
    {
        id: 3,
        title: "Love",
        artist: "Wave To Earth",
        duration: "5:06",
        cover: LoveWaveToEarthCover,
        src: LoveWaveToEarthSong,
    },
    {
        id: 4,
        title: "Glue Song",
        artist: "Beabadoobee",
        duration: "2:16",
        cover: GlueSongCover,
        src: GlueSong,
    },
];


export type WindowContentType = "about" | "projects" | "contact" | "resume" | "blog" | "links" | "blank"

export interface SocialLink {
    platform: string
    url: string
    icon?: string // Lucide icon name or custom
    name?: string
    color?: string
}

export interface ProjectLink {
    title: string
    url: string
    description: string
    icon?: string
}

export interface LinksData {
    title?: string
    description?: string
    socials: SocialLink[]
    projects: ProjectLink[]
}

export interface Testimonial {
    name: string
    role: string
    content: string
    avatar?: string
}

export interface Hobby {
    name: string
    icon: string
    description: string
}

export interface AboutMeData {
    title: string
    subtitle: string
    description: string
    profileImage?: string
    skills: string[]
    testimonials: Testimonial[]
    hobbies: Hobby[]
}

// Union type for all template data
export interface ProjectItem {
    id: string
    title: string
    description: string
    image?: string
    tags: string[]
    demoUrl?: string
    githubUrl?: string | { frontend: string; backend: string }
}

export interface ProjectsData {
    title?: string
    description?: string
    projects?: ProjectItem[]
    layout?: 'grid' | 'carousel'
}

export interface ContactInfoItem {
    type: 'email' | 'phone' | 'location' | 'custom'
    value: string
    link?: string
    label?: string
}

export interface ContactData {
    title?: string
    description?: string
    email?: string
    phone?: string
    location?: string
    contactInfo?: ContactInfoItem[]
    socialLinks?: SocialLink[]
    showForm?: boolean
    mapUrl?: string
    formConfig?: {
        serviceId: string
        templateId: string
        publicKey: string
    }
}

export interface EducationItem {
    degree: string
    institution: string
    year: string
    description: string
}

export interface ExperienceItem {
    role: string
    company: string
    period: string
    achievements: string[]
}

export interface SkillCategory {
    name: string
    skills: string[]
    icon: string
}

export interface ResumeData {
    education?: EducationItem[]
    experience?: ExperienceItem[]
    leadership?: ExperienceItem[]
    skills?: SkillCategory[]
    interests?: string[]
}

export interface BlogData {
    source?: 'hashnode' | 'devto' | 'medium' | 'custom'
    username?: string
    rssUrl?: string
}

export type ComponentType = 'text' | 'image' | 'card' | 'carousel' | 'button' | 'divider' | 'spacer' | 'card-group' | 'vertical-separator'

export interface DraggableComponent {
    id: string
    type: ComponentType
    props: Record<string, any>
}

export interface BlankTemplateData {
    components: DraggableComponent[]
    backgroundColor?: string
    padding?: string
    gap?: string
}

export type TemplateData = LinksData | AboutMeData | ProjectsData | ContactData | ResumeData | BlogData | BlankTemplateData | any

export interface WindowContent {
    id: number
    name: string
    data: {
        type: WindowContentType
        template?: string
        description?: string
        content?: TemplateData
    }
    type: WindowContentType
    iconId: string
}

export type AssetType = "all" | "wallpaper" | "icon" | "music" | "sound"

export interface Asset {
    id: number
    fileId: string
    name: string
    type: AssetType
    size: string
    fileSize: number
    date: string
    url: string
    thumbnailUrl?: string
    portfolioId: number
    mimeType?: string
}