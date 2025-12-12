ALTER TABLE "sound_effects" DROP CONSTRAINT "portfolio_effect_unique";--> statement-breakpoint
ALTER TABLE "sound_effects" DROP CONSTRAINT "sound_effects_audio_asset_id_uploaded_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "sound_effects" ADD COLUMN "preset_id" varchar(50) DEFAULT 'arcade' NOT NULL;--> statement-breakpoint
ALTER TABLE "sound_effects" DROP COLUMN "effect_id";--> statement-breakpoint
ALTER TABLE "sound_effects" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "sound_effects" DROP COLUMN "audio_asset_id";--> statement-breakpoint
ALTER TABLE "sound_effects" DROP COLUMN "volume";--> statement-breakpoint
ALTER TABLE "sound_effects" DROP COLUMN "enabled";--> statement-breakpoint
ALTER TABLE "sound_effects" ADD CONSTRAINT "sound_effects_portfolio_id_unique" UNIQUE("portfolio_id");