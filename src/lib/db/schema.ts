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

// Lock Screen Settings
export const lockScreenSettings = pgTable('lock_screen_settings', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }).unique(),

    enabled: boolean('enabled').default(true),
    password: varchar('password', { length: 255 }),
    hint: text('hint'),

    // Lock screen wallpaper
    wallpaperFileId: varchar('wallpaper_file_id', { length: 255 }),
    wallpaperUrl: text('wallpaper_url'),
    wallpaperFileName: text('wallpaper_file_name'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Desktop Settings
export const desktopSettings = pgTable('desktop_settings', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }).unique(),

    // Desktop wallpaper
    wallpaperFileId: varchar('wallpaper_file_id', { length: 255 }),
    wallpaperUrl: text('wallpaper_url'),
    wallpaperFileName: text('wallpaper_file_name'),

    // Desktop GIF/Image
    desktopGifFileId: varchar('desktop_gif_file_id', { length: 255 }),
    desktopGifUrl: text('desktop_gif_url'),
    desktopGifFileName: text('desktop_gif_file_name'),

    // Mobile widgets
    widget1FileId: varchar('widget1_file_id', { length: 255 }),
    widget1Url: text('widget1_url'),
    widget2FileId: varchar('widget2_file_id', { length: 255 }),
    widget2Url: text('widget2_url'),

    // Music player icon
    musicPlayerIconFileId: varchar('music_player_icon_file_id', { length: 255 }),
    musicPlayerIconUrl: text('music_player_icon_url'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Icons table - desktop icons
export const icons = pgTable('icons', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),
    position: integer('position').notNull().default(0),

    // Icon image
    iconFileId: varchar('icon_file_id', { length: 255 }),
    iconUrl: text('icon_url').notNull(),
    iconFileName: text('icon_file_name'),

    // Link/Window
    linkUrl: text('link_url'),
    windowId: varchar('window_id', { length: 100 }), // Links to window content

    isVisible: boolean('is_visible').default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    portfolioIdIdx: index('icons_portfolio_id_idx').on(table.portfolioId),
}))

// Music tracks table
export const musicTracks = pgTable('music_tracks', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),
    position: integer('position').notNull().default(0),

    // Audio file
    audioFileId: varchar('audio_file_id', { length: 255 }),
    audioUrl: text('audio_url').notNull(),
    audioFileName: text('audio_file_name'),

    type: varchar('type', { length: 50 }).notNull().default('upload'), // 'upload' or 'spotify'
    duration: integer('duration'), // in seconds

    isVisible: boolean('is_visible').default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    portfolioIdIdx: index('music_portfolio_id_idx').on(table.portfolioId),
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
        data: any
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

// Sound effects table
export const soundEffects = pgTable('sound_effects', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    effectId: varchar('effect_id', { length: 100 }).notNull(), // 'click', 'hover', 'open', 'close'
    name: varchar('name', { length: 255 }).notNull(),

    audioFileId: varchar('audio_file_id', { length: 255 }),
    audioUrl: text('audio_url'),

    volume: integer('volume').default(50), // 0-100
    enabled: boolean('enabled').default(true),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    portfolioEffectIdx: unique('portfolio_effect_unique').on(table.portfolioId, table.effectId),
}))

// Uploaded assets table - tracks all files uploaded to Google Drive
export const uploadedAssets = pgTable('uploaded_assets', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    portfolioId: integer('portfolio_id').references(() => portfolios.id, { onDelete: 'cascade' }),

    assetType: varchar('asset_type', { length: 50 }).notNull(), // 'image', 'audio', 'icon', 'wallpaper'

    // Google Drive file info
    fileId: varchar('file_id', { length: 255 }).notNull().unique(),
    fileName: text('file_name').notNull(),
    fileUrl: text('file_url').notNull(),
    thumbnailUrl: text('thumbnail_url'),

    mimeType: varchar('mime_type', { length: 100 }),
    fileSize: integer('file_size'), // in bytes

    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('assets_user_id_idx').on(table.userId),
    portfolioIdIdx: index('assets_portfolio_id_idx').on(table.portfolioId),
    fileIdIdx: index('assets_file_id_idx').on(table.fileId),
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
