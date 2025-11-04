CREATE TABLE "desktop_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"wallpaper_asset_id" integer,
	"desktop_gif_asset_id" integer,
	"widget1_asset_id" integer,
	"widget2_asset_id" integer,
	"music_player_icon_asset_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "desktop_settings_portfolio_id_unique" UNIQUE("portfolio_id")
);
--> statement-breakpoint
CREATE TABLE "icons" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"icon_asset_id" integer,
	"link_url" text,
	"window_id" varchar(100),
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lock_screen_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"enabled" boolean DEFAULT true,
	"password" varchar(255),
	"hint" text,
	"wallpaper_asset_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lock_screen_settings_portfolio_id_unique" UNIQUE("portfolio_id")
);
--> statement-breakpoint
CREATE TABLE "music_tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"audio_asset_id" integer,
	"type" varchar(50) DEFAULT 'upload' NOT NULL,
	"duration" integer,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"asset_id" integer NOT NULL,
	CONSTRAINT "unique_portfolio_asset" UNIQUE("portfolio_id","asset_id")
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"portfolio_name" text DEFAULT 'MY PORTFOLIO' NOT NULL,
	"username" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"bio" text,
	"is_public" boolean DEFAULT true,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "portfolios_username_unique" UNIQUE("username"),
	CONSTRAINT "portfolios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sound_effects" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"effect_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"audio_asset_id" integer,
	"volume" integer DEFAULT 50,
	"enabled" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_effect_unique" UNIQUE("portfolio_id","effect_id")
);
--> statement-breakpoint
CREATE TABLE "theme_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"theme" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "theme_settings_portfolio_id_unique" UNIQUE("portfolio_id")
);
--> statement-breakpoint
CREATE TABLE "uploaded_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"asset_type" varchar(50) NOT NULL,
	"file_id" varchar(255) NOT NULL,
	"file_name" text NOT NULL,
	"download_url" text,
	"display_url" text,
	"thumbnail_url" text,
	"mime_type" varchar(100),
	"file_size" integer,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uploaded_assets_file_id_unique" UNIQUE("file_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100),
	"google_access_token" text,
	"google_refresh_token" text,
	"google_token_expiry" timestamp,
	"google_drive_connected" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "window_contents" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"window_id" varchar(100) NOT NULL,
	"name" varchar(255) NOT NULL,
	"enabled" boolean DEFAULT true,
	"position" integer DEFAULT 0 NOT NULL,
	"content" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_window_unique" UNIQUE("portfolio_id","window_id")
);
--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_wallpaper_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("wallpaper_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_desktop_gif_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("desktop_gif_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_widget1_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("widget1_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_widget2_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("widget2_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_music_player_icon_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("music_player_icon_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icons" ADD CONSTRAINT "icons_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icons" ADD CONSTRAINT "icons_icon_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("icon_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lock_screen_settings" ADD CONSTRAINT "lock_screen_settings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lock_screen_settings" ADD CONSTRAINT "lock_screen_settings_wallpaper_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("wallpaper_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_audio_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("audio_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_assets" ADD CONSTRAINT "portfolio_assets_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_assets" ADD CONSTRAINT "portfolio_assets_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_effects" ADD CONSTRAINT "sound_effects_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_effects" ADD CONSTRAINT "sound_effects_audio_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("audio_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_settings" ADD CONSTRAINT "theme_settings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_assets" ADD CONSTRAINT "uploaded_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "window_contents" ADD CONSTRAINT "window_contents_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "portfolio_assets_portfolio_id_idx" ON "portfolio_assets" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "portfolio_assets_asset_id_idx" ON "portfolio_assets" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "portfolio_user_id_idx" ON "portfolios" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "portfolio_slug_idx" ON "portfolios" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "assets_user_id_idx" ON "uploaded_assets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assets_file_id_idx" ON "uploaded_assets" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "clerk_user_id_idx" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "window_portfolio_id_idx" ON "window_contents" USING btree ("portfolio_id");