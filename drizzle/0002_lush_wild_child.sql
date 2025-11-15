ALTER TABLE "window_contents" RENAME TO "windows";--> statement-breakpoint
ALTER TABLE "windows" DROP CONSTRAINT "portfolio_window_unique";--> statement-breakpoint
ALTER TABLE "windows" DROP CONSTRAINT "window_contents_portfolio_id_portfolios_id_fk";
--> statement-breakpoint
DROP INDEX "window_portfolio_id_idx";--> statement-breakpoint
ALTER TABLE "icons" ADD COLUMN "link_type" varchar(20) DEFAULT 'window';--> statement-breakpoint
ALTER TABLE "windows" ADD COLUMN "icon_id" integer;--> statement-breakpoint
ALTER TABLE "windows" ADD CONSTRAINT "windows_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "windows" ADD CONSTRAINT "windows_icon_id_icons_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."icons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "windows_portfolio_id_idx" ON "windows" USING btree ("portfolio_id");--> statement-breakpoint
CREATE INDEX "windows_icon_id_idx" ON "windows" USING btree ("icon_id");--> statement-breakpoint
ALTER TABLE "windows" ADD CONSTRAINT "windows_portfolio_window_unique" UNIQUE("portfolio_id","window_id");