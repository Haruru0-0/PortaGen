DROP INDEX "clerk_user_id_idx";--> statement-breakpoint
CREATE INDEX "supabase_user_id_idx" ON "users" USING btree ("clerk_user_id");