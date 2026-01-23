import { pgTable, serial, text, timestamp, boolean, jsonb, varchar, integer, unique, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================
// CORE TABLES
// ============================================

// Users table - extends Supabase user data
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    supabaseUserId: varchar('supabase_user_id', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull(),
    username: varchar('username', { length: 100 }).unique(),

    // Google Drive OAuth tokens (encrypted)
    googleAccessToken: text('google_access_token'),
    googleRefreshToken: text('google_refresh_token'),
    googleTokenExpiry: timestamp('google_token_expiry'),
    googleDriveConnected: boolean('google_drive_connected').default(false),

    // Spotify OAuth tokens (encrypted)
    spotifyAccessToken: text('spotify_access_token'),
    spotifyRefreshToken: text('spotify_refresh_token'),
    spotifyTokenExpiry: timestamp('spotify_token_expiry'),
    spotifyConnected: boolean('spotify_connected').default(false),
    avatarUrl: text('avatar_url'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    supabaseUserIdIdx: index('supabase_user_id_idx').on(table.supabaseUserId),
}))

// Portfolios table - main portfolio data
export const portfolios = pgTable('portfolios', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    // Basic Info
    portfolioName: text('portfolio_name').notNull().default('MY PORTFOLIO'),
    bio: text('bio'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    views: integer('views').default(0).notNull(),
}, (table) => ({
    userIdIdx: index('portfolio_user_id_idx').on(table.userId),
}))

// ============================================
// CONTENT TABLES
// ============================================

// Windows table (renamed from window_contents) - about, projects, contact, etc.
export const windows = pgTable('windows', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),

    // Optional link to an icon entry that opens this window
    iconId: integer('icon_id').references(() => icons.id, { onDelete: 'set null' }),

    // Content stored as JSON
    content: jsonb('content').$type<{
        type: string;
        template: string;
        description: string;
        content?: any;
    }>(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    portfolioIdIdx: index('windows_portfolio_id_idx').on(table.portfolioId),
    iconIdIdx: index('windows_icon_id_idx').on(table.iconId),
}))

// Icons table
export const icons = pgTable('icons', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }),

    name: varchar('name', { length: 255 }).notNull(),

    iconAssetId: integer('icon_asset_id').references(() => uploadedAssets.id, { onDelete: 'set null' }),
    iconImageUrl: text('icon_image_url'),

    // Link/Window
    linkType: varchar('link_type', { length: 20 }).default('window'),
    linkUrl: text('link_url'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================
// MEDIA & ASSETS TABLES
// ============================================

export const uploadedAssets = pgTable('uploaded_assets', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    assetType: varchar('asset_type', { length: 50 }).notNull(), // 'image', 'audio', 'icon', 'wallpaper'

    // Google Drive file info
    fileId: varchar('file_id', { length: 255 }).notNull().unique(),
    fileName: text('file_name').notNull(),

    mimeType: varchar('mime_type', { length: 100 }),
    fileSize: integer('file_size'), // in bytes

    uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('assets_user_id_idx').on(table.userId),
    fileIdIdx: index('assets_file_id_idx').on(table.fileId),
}))

export const portfolioAssets = pgTable('portfolio_assets', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id')
        .notNull()
        .references(() => portfolios.id, { onDelete: 'cascade' }),
    assetId: integer('asset_id')
        .notNull()
        .references(() => uploadedAssets.id, { onDelete: 'cascade' }),
}, (table) => ({
    uniquePortfolioAsset: unique('unique_portfolio_asset').on(table.portfolioId, table.assetId),
    portfolioIdIdx: index('portfolio_assets_portfolio_id_idx').on(table.portfolioId),
    assetIdIdx: index('portfolio_assets_asset_id_idx').on(table.assetId),
}))

