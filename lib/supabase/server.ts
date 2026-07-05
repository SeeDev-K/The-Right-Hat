const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export type AuthenticatedUser = {
  id: string
  email?: string
}

export function getSupabaseServerConfig() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase server environment variables')
  }

  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    serviceRoleKey: SUPABASE_SERVICE_ROLE_KEY,
  }
}

export async function verifyBearerToken(authorizationHeader: string | null): Promise<AuthenticatedUser | null> {
  if (!authorizationHeader?.startsWith('Bearer ')) return null

  const token = authorizationHeader.replace('Bearer ', '').trim()
  if (!token) return null

  const { url, anonKey } = getSupabaseServerConfig()

  const response = await fetch(`${url}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) return null

  const user = await response.json()
  if (!user?.id) return null

  return { id: user.id, email: user.email }
}

export async function isAdminUser(userId: string) {
  const { url, serviceRoleKey } = getSupabaseServerConfig()
  const response = await fetch(`${url}/rest/v1/admin_profiles?select=id,role&user_id=eq.${userId}&role=in.(owner,admin)&limit=1`, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: 'no-store',
  })

  if (!response.ok) return false

  const rows = await response.json()
  return Array.isArray(rows) && rows.length > 0
}
