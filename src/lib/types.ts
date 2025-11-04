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