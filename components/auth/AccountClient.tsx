'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type AccountState = { email: string; id: string; createdAt: string }

export function AccountClient() {
  const router = useRouter()
  const [account, setAccount] = useState<AccountState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function run() {
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) {
        setError('Supabase configuration is missing in Vercel.')
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace('/login')
        return
      }

      setAccount({ id: data.user.id, email: data.user.email || '', createdAt: data.user.created_at || '' })
      setLoading(false)
    }

    run()
  }, [router])

  async function signOut() {
    const supabase = await createBrowserSupabaseClient()
    if (supabase) await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <main className="py-20">
      <div className="container max-w-3xl">
        <span className="badge">Account</span>
        <h1 className="mt-5 text-5xl font-black">Your TRH account.</h1>
        {loading && <div className="card mt-8 p-7 text-slate-600">Loading account...</div>}
        {error && <div className="card mt-8 p-7 text-red-600">{error}</div>}
        {account && (
          <div className="card mt-8 grid gap-4 p-7">
            <p><strong className="text-slate-950">Email:</strong> <span className="text-slate-600">{account.email}</span></p>
            <p><strong className="text-slate-950">User ID:</strong> <span className="break-all text-slate-600">{account.id}</span></p>
            <p><strong className="text-slate-950">Created:</strong> <span className="text-slate-600">{account.createdAt ? new Date(account.createdAt).toLocaleString() : 'Unknown'}</span></p>
            <div className="mt-4 flex flex-wrap gap-3"><Link href="/admin" className="btn btn-primary">Open admin</Link><button onClick={signOut} className="btn btn-ghost">Sign out</button></div>
          </div>
        )}
      </div>
    </main>
  )
}
