CREATE TABLE "desktop_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"wallpaper_asset_id" integer,
	"desktop_gif_asset_id" integer,
	"widget1_asset_id" integer,
	"widget2_asset_id" integer,
	"music_player_icon_asset_id" integer,
	"spotify_playlist_url" text,
	"menubar_icon_asset_id" integer,
	"menubar_text" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "desktop_settings_portfolio_id_unique" UNIQUE("portfolio_id")
);
--> statement-breakpoint
CREATE TABLE "icons" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon_asset_id" integer,
	"link_type" varchar(20) DEFAULT 'window',
	"link_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lock_screen_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"enabled" boolean DEFAULT true,
	"password" varchar(255),
	"wallpaper_asset_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lock_screen_settings_portfolio_id_unique" UNIQUE("portfolio_id")
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
	"bio" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"views" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sound_effects" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"preset_id" varchar(50) DEFAULT 'arcade' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sound_effects_portfolio_id_unique" UNIQUE("portfolio_id")
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
	"mime_type" varchar(100),
	"file_size" integer,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uploaded_assets_file_id_unique" UNIQUE("file_id")
);
--> statement-breakpoint
CREATE TABLE "user_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action_type" varchar(50) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_checklist_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"task_id" varchar(50) NOT NULL,
	"is_done" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_task" UNIQUE("user_id","task_id")
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
	"spotify_access_token" text,
	"spotify_refresh_token" text,
	"spotify_token_expiry" timestamp,
	"spotify_connected" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "windows" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon_id" integer,
	"content" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_wallpaper_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("wallpaper_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_desktop_gif_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("desktop_gif_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_widget1_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("widget1_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_widget2_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("widget2_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_music_player_icon_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("music_player_icon_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_menubar_icon_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("menubar_icon_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icons" ADD CONSTRAINT "icons_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "icons" ADD CONSTRAINT "icons_icon_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("icon_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lock_screen_settings" ADD CONSTRAINT "lock_screen_settings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lock_screen_settings" ADD CONSTRAINT "lock_screen_settings_wallpaper_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("wallpaper_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_assets" ADD CONSTRAINT "portfolio_assets_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_assets" ADD CONSTRAINT "portfolio_assets_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sound_effects" ADD CONSTRAINT "sound_effects_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_settings" ADD CONSTRAINT "theme_settings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploaded_assets" ADD CONSTRAINT "uploaded_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_checklist_items" ADD CONSTRAINT "user_checklist_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "windows" ADD CONSTRAINT "windows_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "windows" ADD CONSTRAINT "windows_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "portfolio_assets_portfolio_id_idx" ON "portfolio_assets" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "portfolio_assets_asset_id_idx" ON "portfolio_assets" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "portfolio_user_id_idx" ON "portfolios" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assets_user_id_idx" ON "uploaded_assets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "assets_file_id_idx" ON "uploaded_assets" USING btree ("file_id");--> statement-breakpoint
CREATE INDEX "activities_user_id_idx" ON "user_activities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "checklist_user_id_idx" ON "user_checklist_items" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "clerk_user_id_idx" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE INDEX "windows_portfolio_id_idx" ON "windows" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "windows_icon_id_idx" ON "windows" USING btree ("icon_id");