// app/api/icons/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { icons } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getUserBySupabaseId } from '@/lib/db/helpers'

function format(row: any) {
  return {
    id: row.id,
    name: row.name,
    url: row.linkUrl || undefined,
    windowId: row.windowId || undefined,
    icon: row.asset || '',
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    if (!supabaseUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserBySupabaseId(supabaseUser.id)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { id: paramId } = await params
    const id = Number(paramId)
    if (!id) return NextResponse.json({ error: 'Icon ID required' }, { status: 400 })

    const row = await db.query.icons.findFirst({
      where: eq(icons.id, id),
      with: { portfolio: true, asset: true },
    })
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (!row.portfolio || row.portfolio.userId !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    return NextResponse.json(format(row))
  } catch (error) {
    console.error('Icon GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch icon' }, { status: 500 })
  }
}
