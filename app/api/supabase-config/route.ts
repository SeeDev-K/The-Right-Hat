import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLIC_ANON_KEY ||
    ''

  if (!url || !anonKey) {
    return NextResponse.json(
      {
        error: 'Missing Supabase public configuration',
        required: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
        acceptedAliases: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_PUBLIC_ANON_KEY'],
      },
      { status: 503 },
    )
  }

  return NextResponse.json({ url, anonKey })
}
