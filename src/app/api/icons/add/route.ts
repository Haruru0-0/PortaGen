// app/api/icons/add/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { icons, portfolios, portfolioAssets, windows } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'
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
    linkType: row.linkType || 'window',
    url: row.linkUrl || undefined,
    iconAssetId: row.iconAssetId || undefined,
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserBySupabaseId(supabaseUser.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await req.json().catch(() => ({}))
    const { portfolioId, name, url, fileId, linkType } = body || {}

    if (!portfolioId) {
      return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })
    }

    // Verify ownership
    const owned = await db.query.portfolios.findFirst({
      where: and(eq(portfolios.id, portfolioId), eq(portfolios.userId, user.id)),
    })
    if (!owned) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const [created] = await db
      .insert(icons)
      .values({
        portfolioId,
        name: name || 'NEW ICON',
        linkType: (linkType === 'url' || linkType === 'window') ? linkType : 'window',
        linkUrl: linkType === 'url' ? url : undefined,
        iconAssetId: fileId != null && fileId !== '' ? Number(fileId) : undefined,
      })
      .returning()

    // Ensure portfolio-assets linkage exists for this icon's asset
    if (fileId != null && fileId !== '') {
      try {
        // Ignore if mapping already exists
        await db
          .insert(portfolioAssets)
          .values({ portfolioId, assetId: Number(fileId) })
          .onConflictDoNothing({ target: [portfolioAssets.portfolioId, portfolioAssets.assetId] })
      } catch (e) {
        console.error('Failed to link icon asset to portfolio assets:', e)
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
