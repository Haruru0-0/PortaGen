
import { db } from "@/lib/db";
import { userActivities, userChecklistItems, portfolios, uploadedAssets } from "@/lib/db/schema";
import { eq, desc, count, sql } from "drizzle-orm";

export type ActivityActionType = 'CREATED' | 'UPLOADED' | 'PUBLISHED' | 'UPDATED' | 'DELETED';
export type ChecklistTaskType = 'CREATE_PORTFOLIO' | 'UPLOAD_WALLPAPER' | 'ADD_DESKTOP_ICONS' | 'EMBED_MUSIC' | 'PUBLISH_PORTFOLIO';

/**
 * Logs a user activity to the database.
 */
export async function logActivity(userId: number, actionType: ActivityActionType, description: string) {
    try {
        await db.insert(userActivities).values({
            userId,
            actionType,
            description,
        });
    } catch (error) {
        console.error("Error logging activity:", error);
        // Don't throw error to prevent blocking main action
    }
}

/**
 * Marks a checklist task as completed for a user.
 * If the task is already completed, this does nothing.
 */
export async function completeChecklistTask(userId: number, taskId: ChecklistTaskType) {
    try {
        // Check if already completed to avoid duplicate unique constraint errors (though schema has unique constraint)
        // Using ON CONFLICT DO NOTHING is cleaner
        await db.insert(userChecklistItems)
            .values({
                userId,
                taskId,
                isDone: true,
                completedAt: new Date(),
            })
            .onConflictDoNothing({
                target: [userChecklistItems.userId, userChecklistItems.taskId]
            });

    } catch (error) {
        console.error(`Error completing checklist task ${taskId}:`, error);
    }
}

/**
 * Gets the status of all checklist items for a user.
 * Returns a map of taskId -> boolean
 */
export async function getUserChecklist(userId: number) {
    const items = await db.select().from(userChecklistItems).where(eq(userChecklistItems.userId, userId));

    // Default state
    const checklistState: Record<ChecklistTaskType, boolean> = {
        'CREATE_PORTFOLIO': false,
        'UPLOAD_WALLPAPER': false,
        'ADD_DESKTOP_ICONS': false,
        'EMBED_MUSIC': false,
        'PUBLISH_PORTFOLIO': false,
    };

    items.forEach(item => {
        if (item.taskId in checklistState) {
            checklistState[item.taskId as ChecklistTaskType] = item.isDone;
        }
    });

    return checklistState;
}

export async function getDashboardStats(userId: number) {
    // 1. Get Checklist Status
    const checklist = await getUserChecklist(userId);

    // 2. Get Recent Activity
    const recentActivity = await db.query.userActivities.findMany({
        where: eq(userActivities.userId, userId),
        orderBy: [desc(userActivities.createdAt)],
        limit: 10,
    });

    // 3. Get Stats
    // - Total Portfolios
    const [portfolioCountResult] = await db
        .select({ count: count() })
        .from(portfolios)
        .where(eq(portfolios.userId, userId));

    // - Total Assets
    const [assetCountResult] = await db
        .select({ count: count() })
        .from(uploadedAssets)
        .where(eq(uploadedAssets.userId, userId));

    // - Total Views (Sum of views from all portfolios)
    const [viewsResult] = await db
        .select({ totalViews: sql<number>`sum(${portfolios.views})` })
        .from(portfolios)
        .where(eq(portfolios.userId, userId));

    return {
        checklist,
        recentActivity,
        stats: {
            portfolioCount: portfolioCountResult.count,
            assetCount: assetCountResult.count,
            totalViews: viewsResult.totalViews || 0,
            themesCount: portfolioCountResult.count, // Placeholder as discussed
        }
    };
}
