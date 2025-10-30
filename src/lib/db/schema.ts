import { pgTable, serial, text, timestamp, boolean, jsonb, varchar, integer, unique, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table - extends Clerk user data
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull(),
    username: varchar('username', { length: 100 }).unique(),

    // Google Drive OAuth tokens (encrypted)
    googleAccessToken: text('google_access_token'),
    googleRefreshToken: text('google_refresh_token'),
    googleTokenExpiry: timestamp('google_token_expiry'),
    googleDriveConnected: boolean('google_drive_connected').default(false),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    clerkUserIdIdx: index('clerk_user_id_idx').on(table.clerkUserId),
}))

// Portfolios table - main portfolio data
export const portfolios = pgTable('portfolios', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    // Basic Info
    portfolioName: text('portfolio_name').notNull().default('MY PORTFOLIO'),
    username: varchar('username', { length: 100 }).notNull().unique(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    bio: text('bio'),

    // Privacy
    isPublic: boolean('is_public').default(true),
    isPublished: boolean('is_published').default(false),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('portfolio_user_id_idx').on(table.userId),
    slugIdx: index('portfolio_slug_idx').on(table.slug),
}))

// Window contents table - about, projects, contact, etc.
export const windowContents = pgTable('window_contents', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    windowId: varchar('window_id', { length: 100 }).notNull(), // 'about', 'projects', 'contact', etc.
    name: varchar('name', { length: 255 }).notNull(),

    enabled: boolean('enabled').default(true),
    position: integer('position').notNull().default(0),

    // Content stored as JSON
    content: jsonb('content').$type<{
        type: 'text' | 'markdown' | 'html' | 'projects' | 'links'
        data: string
    }>(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    portfolioWindowIdx: unique('portfolio_window_unique').on(table.portfolioId, table.windowId),
    portfolioIdIdx: index('window_portfolio_id_idx').on(table.portfolioId),
}))

// Theme settings table
export const themeSettings = pgTable('theme_settings', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }).unique(),

    // Theme colors and settings as JSON
    theme: jsonb('theme').$type<{
        name: string
        colors: {
            primary: string
            secondary: string
            accent: string
            background: string
            text: string
        }
        fonts: {
            primary: string
            secondary: string
        }
    }>(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const uploadedAssets = pgTable('uploaded_assets', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    portfolioId: integer('portfolio_id').references(() => portfolios.id, { onDelete: 'cascade' }),

    assetType: varchar('asset_type', { length: 50 }).notNull(), // 'image', 'audio', 'icon', 'wallpaper'

    // Google Drive file info
    fileId: varchar('file_id', { length: 255 }).notNull().unique(),
    fileName: text('file_name').notNull(),

    // THREE SEPARATE URLS FOR DIFFERENT USE CASES:
    downloadUrl: text('download_url'),        // For actual file downloads
    displayUrl: text('display_url'),          // For image display in img tags
    thumbnailUrl: text('thumbnail_url'),      // For thumbnails in lists/grids

    mimeType: varchar('mime_type', { length: 100 }),
    fileSize: integer('file_size'), // in bytes

    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('assets_user_id_idx').on(table.userId),
    portfolioIdIdx: index('assets_portfolio_id_idx').on(table.portfolioId),
    fileIdIdx: index('assets_file_id_idx').on(table.fileId),
}))

// Also update other tables that reference assets:
export const icons = pgTable('icons', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),
    position: integer('position').notNull().default(0),

    // Icon image - store both file reference and display URL
    iconFileId: varchar('icon_file_id', { length: 255 }),
    iconUrl: text('icon_url'),                // Display URL for the icon
    iconFileName: text('icon_file_name'),

    // Link/Window
    linkUrl: text('link_url'),
    windowId: varchar('window_id', { length: 100 }), // Links to window content

    isVisible: boolean('is_visible').default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const lockScreenSettings = pgTable('lock_screen_settings', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }).unique(),

    enabled: boolean('enabled').default(true),
    password: varchar('password', { length: 255 }),
    hint: text('hint'),

    // Lock screen wallpaper - store display URL
    wallpaperFileId: varchar('wallpaper_file_id', { length: 255 }),
    wallpaperUrl: text('wallpaper_url'),      // Display URL for wallpaper
    wallpaperFileName: text('wallpaper_file_name'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const desktopSettings = pgTable('desktop_settings', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }).unique(),

    // Desktop wallpaper - store display URL
    wallpaperFileId: varchar('wallpaper_file_id', { length: 255 }),
    wallpaperUrl: text('wallpaper_url'),      // Display URL
    wallpaperFileName: text('wallpaper_file_name'),

    // Desktop GIF/Image - store display URL
    desktopGifFileId: varchar('desktop_gif_file_id', { length: 255 }),
    desktopGifUrl: text('desktop_gif_url'),   // Display URL
    desktopGifFileName: text('desktop_gif_file_name'),

    // Mobile widgets - store display URLs
    widget1FileId: varchar('widget1_file_id', { length: 255 }),
    widget1Url: text('widget1_url'),          // Display URL
    widget2FileId: varchar('widget2_file_id', { length: 255 }),
    widget2Url: text('widget2_url'),          // Display URL

    // Music player icon - store display URL
    musicPlayerIconFileId: varchar('music_player_icon_file_id', { length: 255 }),
    musicPlayerIconUrl: text('music_player_icon_url'), // Display URL

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const musicTracks = pgTable('music_tracks', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),
    position: integer('position').notNull().default(0),

    // Audio file - use download URL for audio playback
    audioFileId: varchar('audio_file_id', { length: 255 }),
    audioUrl: text('audio_url').notNull(),    // Download URL for audio files
    audioFileName: text('audio_file_name'),

    type: varchar('type', { length: 50 }).notNull().default('upload'), // 'upload' or 'spotify'
    duration: integer('duration'), // in seconds

    isVisible: boolean('is_visible').default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const soundEffects = pgTable('sound_effects', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    effectId: varchar('effect_id', { length: 100 }).notNull(), // 'click', 'hover', 'open', 'close'
    name: varchar('name', { length: 255 }).notNull(),

    audioFileId: varchar('audio_file_id', { length: 255 }),
    audioUrl: text('audio_url'),              // Download URL for audio files

    volume: integer('volume').default(50), // 0-100
    enabled: boolean('enabled').default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    portfolioEffectIdx: unique('portfolio_effect_unique').on(table.portfolioId, table.effectId),
}))
// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
    portfolios: many(portfolios),
    uploadedAssets: many(uploadedAssets),
}))

export const portfoliosRelations = relations(portfolios, ({ one, many }) => ({
    user: one(users, {
        fields: [portfolios.userId],
        references: [users.id],
    }),
    lockScreenSettings: one(lockScreenSettings),
    desktopSettings: one(desktopSettings),
    icons: many(icons),
    musicTracks: many(musicTracks),
    windowContents: many(windowContents),
    themeSettings: one(themeSettings),
    soundEffects: many(soundEffects),
    uploadedAssets: many(uploadedAssets),
}))
