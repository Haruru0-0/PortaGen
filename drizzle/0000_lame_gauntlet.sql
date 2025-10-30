CREATE TABLE "desktop_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"wallpaper_file_id" varchar(255),
	"wallpaper_url" text,
	"wallpaper_file_name" text,
	"desktop_gif_file_id" varchar(255),
	"desktop_gif_url" text,
	"desktop_gif_file_name" text,
	"widget1_file_id" varchar(255),
	"widget1_url" text,
	"widget2_file_id" varchar(255),
	"widget2_url" text,
	"music_player_icon_file_id" varchar(255),
	"music_player_icon_url" text,
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
	"icon_file_id" varchar(255),
	"icon_url" text,
	"icon_file_name" text,
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
	"wallpaper_file_id" varchar(255),
	"wallpaper_url" text,
	"wallpaper_file_name" text,
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
	"audio_file_id" varchar(255),
	"audio_url" text NOT NULL,
	"audio_file_name" text,
	"type" varchar(50) DEFAULT 'upload' NOT NULL,
	"duration" integer,
	"is_visible" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
	"audio_file_id" varchar(255),
	"audio_url" text,
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
	"portfolio_id" integer,
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
ALTER TABLE "icons" ADD CONSTRAINT "icons_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lock_screen_settings" ADD CONSTRAINT "lock_screen_settings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_effects" ADD CONSTRAINT "sound_effects_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_settings" ADD CONSTRAINT "theme_settings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_assets" ADD CONSTRAINT "uploaded_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_assets" ADD CONSTRAINT "uploaded_assets_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "window_contents" ADD CONSTRAINT "window_contents_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "portfolio_user_id_idx" ON "portfolios" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "portfolio_slug_idx" ON "portfolios" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "assets_user_id_idx" ON "uploaded_assets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assets_portfolio_id_idx" ON "uploaded_assets" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "assets_file_id_idx" ON "uploaded_assets" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "clerk_user_id_idx" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "window_portfolio_id_idx" ON "window_contents" USING btree ("portfolio_id");