import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { createClient } from '@/utils/supabase/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

export const runtime = 'nodejs'

const input = z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(1024) })

// Best-effort per-instance limit on sign-in attempts by address.
const attempts = new Map<string, { count: number; resetAt: number }>()
function allowed(request: NextRequest) {
  const key = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 })
    return true
  }
  entry.count += 1
  return entry.count <= 10
}

const INVALID = { error: 'INVALID CREDENTIALS' }

/**
 * Signs a user in by username. The email lookup happens here, on the server, so the browser never needs
 * read access to the users table and never receives the email address.
 */
export async function POST(request: NextRequest) {
  if (!allowed(request)) return NextResponse.json({ error: 'TOO MANY ATTEMPTS. TRY AGAIN IN A MINUTE.' }, { status: 429 })
  const parsed = input.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json(INVALID, { status: 400 })
  const { username, password } = parsed.data

  const row = await db.query.users.findFirst({ where: eq(users.username, username), columns: { email: true } })
  // Same answer for an unknown username and a wrong password, so usernames cannot be probed.
  if (!row) return NextResponse.json(INVALID, { status: 401 })

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email: row.email, password })
  if (error) return NextResponse.json(INVALID, { status: 401 })
  return NextResponse.json({ ok: true })
}
