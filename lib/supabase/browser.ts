import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type PublicSupabaseConfig = {
  url: string
  anonKey: string
}

let cachedClient: SupabaseClient | null = null
let cachedConfig: PublicSupabaseConfig | null = null

const envConfig: PublicSupabaseConfig | null =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      }
    : null

async function loadRuntimeConfig(): Promise<PublicSupabaseConfig | null> {
  if (envConfig) return envConfig
  if (cachedConfig) return cachedConfig
  if (typeof window === 'undefined') return null

  try {
    const response = await fetch('/api/supabase-config', { cache: 'no-store' })
    if (!response.ok) return null

    const payload = (await response.json()) as Partial<PublicSupabaseConfig>
    if (!payload.url || !payload.anonKey) return null

    cachedConfig = { url: payload.url, anonKey: payload.anonKey }
    return cachedConfig
  } catch {
    return null
  }
}

export async function createBrowserSupabaseClient() {
  const config = await loadRuntimeConfig()
  if (!config) return null

  if (cachedClient) return cachedClient
  cachedClient = createClient(config.url, config.anonKey)
  return cachedClient
}
