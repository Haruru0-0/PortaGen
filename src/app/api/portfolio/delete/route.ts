// app/api/portfolio/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { portfolios } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { getUserByClerkId } from '@/lib/db/helpers'

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserByClerkId(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    if (!id) return NextResponse.json({ error: 'Portfolio ID required' }, { status: 400 })

    // ensure ownership
    const result = await db.delete(portfolios).where(and(eq(portfolios.id, id), eq(portfolios.userId, user.id))).returning()
    if (result.length === 0) {
      return NextResponse.json({ error: 'Not found or not allowed' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Portfolio delete error:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}

