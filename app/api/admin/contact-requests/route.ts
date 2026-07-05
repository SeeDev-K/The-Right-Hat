import { NextResponse } from 'next/server'
import { getSupabaseServerConfig, isAdminUser, verifyBearerToken } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const user = await verifyBearerToken(request.headers.get('authorization'))

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowed = await isAdminUser(user.id)
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { url, serviceRoleKey } = getSupabaseServerConfig()

    const response = await fetch(`${url}/rest/v1/contact_requests?select=*&order=created_at.desc&limit=100`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Could not load contact requests' }, { status: 502 })
    }

    const items = await response.json()
    return NextResponse.json({ items })
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
