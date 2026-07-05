'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type ContactRequest = { id: string; name: string; email: string; message: string; status: string; created_at: string; company?: string | null }

export function AdminClient() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function run() {
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) {
        setError('Supabase configuration is missing in Vercel.')
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.replace('/login')
        return
      }

      setEmail(data.session.user.email || '')
      const response = await fetch('/api/admin/contact-requests', { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: 'no-store' })
      if (!response.ok) {
        setError(response.status === 403 ? 'Your account is not admin yet.' : 'Unable to load contacts.')
        setLoading(false)
        return
      }

      const payload = await response.json()
      setContacts(payload.items || [])
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
      <div className="container">
        <span className="badge">Admin</span>
        <h1 className="mt-5 text-5xl font-black text-slate-950">TRH control center.</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">Authenticated dashboard for contacts, academy, media and community operations.</p>
        <div className="card mt-8 flex flex-wrap items-center justify-between gap-4 p-5 text-slate-600"><span>{email || 'Loading session...'}</span><button onClick={signOut} className="font-black text-[var(--primary)]">Sign out</button></div>
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-3xl font-black text-slate-950">Contact CRM</h2><Link href="/contact" className="btn btn-ghost">Open form</Link></div>
          {loading && <div className="card p-6 text-slate-600">Loading contacts...</div>}
          {error && <div className="card p-6 text-red-600">{error}</div>}
          {!loading && !error && contacts.length === 0 && <div className="card p-6 text-slate-600">No contact requests yet.</div>}
          <div className="grid gap-4">{contacts.map((c) => <article key={c.id} className="card p-6"><h3 className="text-xl font-black text-slate-950">{c.name}</h3><p className="text-slate-600">{c.email}{c.company ? ` · ${c.company}` : ''}</p><p className="mt-4 text-slate-600">{c.message}</p><p className="mt-4 text-xs uppercase tracking-widest text-slate-500">{new Date(c.created_at).toLocaleString()}</p></article>)}</div>
        </section>
      </div>
    </main>
  )
}
