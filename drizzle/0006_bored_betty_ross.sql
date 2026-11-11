ALTER TABLE "desktop_settings" ADD COLUMN "mobile_wallpaper_asset_id" integer;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD COLUMN "mobile_wallpaper_url" text;--> statement-breakpoint
ALTER TABLE "lock_screen_settings" ADD COLUMN "mobile_wallpaper_asset_id" integer;--> statement-breakpoint
ALTER TABLE "lock_screen_settings" ADD COLUMN "mobile_wallpaper_url" text;--> statement-breakpoint
ALTER TABLE "desktop_settings" ADD CONSTRAINT "desktop_settings_mobile_wallpaper_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("mobile_wallpaper_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lock_screen_settings" ADD CONSTRAINT "lock_screen_settings_mobile_wallpaper_asset_id_uploaded_assets_id_fk" FOREIGN KEY ("mobile_wallpaper_asset_id") REFERENCES "public"."uploaded_assets"("id") ON DELETE set null ON UPDATE no action;