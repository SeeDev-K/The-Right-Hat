'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type ContactRequest = { id: string; name: string; email: string; message: string; status: string; created_at: string; company?: string | null }
type ContentItem = { id: string; title: string; kind: string; status: string; created_at?: string }
type AuditEvent = { action: string; actor: string; at: string; severity: 'info' | 'warn' | 'ok' }

const nav = [['Dashboard','/admin'], ['Contacts CRM','/admin/contacts'], ['Academy CMS','/admin/academy'], ['Media CMS','/admin/media'], ['Team','/admin/team'], ['Library','/admin/library'], ['Activity','/admin/activity'], ['Security','/admin/security'], ['Settings','/admin/settings']]
const spark = [18, 31, 24, 44, 36, 59, 52]

function countBy(items: ContentItem[], kind: string, status?: string) {
  return items.filter((item) => item.kind === kind && (!status || item.status === status)).length
}

export function AdminClient() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)

  const academyTotal = countBy(contentItems, 'academy')
  const academyPublished = countBy(contentItems, 'academy', 'published')
  const mediaTotal = countBy(contentItems, 'media')
  const mediaPublished = countBy(contentItems, 'media', 'published')
  const reviewQueue = contentItems.filter((item) => ['draft', 'review'].includes(item.status)).length

  const audit: AuditEvent[] = useMemo(() => [
    { action: 'Admin session validated', actor: email || 'system', at: 'live', severity: 'ok' },
    { action: 'Contact CRM synchronized', actor: 'contact-requests', at: `${contacts.length} records`, severity: 'info' },
    { action: 'Content CMS synchronized', actor: 'content_items', at: `${contentItems.length} records`, severity: 'info' },
    { action: 'Team access module available', actor: 'team_members', at: 'ready', severity: 'ok' },
    { action: 'RBAC policy check active', actor: 'Supabase RLS', at: 'live', severity: 'ok' },
  ], [email, contacts.length, contentItems.length])

  useEffect(() => {
    async function run() {
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) { setError('Supabase configuration is missing in Vercel.'); setLoading(false); return }

      const { data } = await supabase.auth.getSession()
      if (!data.session) { router.replace('/admin/login'); return }

      setEmail(data.session.user.email || '')

      const contactResponse = await fetch('/api/admin/contact-requests', {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
        cache: 'no-store',
      })

      if (!contactResponse.ok) {
        setError(contactResponse.status === 403 ? 'Your account is not admin yet.' : 'Unable to load contacts.')
        setLoading(false)
        return
      }

      const contactPayload = await contactResponse.json()
      setContacts(contactPayload.items || [])

      const { data: cmsData } = await supabase
        .from('content_items')
        .select('id,title,kind,status,created_at')
        .order('created_at', { ascending: false })

      setContentItems((cmsData || []) as ContentItem[])
      setUpdatedAt(new Date())
      setLoading(false)
    }
    run()
  }, [router])

  async function signOut() {
    const supabase = await createBrowserSupabaseClient()
    if (supabase) await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  const kpis = [
    ['Contacts', contacts.length, 'CRM live'],
    ['Academy', academyTotal, `${academyPublished} published`],
    ['Media', mediaTotal, `${mediaPublished} published`],
    ['Review queue', reviewQueue, 'draft/review'],
  ]

  const apiSurface = [
    ['Contact intake', '/api/admin/contact-requests', contacts.length ? 'active' : 'ready'],
    ['Content table', 'content_items', contentItems.length ? 'synced' : 'ready'],
    ['Team access', '/admin/team', 'ready'],
    ['Academy public', '/academy', `${academyPublished} live`],
    ['Media public', '/media', `${mediaPublished} live`],
  ]

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <div className="grid min-h-screen lg:grid-cols-[296px_1fr]">
        <aside className="hidden border-r border-white/10 bg-[#0a0f1a] p-7 lg:block">
          <div className="text-3xl font-black tracking-[-.08em]">TRH</div>
          <p className="mt-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-300">Control Center</p>
          <nav className="mt-10 grid gap-2 text-sm font-black text-slate-400">
            {nav.map(([item, href], i) => <Link key={item} href={href} className={i === 0 ? 'rounded-2xl bg-cyan-400/10 px-4 py-3 text-cyan-200' : 'rounded-2xl px-4 py-3 hover:bg-white/5'}>{item}{item === 'Contacts CRM' && contacts.length > 0 ? <b className="ml-2 rounded-full bg-red-500 px-2 text-xs text-white">{contacts.length}</b> : null}</Link>)}
          </nav>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[.04] p-4">
            <p className="text-xs text-slate-500">Signed in</p>
            <p className="mt-1 break-all text-sm font-bold text-slate-200">{email || 'Loading...'}</p>
            <p className="mt-2 text-xs text-cyan-300">Super Admin</p>
          </div>
          <button onClick={signOut} className="mt-4 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-black text-slate-300 hover:bg-white/5">Sign out</button>
        </aside>

        <section className="p-5 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-200">Admin console</span>
              <h1 className="mt-5 text-5xl font-black tracking-[-.06em] text-white">TRH Control Center</h1>
              <p className="mt-3 text-slate-400">Live 360° operations · Last update: {updatedAt ? updatedAt.toLocaleTimeString() : 'loading'} · Ctrl/⌘ K ready</p>
            </div>
            <Link href="/" className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-200 hover:bg-white/5">View website</Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {kpis.map(([label, value, trend]) => <div key={label} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6 shadow-2xl shadow-black/20"><p className="text-sm font-black text-slate-400">{label}</p><strong className="mt-2 block text-4xl text-white">{value}</strong><p className="mt-2 text-sm font-bold text-cyan-300">{trend}</p><svg viewBox="0 0 120 34" className="mt-5 h-8 w-full text-cyan-300">{spark.map((v, i) => <rect key={i} x={i * 17} y={34 - v / 2} width="9" height={v / 2} rx="4" fill="currentColor" opacity={.28 + i / 12} />)}</svg></div>)}
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <section className="rounded-[32px] border border-white/10 bg-white/[.05] p-6">
              <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-3xl font-black text-white">Contact CRM</h2><p className="mt-1 text-slate-400">New requests, status and intake visibility.</p></div><Link href="/admin/contacts" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white">Open CRM</Link></div>
              {loading && <div className="rounded-2xl bg-white/[.04] p-6 text-slate-300">Loading live data...</div>}
              {error && <div className="rounded-2xl bg-red-500/10 p-6 text-red-200">{error}</div>}
              {!loading && !error && contacts.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 bg-white/[.03] p-8 text-slate-300"><b className="text-white">No contact requests yet.</b><p className="mt-2">Once a request is submitted, it will appear here with visibility.</p></div>}
              <div className="grid gap-4">{contacts.slice(0, 4).map((c) => <article key={c.id} className="rounded-2xl border border-white/10 bg-black/20 p-5"><h3 className="text-xl font-black text-white">{c.name}</h3><p className="text-slate-400">{c.email}{c.company ? ` · ${c.company}` : ''}</p><p className="mt-4 text-slate-300">{c.message}</p></article>)}</div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-white/[.05] p-6">
              <h2 className="text-3xl font-black text-white">API & Data Surface</h2>
              <p className="mt-1 text-slate-400">Operational view of the connected modules.</p>
              <div className="mt-6 grid gap-3">{apiSurface.map(([name, path, state]) => <div key={name} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex items-center justify-between gap-3"><p className="font-black text-white">{name}</p><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">{state}</span></div><p className="mt-1 font-mono text-xs text-slate-500">{path}</p></div>)}</div>
            </section>
          </div>

          <section className="mt-8 rounded-[32px] border border-white/10 bg-white/[.05] p-6">
            <h2 className="text-3xl font-black text-white">Audit feed</h2>
            <p className="mt-1 text-slate-400">Administrative activity and module synchronization.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{audit.map((e) => <div key={e.action} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="font-black text-white">{e.action}</p><p className="mt-1 font-mono text-xs text-slate-500">{e.actor} · {e.at}</p></div>)}</div>
            <Link href="/admin/activity" className="mt-5 inline-flex font-black text-cyan-300">Open activity →</Link>
          </section>
        </section>
      </div>
    </main>
  )
}
