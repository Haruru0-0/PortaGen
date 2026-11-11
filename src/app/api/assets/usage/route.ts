import { NextRequest, NextResponse } from 'next/server'
import { and, eq } from 'drizzle-orm'
import { createClient } from '@/utils/supabase/server'
import { getUserBySupabaseId } from '@/lib/db/helpers'
import { db } from '@/lib/db'
import { uploadedAssets } from '@/lib/db/schema'
import { getAssetUsage } from '@/lib/asset-usage'

export const runtime = 'nodejs'

/** Where one of the signed-in user's assets is used right now: `{ usedIn: string[] }`. */
export async function GET(req: NextRequest) {
  try {
    const { data: { user: account } } = await (await createClient()).auth.getUser()
    if (!account) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserBySupabaseId(account.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const assetId = Number(req.nextUrl.searchParams.get('assetId'))
    if (!Number.isInteger(assetId) || assetId <= 0) return NextResponse.json({ error: 'Asset ID required' }, { status: 400 })
    const asset = await db.query.uploadedAssets.findFirst({ where: and(eq(uploadedAssets.id, assetId), eq(uploadedAssets.userId, user.id)) })
    if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 })

    const usage = await getAssetUsage(user.id)
    return NextResponse.json({ usedIn: usage.get(assetId) ?? [] })
  } catch (error) {
    console.error('Asset usage error:', error)
    return NextResponse.json({ error: 'Failed to check asset usage' }, { status: 500 })
  }
}
