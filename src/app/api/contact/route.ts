// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { db } from '@/lib/db'
import { portfolios, users } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, email, subject, message, portfolioId, slug } = body || {}

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic injection guard
    const safe = (s: string) => String(s).replace(/[\r\n]/g, ' ').trim()

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Boolean(process.env.SMTP_SECURE === 'true'),
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    })

    // Resolve recipient: portfolio owner email if portfolioId/slug provided; otherwise fallback to CONTACT_TO/SMTP_USER
    let to: string | undefined = process.env.CONTACT_TO || process.env.SMTP_USER || undefined
    if (portfolioId || slug) {
      const portRow = await db.query.portfolios.findFirst({
        where: portfolioId
          ? eq(portfolios.id, Number(portfolioId))
          : eq(portfolios.slug, String(slug)),
        with: { user: true },
      })
      if (portRow?.user?.email) {
        to = portRow.user.email
      }
    }
    const from = process.env.CONTACT_FROM || process.env.SMTP_USER || 'no-reply@localhost'
    if (!to) return NextResponse.json({ error: 'Contact recipient not configured' }, { status: 500 })

    await transporter.sendMail({
      from,
      to,
      subject: safe(subject || `New message from ${name}`),
      replyTo: email,
      text: `From: ${name} <${email}>
Subject: ${subject}

${message}`,
      html: `<p><strong>From:</strong> ${safe(name)} &lt;${safe(email)}&gt;</p>
<p><strong>Subject:</strong> ${safe(subject || '')}</p>
<p>${(String(message) || '').replace(/\n/g,'<br/>')}</p>`,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact send error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
