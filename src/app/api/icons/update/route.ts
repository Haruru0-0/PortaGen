// app/api/icons/update/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { icons, portfolios, portfolioAssets, windows } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

async function formatIconResponse(id: number) {
  const row = await db.query.icons.findFirst({
    where: eq(icons.id, id),
    with: { asset: true },
  })
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    linkType: row.linkType || 'window',
    url: row.linkUrl || undefined,
    iconAssetId: row.iconAssetId || undefined,
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserByClerkId(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json().catch(() => ({}))
    const { id, portfolioId, name, url, fileId, linkType } = body || {}

    if (!id) return NextResponse.json({ error: 'Icon ID required' }, { status: 400 })
    if (!portfolioId) return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })

    // Verify ownership
    const owned = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
    })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const payload: Partial<typeof icons.$inferInsert> = {
      name,
      linkType: (linkType === 'url' || linkType === 'window') ? linkType : undefined,
      linkUrl: linkType === 'url' ? url : (linkType === 'window' ? '' : undefined),
      iconAssetId: fileId != null && fileId !== '' ? Number(fileId) : undefined,
      updatedAt: new Date(),
    }

    // Fetch current icon to compare asset links
    const current = await db.query.icons.findFirst({
      where: and(eq(icons.id, Number(id)), eq(icons.portfolioId, portfolioId)),
    })

    const [updated] = await db
      .update(icons)
      .set(payload)
      .where(and(eq(icons.id, Number(id)), eq(icons.portfolioId, portfolioId)))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Icon not found' }, { status: 404 })
    // Maintain portfolio_assets mapping on asset change
    const oldAssetId = current?.iconAssetId ?? null
    const newAssetId = updated.iconAssetId ?? null
    if (newAssetId && newAssetId !== oldAssetId) {
      try {
        await db
          .insert(portfolioAssets)
          .values({ portfolioId, assetId: newAssetId })
          .onConflictDoNothing({ target: [portfolioAssets.portfolioId, portfolioAssets.assetId] })
      } catch { }
    }
    if (oldAssetId && oldAssetId !== newAssetId) {
      const others = await db.query.icons.findMany({
        where: and(eq(icons.portfolioId, portfolioId)),
      })
      const stillUsed = others.some(r => r.iconAssetId === oldAssetId && r.id !== updated.id)
      if (!stillUsed) {
        await db
          .delete(portfolioAssets)
          .where(and(eq(portfolioAssets.portfolioId, portfolioId), eq(portfolioAssets.assetId, oldAssetId)))
      }
    }

    // If changed to window type, ensure a windows row exists bound to this icon
    try {
      if (linkType === 'window' && updated) {
        const existingWin = await db.query.windows.findFirst({ where: eq(windows.iconId, updated.id) })
        if (!existingWin) {
          await db.insert(windows).values({ portfolioId, name: name || 'New Window', iconId: updated.id })
        }
      }
    } catch { }

    const formatted = await formatIconResponse(updated.id)
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Icons UPDATE error:', error)
    return NextResponse.json({ error: 'Failed to update icon' }, { status: 500 })
  }
}
