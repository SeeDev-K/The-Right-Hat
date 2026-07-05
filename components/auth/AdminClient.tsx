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
      if (!supabase) { setError('Supabase configuration is missing in Vercel.'); setLoading(false); return }
      const { data } = await supabase.auth.getSession()
      if (!data.session) { router.replace('/admin/login'); return }
      setEmail(data.session.user.email || '')
      const response = await fetch('/api/admin/contact-requests', { headers: { Authorization: `Bearer ${data.session.access_token}` }, cache: 'no-store' })
      if (!response.ok) { setError(response.status === 403 ? 'Your account is not admin yet.' : 'Unable to load contacts.'); setLoading(false); return }
      const payload = await response.json()
      setContacts(payload.items || [])
      setLoading(false)
    }
    run()
  }, [router])

  async function signOut() {
    const supabase = await createBrowserSupabaseClient()
    if (supabase) await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white p-7 lg:block">
          <div className="text-3xl font-black text-slate-950">TRH</div>
          <div className="mt-10 grid gap-2 text-sm font-black text-slate-600"><span className="rounded-2xl bg-blue-50 px-4 py-3 text-[var(--primary)]">Dashboard</span><span className="px-4 py-3">Contacts CRM</span><span className="px-4 py-3">Academy CMS</span><span className="px-4 py-3">Media CMS</span><span className="px-4 py-3">Settings</span></div>
          <button onClick={signOut} className="mt-10 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700">Sign out</button>
        </aside>
        <section className="p-6 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-5"><div><span className="badge">Admin console</span><h1 className="mt-4 text-5xl font-black text-slate-950">TRH control center.</h1><p className="mt-3 text-slate-600">{email || 'Loading session...'}</p></div><Link href="/" className="btn btn-ghost">View website</Link></div>
          <div className="mt-8 grid gap-5 md:grid-cols-4"><div className="kpi-card p-6"><p className="text-sm font-black text-slate-500">Contacts</p><strong className="mt-2 block text-4xl">{contacts.length}</strong></div><div className="kpi-card p-6"><p className="text-sm font-black text-slate-500">Academy</p><strong className="mt-2 block text-4xl">4</strong></div><div className="kpi-card p-6"><p className="text-sm font-black text-slate-500">Media</p><strong className="mt-2 block text-4xl">6</strong></div><div className="kpi-card p-6"><p className="text-sm font-black text-slate-500">Security</p><strong className="mt-2 block text-4xl">OK</strong></div></div>
          <section className="soft-panel mt-8 p-6"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-3xl font-black text-slate-950">Contact CRM</h2><Link href="/contact" className="btn btn-primary">Open form</Link></div>{loading && <div className="rounded-2xl bg-slate-50 p-6 text-slate-600">Loading contacts...</div>}{error && <div className="rounded-2xl bg-red-50 p-6 text-red-700">{error}</div>}{!loading && !error && contacts.length === 0 && <div className="rounded-2xl bg-slate-50 p-6 text-slate-600">No contact requests yet.</div>}<div className="grid gap-4">{contacts.map((c) => <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="text-xl font-black text-slate-950">{c.name}</h3><p className="text-slate-600">{c.email}{c.company ? ` · ${c.company}` : ''}</p><p className="mt-4 text-slate-600">{c.message}</p><p className="mt-4 text-xs uppercase tracking-widest text-slate-500">{new Date(c.created_at).toLocaleString()}</p></article>)}</div></section>
        </section>
      </div>
    </main>
  )
}
