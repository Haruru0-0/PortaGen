ALTER TABLE "portfolios" DROP CONSTRAINT "portfolios_username_unique";--> statement-breakpoint
ALTER TABLE "portfolios" DROP CONSTRAINT "portfolios_slug_unique";--> statement-breakpoint
DROP INDEX "portfolio_slug_idx";--> statement-breakpoint
ALTER TABLE "portfolios" DROP COLUMN "username";--> statement-breakpoint
ALTER TABLE "portfolios" DROP COLUMN "slug";--> statement-breakpoint
ALTER TABLE "portfolios" DROP COLUMN "is_public";--> statement-breakpoint
ALTER TABLE "portfolios" DROP COLUMN "is_published";