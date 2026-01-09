
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { portfolios } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { portfolioId } = body;

        if (!portfolioId) {
            return new NextResponse("Portfolio ID required", { status: 400 });
        }

        await db
            .update(portfolios)
            .set({
                views: sql`${portfolios.views} + 1`,
            })
            .where(eq(portfolios.id, parseInt(portfolioId)));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[PORTFOLIO_VIEW]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
