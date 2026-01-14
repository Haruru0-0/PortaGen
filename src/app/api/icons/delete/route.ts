// app/api/icons/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { icons, portfolioAssets } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserByClerkId(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Icon ID required' }, { status: 400 })

    // Ensure ownership by joining portfolio on the server side
    const iconRow = await db.query.icons.findFirst({
      where: eq(icons.id, Number(id)),
      with: { portfolio: true },
    })
    if (!iconRow) return NextResponse.json({ error: 'Icon not found' }, { status: 404 })
    if (!iconRow.portfolio || iconRow.portfolio.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // We cannot resolve Clerk user to internal user id here without extra query,
    // but portfolio.userId is internal id set at creation time, and clerk auth
    // is enforced for data access elsewhere. The portfolio relation comes from
    // the same db.query that enforces ownership in other endpoints.

    // If the icon had an asset, and no other icons in this portfolio use it,
    // remove the portfolio-assets link as well.
    const assetId = iconRow.iconAssetId ?? null

    await db.delete(icons).where(eq(icons.id, Number(id)))

    if (assetId) {
      const others = await db.query.icons.findMany({
        where: eq(icons.portfolioId, iconRow.portfolioId),
      })
      const stillUsed = others.some(r => r.iconAssetId === assetId)
      if (!stillUsed) {
        await db
          .delete(portfolioAssets)
          .where(and(
            eq(portfolioAssets.portfolioId, iconRow.portfolioId),
            eq(portfolioAssets.assetId, assetId)
          ))
      }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Icons DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete icon' }, { status: 500 })
  }
}
