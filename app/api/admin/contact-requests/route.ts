import { NextResponse } from 'next/server'
import { getSupabaseServerConfig, isAdminUser, verifyBearerToken } from '@/lib/supabase/server'

async function requireAdmin(request: Request) {
  const user = await verifyBearerToken(request.headers.get('authorization'))
  if (!user) return null
  return (await isAdminUser(user.id)) ? user : null
}

export async function GET(request: Request) {
  try {
    const user = await requireAdmin(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { url, serviceRoleKey } = getSupabaseServerConfig()
    const params = new URL(request.url).searchParams
    const limit = Math.min(Number(params.get('limit') || 25), 100)
    const offset = Math.max(Number(params.get('offset') || 0), 0)
    const status = params.get('status')
    const filter = status && status !== 'all' ? `&status=eq.${status}` : ''
    const response = await fetch(`${url}/rest/v1/contact_requests?select=*&order=created_at.desc&limit=${limit}&offset=${offset}${filter}`, { headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` }, cache: 'no-store' })
    if (!response.ok) return NextResponse.json({ error: 'Could not load contact requests' }, { status: 502 })
    return NextResponse.json({ items: await response.json(), limit, offset })
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await request.json()
    const id = String(body.id || '')
    const status = String(body.status || '')
    if (!id || !['new', 'in_progress', 'done', 'archived'].includes(status)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const { url, serviceRoleKey } = getSupabaseServerConfig()
    const response = await fetch(`${url}/rest/v1/contact_requests?id=eq.${id}`, { method: 'PATCH', headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ status }) })
    if (!response.ok) return NextResponse.json({ error: 'Could not update contact request' }, { status: 502 })
    const rows = await response.json()
    return NextResponse.json({ item: rows?.[0] || null })
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
