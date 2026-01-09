// app/api/icons/add/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { icons, portfolios, portfolioAssets, windows } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'
import { completeChecklistTask } from '@/lib/activity'

async function formatIconResponse(id: number) {
  const row = await db.query.icons.findFirst({
    where: eq(icons.id, id),
    with: { asset: true },
  })
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    linkType: (row as any).linkType || 'window',
    url: row.linkUrl || undefined,
    isVisible: row.isVisible,
    iconAssetId: row.iconAssetId || undefined,
    icon: row.asset?.displayUrl || '',
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserByClerkId(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json().catch(() => ({}))
    const { portfolioId, name, url, fileId, position, linkType, isVisible } = body || {}

    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
    }

    // Verify ownership
    const owned = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
    })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Determine next position if not provided
    let nextPosition: number | undefined = typeof position === 'number' ? position : undefined
    if (typeof nextPosition !== 'number') {
      const existing = await db.query.icons.findMany({ where: eq(icons.portfolioId, portfolioId) })
      nextPosition = (existing.reduce((max, r) => Math.max(max, r.position || 0), -1) || -1) + 1
    }

    const [created] = await db
      .insert(icons)
      .values({
        portfolioId,
        name: name || 'NEW ICON',
        position: nextPosition || 0,
        linkType: (linkType === 'url' || linkType === 'window') ? linkType : 'window',
        linkUrl: linkType === 'url' ? url : undefined,
        isVisible: typeof isVisible === 'boolean' ? isVisible : true,
        iconAssetId: fileId != null && fileId !== '' ? Number(fileId) : undefined,
      })
      .returning()

    // Ensure portfolio-assets linkage exists for this icon's asset
    if (fileId != null && fileId !== '') {
      try {
        // Ignore if mapping already exists
        // @ts-ignore drizzle types for onConflictDoNothing
        await db
          .insert(portfolioAssets)
          .values({ portfolioId, assetId: Number(fileId) })
          .onConflictDoNothing({ target: [portfolioAssets.portfolioId, portfolioAssets.assetId] })
      } catch (e) {
        // noop if unique conflict or unsupported op in driver
      }
    }

    // If linking to a window, create a windows row bound to this icon
    if ((linkType === 'window' || !linkType) && created) {
      try {
        await db.insert(windows).values({ portfolioId, name: name || 'New Window', iconId: created.id })
      } catch { }
    }

    // Mark task done
    await completeChecklistTask(user.id, "ADD_DESKTOP_ICONS");

    const formatted = await formatIconResponse(created.id)
    return NextResponse.json(formatted)
  } catch (error) {
    console.error('Icons ADD error:', error)
    return NextResponse.json({ error: 'Failed to create icon' }, { status: 500 })
  }
}
