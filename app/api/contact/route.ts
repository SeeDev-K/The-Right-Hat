import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

type Payload = {
  name?: string
  email?: string
  company?: string
  message?: string
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload
    const name = clean(body.name)
    const email = clean(body.email).toLowerCase()
    const company = clean(body.company)
    const message = clean(body.message)

    if (name.length < 2 || !email.includes('@') || message.length < 10) {
      return NextResponse.json({ error: 'Invalid contact request' }, { status: 400 })
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Supabase is not configured yet' }, { status: 503 })
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact_requests`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ name, email, company, message, source: 'website' }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Could not save request' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
