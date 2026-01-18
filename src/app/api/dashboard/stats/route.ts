
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getDashboardStats } from "@/lib/activity";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();

        if (!supabaseUser) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Get DB user
        const user = await db.query.users.findFirst({
            where: eq(users.supabaseUserId, supabaseUser.id),
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Use shared logic
        const data = await getDashboardStats(user.id);

        return NextResponse.json(data);

    } catch (error) {
        console.error("[DASHBOARD_STATS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
