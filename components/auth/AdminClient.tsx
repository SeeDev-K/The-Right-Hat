'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type ContactRequest = { id: string; name: string; email: string; message: string; status: string; created_at: string; company?: string | null }
type ContentItem = { id: string; title: string; kind: string; status: string; created_at?: string }
type AuditEvent = { action: string; actor: string; at: string; severity: 'info' | 'warn' | 'ok' }

const staffAccessPath = '/trh-staff/access'
const staffModules = ['crm', 'academy', 'media', 'community', 'apis', 'library', 'team', 'activity', 'security', 'settings']
const nav = [['Dashboard','/admin'], ['Contacts CRM','/admin/contacts'], ['Academy CMS','/admin/academy'], ['Media CMS','/admin/media'], ['Community','/admin/community'], ['Members','/admin/members'], ['API Center','/admin/apis'], ['Team','/admin/team'], ['Library','/admin/library'], ['Activity','/admin/activity'], ['Security','/admin/security'], ['Settings','/admin/settings']]
const spark = [18, 31, 24, 44, 36, 59, 52]

function countBy(items: ContentItem[], kind: string, status?: string) {
  return items.filter((item) => item.kind === kind && (!status || item.status === status)).length
}

export function AdminClient() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [teamCount, setTeamCount] = useState(0)
  const [apiCount, setApiCount] = useState(0)
  const [apiActiveCount, setApiActiveCount] = useState(0)
  const [communityPosts, setCommunityPosts] = useState(0)
  const [communityReplies, setCommunityReplies] = useState(0)
  const [communityHidden, setCommunityHidden] = useState(0)
  const [communityReports, setCommunityReports] = useState(0)
  const [communityOpenReports, setCommunityOpenReports] = useState(0)
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
    { action: 'Community synchronized', actor: 'community', at: `${communityPosts} posts`, severity: 'ok' },
    { action: 'Reports queue synchronized', actor: 'community_reports', at: `${communityOpenReports} open`, severity: communityOpenReports > 0 ? 'warn' : 'ok' },
    { action: 'API Center synchronized', actor: 'api_integrations', at: `${apiCount} integrations`, severity: 'ok' },
  ], [email, contacts.length, contentItems.length, apiCount, communityPosts, communityOpenReports])

  useEffect(() => {
    async function run() {
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) { setError('Supabase configuration is missing in Vercel.'); setLoading(false); return }

      const { data } = await supabase.auth.getSession()
      if (!data.session) { router.replace(staffAccessPath); return }

      setEmail(data.session.user.email || '')

      const accessResults = await Promise.all(staffModules.map(async (moduleName) => {
        const { data: access } = await supabase.rpc('can_access_module', { required_module: moduleName })
        return { moduleName, allowed: access === true }
      }))
      const hasStaffAccess = accessResults.some((item) => item.allowed)
      const hasCrmAccess = accessResults.some((item) => item.moduleName === 'crm' && item.allowed)

      if (!hasStaffAccess) { router.replace('/access-restricted'); return }

      if (hasCrmAccess) {
        const contactResponse = await fetch('/api/admin/contact-requests', {
          headers: { Authorization: `Bearer ${data.session.access_token}` },
          cache: 'no-store',
        })
        if (contactResponse.ok) {
          const contactPayload = await contactResponse.json()
          setContacts(contactPayload.items || [])
        }
      }

      const [cmsResult, teamResult, apiResult, communityPostResult, communityReplyResult, hiddenPostResult, hiddenReplyResult, reportResult, openReportResult] = await Promise.all([
        supabase.from('content_items').select('id,title,kind,status,created_at').order('created_at', { ascending: false }),
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('api_integrations').select('id,status'),
        supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        supabase.from('community_replies').select('id', { count: 'exact', head: true }),
        supabase.from('community_posts').select('id', { count: 'exact', head: true }).eq('status', 'hidden'),
        supabase.from('community_replies').select('id', { count: 'exact', head: true }).eq('status', 'hidden'),
        supabase.from('community_reports').select('id', { count: 'exact', head: true }),
        supabase.from('community_reports').select('id', { count: 'exact', head: true }).eq('status', 'open'),
      ])

      const apis = (apiResult.data || []) as { id: string; status: string }[]
      setContentItems((cmsResult.data || []) as ContentItem[])
      setTeamCount(teamResult.count || 0)
      setApiCount(apis.length)
      setApiActiveCount(apis.filter((item) => item.status === 'active').length)
      setCommunityPosts(communityPostResult.count || 0)
      setCommunityReplies(communityReplyResult.count || 0)
      setCommunityHidden((hiddenPostResult.count || 0) + (hiddenReplyResult.count || 0))
      setCommunityReports(reportResult.count || 0)
      setCommunityOpenReports(openReportResult.count || 0)
      setUpdatedAt(new Date())
      setLoading(false)
    }
    run()
  }, [router])

  async function signOut() {
    const supabase = await createBrowserSupabaseClient()
    if (supabase) await supabase.auth.signOut()
    router.replace(staffAccessPath)
  }

  const kpis = [
    ['Contacts', contacts.length, 'CRM live'],
    ['Academy', academyTotal, `${academyPublished} published`],
    ['Media', mediaTotal, `${mediaPublished} published`],
    ['Community', communityPosts, `${communityReplies} replies`],
    ['Reports', communityOpenReports, `${communityReports} total`],
    ['Team', teamCount, 'members'],
  ]

  const apiSurface = [
    ['Contact intake', '/api/admin/contact-requests', contacts.length ? 'active' : 'ready'],
    ['Community moderation', '/admin/community', `${communityHidden} hidden · ${communityOpenReports} open reports`],
    ['Members control', '/admin/members', 'community access'],
    ['API Center', '/admin/apis', `${apiActiveCount}/${apiCount} active`],
    ['Content table', 'content_items', contentItems.length ? 'synced' : 'ready'],
    ['Review queue', 'content_items', `${reviewQueue} pending`],
    ['Team access', '/admin/team', `${teamCount} members`],
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
            {nav.map(([item, href], i) => <Link key={item} href={href} className={i === 0 ? 'rounded-2xl bg-cyan-400/10 px-4 py-3 text-cyan-200' : 'rounded-2xl px-4 py-3 hover:bg-white/5'}>{item}{item === 'Contacts CRM' && contacts.length > 0 ? <b className="ml-2 rounded-full bg-red-500 px-2 text-xs text-white">{contacts.length}</b> : null}{item === 'Community' && communityOpenReports > 0 ? <b className="ml-2 rounded-full bg-amber-500 px-2 text-xs text-white">{communityOpenReports}</b> : null}</Link>)}
          </nav>
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[.04] p-4">
            <p className="text-xs text-slate-500">Signed in</p>
            <p className="mt-1 break-all text-sm font-bold text-slate-200">{email || 'Loading...'}</p>
            <p className="mt-2 text-xs text-cyan-300">TRH Staff</p>
          </div>
          <button onClick={signOut} className="mt-4 w-full rounded-2xl border border-white/10 px-4 py-3 text-sm font-black text-slate-300 hover:bg-white/5">Sign out</button>
        </aside>

        <section className="p-5 lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-200">Staff console</span>
              <h1 className="mt-5 text-5xl font-black tracking-[-.06em] text-white">TRH Control Center</h1>
              <p className="mt-3 text-slate-400">Live 360° operations · Last update: {updatedAt ? updatedAt.toLocaleTimeString() : 'loading'} · Ctrl/⌘ K ready</p>
            </div>
            <Link href="/" className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-200 hover:bg-white/5">View website</Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3 xl:grid-cols-6">
            {kpis.map(([label, value, trend]) => <div key={label} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6 shadow-2xl shadow-black/20"><p className="text-sm font-black text-slate-400">{label}</p><strong className="mt-2 block text-4xl text-white">{value}</strong><p className="mt-2 text-sm font-bold text-cyan-300">{trend}</p><svg viewBox="0 0 120 34" className="mt-5 h-8 w-full text-cyan-300">{spark.map((v, i) => <rect key={i} x={i * 17} y={34 - v / 2} width="9" height={v / 2} rx="4" fill="currentColor" opacity={.28 + i / 12} />)}</svg></div>)}
          </div>

          <div className="mt-8 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
            <section className="rounded-[32px] border border-white/10 bg-white/[.05] p-6">
              <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="text-3xl font-black text-white">Contact CRM</h2><p className="mt-1 text-slate-400">New requests, status and intake visibility.</p></div><Link href="/admin/contacts" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white">Open CRM</Link></div>
              {loading && <div className="rounded-2xl bg-white/[.04] p-6 text-slate-300">Loading live data...</div>}
              {error && <div className="rounded-2xl bg-red-500/10 p-6 text-red-200">{error}</div>}
              {!loading && !error && contacts.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 bg-white/[.03] p-8 text-slate-300"><b className="text-white">No contact requests visible.</b><p className="mt-2">CRM data appears here for staff accounts with the CRM module.</p></div>}
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
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-6">{audit.map((e) => <div key={e.action} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="font-black text-white">{e.action}</p><p className="mt-1 font-mono text-xs text-slate-500">{e.actor} · {e.at}</p></div>)}</div>
            <Link href="/admin/activity" className="mt-5 inline-flex font-black text-cyan-300">Open activity →</Link>
          </section>
        </section>
      </div>
    </main>
  )
}
