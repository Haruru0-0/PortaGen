export type HeroMedia = {
    entranceSrc: string;
    emptyPoster: string;
    settledPoster: string;
};
export const INTRO_STORAGE_KEY = 'portagen:blue-hour-intro:v1';
export const HERO_MEDIA: HeroMedia = { entranceSrc: '/media/blue-hour/shin-entrance.mp4', emptyPoster: '/media/blue-hour/empty-water.webp', settledPoster: '/media/blue-hour/settled-shin.webp' };
export const ENTRANCE_TIMEOUT_MS = 2000;
