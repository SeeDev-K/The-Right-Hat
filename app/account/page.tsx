'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type AccountState = {
  email: string
  id: string
  createdAt: string
}

export default function AccountPage() {
  const router = useRouter()
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])
  const [account, setAccount] = useState<AccountState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAccount() {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace('/login')
        return
      }

      setAccount({
        id: data.user.id,
        email: data.user.email || '',
        createdAt: data.user.created_at || '',
      })
      setLoading(false)
    }

    loadAccount()
  }, [router, supabase])

  async function signOut() {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <main className="py-20">
      <div className="container max-w-3xl">
        <span className="badge">Account</span>
        <h1 className="mt-5 text-5xl font-black">Your TRH account.</h1>
        {loading && <div className="card mt-8 p-7 text-slate-300">Loading account...</div>}
        {account && (
          <div className="card mt-8 grid gap-4 p-7">
            <p><strong className="text-white">Email:</strong> <span className="text-slate-300">{account.email}</span></p>
            <p><strong className="text-white">User ID:</strong> <span className="break-all text-slate-300">{account.id}</span></p>
            <p><strong className="text-white">Created:</strong> <span className="text-slate-300">{account.createdAt ? new Date(account.createdAt).toLocaleString() : 'Unknown'}</span></p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/admin" className="btn btn-primary">Open admin</Link>
              <button onClick={signOut} className="btn btn-ghost">Sign out</button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
