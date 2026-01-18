ALTER TABLE "users" RENAME COLUMN "clerk_user_id" TO "supabase_user_id";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_clerk_user_id_unique";--> statement-breakpoint
DROP INDEX "supabase_user_id_idx";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_url" text;--> statement-breakpoint
CREATE INDEX "supabase_user_id_idx" ON "users" USING btree ("supabase_user_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_supabase_user_id_unique" UNIQUE("supabase_user_id");