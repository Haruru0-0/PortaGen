ALTER TABLE "uploaded_assets" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "google_access_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "google_refresh_token";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "google_token_expiry";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "google_drive_connected";