// Sound effects table - simplified to store only preset ID with portfolio ID
export const soundEffects = pgTable('sound_effects', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }).unique(),

    // Store only the preset ID (e.g., 'arcade', 'nintendo', 'minimal', 'sci-fi', 'retro-pop')
    presetId: varchar('preset_id', { length: 50 }).notNull().default('arcade'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================
// SETTINGS TABLES
// ============================================

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
        font: string
        taskbarStyleId?: string
        menubarStyleId?: string
    }>(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Lock screen settings table
export const lockScreenSettings = pgTable('lock_screen_settings', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }).unique(),

    enabled: boolean('enabled').default(true),
    password: varchar('password', { length: 255 }),

    wallpaperAssetId: integer('wallpaper_asset_id').references(() => uploadedAssets.id, { onDelete: 'set null' }),
    wallpaperUrl: text('wallpaper_url'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Desktop settings table
export const desktopSettings = pgTable('desktop_settings', {
    id: serial('id').primaryKey(),
    portfolioId: integer('portfolio_id').notNull().references(() => portfolios.id, { onDelete: 'cascade' }).unique(),

    wallpaperAssetId: integer('wallpaper_asset_id').references(() => uploadedAssets.id, { onDelete: 'set null' }),
    wallpaperUrl: text('wallpaper_url'),
    desktopGifAssetId: integer('desktop_gif_asset_id').references(() => uploadedAssets.id, { onDelete: 'set null' }),
    desktopGifUrl: text('desktop_gif_url'),
    widget1AssetId: integer('widget1_asset_id').references(() => uploadedAssets.id, { onDelete: 'set null' }),
    widget1Url: text('widget1_url'),
    widget2AssetId: integer('widget2_asset_id').references(() => uploadedAssets.id, { onDelete: 'set null' }),
    widget2Url: text('widget2_url'),
    musicPlayerIconAssetId: integer('music_player_icon_asset_id').references(() => uploadedAssets.id, { onDelete: 'set null' }),

    // Spotify playlist URL to drive the music player via Web Playback SDK
    spotifyPlaylistUrl: text('spotify_playlist_url'),

    // Menu Bar Customization 
    // Menu Bar Customization
    menubarIconAssetId: integer('menubar_icon_asset_id').references(() => uploadedAssets.id, { onDelete: 'set null' }),
    menubarIconUrl: text('menubar_icon_url'),
    menubarText: varchar('menubar_text', { length: 100 }),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// ============================================
// ANALYTICS & ACTIVITY TABLES
// ============================================

export const userActivities = pgTable('user_activities', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    actionType: varchar('action_type', { length: 50 }).notNull(), // 'CREATED', 'UPLOADED', 'PUBLISHED', 'UPDATED'
    description: text('description').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('activities_user_id_idx').on(table.userId),
}))

export const userChecklistItems = pgTable('user_checklist_items', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

    taskId: varchar('task_id', { length: 50 }).notNull(), // 'CREATE_PORTFOLIO', 'UPLOAD_WALLPAPER', 'ADD_ICONS', 'EMBED_MUSIC', 'PUBLISH_PORTFOLIO'
    isDone: boolean('is_done').default(false).notNull(),

    completedAt: timestamp('completed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
    uniqueUserTask: unique('unique_user_task').on(table.userId, table.taskId),
    userIdIdx: index('checklist_user_id_idx').on(table.userId),
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
    portfolioAssets: many(portfolioAssets),
    icons: many(icons),
    // Keep relation key name for API compatibility, but point to windows table
    windowContents: many(windows),
    themeSettings: one(themeSettings),
    soundEffects: many(soundEffects),
    lockScreenSettings: one(lockScreenSettings),
    desktopSettings: one(desktopSettings),
}))

export const uploadedAssetsRelations = relations(uploadedAssets, ({ one, many }) => ({
    user: one(users, {
        fields: [uploadedAssets.userId],
        references: [users.id],
    }),
    portfolioLinks: many(portfolioAssets),
    icons: many(icons),
    lockScreenSettings: many(lockScreenSettings),
    desktopSettings: many(desktopSettings),
    // Removed soundEffects relation since we're now only storing preset IDs
}))

export const portfolioAssetsRelations = relations(portfolioAssets, ({ one }) => ({
    portfolio: one(portfolios, {
        fields: [portfolioAssets.portfolioId],
        references: [portfolios.id],
    }),
    asset: one(uploadedAssets, {
        fields: [portfolioAssets.assetId],
        references: [uploadedAssets.id],
    }),
}))

export const iconsRelations = relations(icons, ({ one }) => ({
    portfolio: one(portfolios, {
        fields: [icons.portfolioId],
        references: [portfolios.id],
    }),
    asset: one(uploadedAssets, {
        fields: [icons.iconAssetId],
        references: [uploadedAssets.id],
    }),
}))

// musicTracks removed – Spotify-only flow

export const soundEffectsRelations = relations(soundEffects, ({ one }) => ({
    portfolio: one(portfolios, {
        fields: [soundEffects.portfolioId],
        references: [portfolios.id],
    }),
    // Removed asset relation since we're now only storing preset IDs
}))

export const lockScreenSettingsRelations = relations(lockScreenSettings, ({ one }) => ({
    portfolio: one(portfolios, {
        fields: [lockScreenSettings.portfolioId],
        references: [portfolios.id],
    }),
    wallpaperAsset: one(uploadedAssets, {
        fields: [lockScreenSettings.wallpaperAssetId],
        references: [uploadedAssets.id],
    }),
}))

export const desktopSettingsRelations = relations(desktopSettings, ({ one }) => ({
    portfolio: one(portfolios, {
        fields: [desktopSettings.portfolioId],
        references: [portfolios.id],
    }),
    wallpaperAsset: one(uploadedAssets, {
        fields: [desktopSettings.wallpaperAssetId],
        references: [uploadedAssets.id],
    }),
    desktopGifAsset: one(uploadedAssets, {
        fields: [desktopSettings.desktopGifAssetId],
        references: [uploadedAssets.id],
    }),
    widget1Asset: one(uploadedAssets, {
        fields: [desktopSettings.widget1AssetId],
        references: [uploadedAssets.id],
    }),
    widget2Asset: one(uploadedAssets, {
        fields: [desktopSettings.widget2AssetId],
        references: [uploadedAssets.id],
    }),
    musicPlayerIconAsset: one(uploadedAssets, {
        fields: [desktopSettings.musicPlayerIconAssetId],
        references: [uploadedAssets.id],
    }),
    menubarIconAsset: one(uploadedAssets, {
        fields: [desktopSettings.menubarIconAssetId],
        references: [uploadedAssets.id],
    }),
}))
