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
    { action: 'Staff session validated', actor: email || 'system', at: 'live', severity: 'ok' },
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
    <main className="p-5 text-[var(--admin-text)] lg:p-9">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-[var(--admin-cyan)]">Live operations</span>
            <h1 className="mt-5 text-5xl font-black tracking-[-.065em] text-[var(--admin-text)]">TRH Control Center</h1>
            <p className="mt-3 text-[var(--admin-muted)]">Enterprise operations overview · Last refresh: {updatedAt ? updatedAt.toLocaleTimeString() : 'loading'}</p>
          </div>
          <Link href="/admin/security" className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-5 py-3 text-sm font-black text-[var(--admin-text)] transition hover:border-cyan-400/35">View security posture</Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {kpis.map(([label, value, trend], cardIndex) => (
            <article key={label} className="admin-panel p-5 transition duration-200 hover:-translate-y-1 hover:border-cyan-400/25">
              <div className="flex items-start justify-between gap-3"><p className="text-sm font-black text-[var(--admin-muted)]">{label}</p><span className="admin-mono text-[10px] text-[var(--admin-muted)]">0{cardIndex + 1}</span></div>
              <strong className="mt-3 block text-4xl text-[var(--admin-text)]">{value}</strong>
              <p className="mt-2 text-xs font-bold text-[var(--admin-cyan)]">{trend}</p>
              <svg viewBox="0 0 120 34" className="mt-5 h-8 w-full text-[var(--admin-cyan)]" aria-hidden="true">{spark.map((v, i) => <rect key={i} x={i * 17} y={34 - v / 2} width="9" height={v / 2} rx="4" fill="currentColor" opacity={.24 + i / 12} />)}</svg>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1.12fr_.88fr]">
          <section className="admin-panel p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="admin-mono text-[10px] uppercase tracking-[.18em] text-[var(--admin-cyan)]">CRM intake</p><h2 className="mt-2 text-3xl font-black text-[var(--admin-text)]">Contact requests</h2><p className="mt-2 text-sm text-[var(--admin-muted)]">Latest visible requests for accounts with CRM access.</p></div><Link href="/admin/contacts" className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5">Open CRM</Link></div>
            {loading && <div className="admin-skeleton h-36 rounded-2xl" aria-label="Loading contact requests" />}
            {error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-red-200">{error}</div>}
            {!loading && !error && contacts.length === 0 && <div className="rounded-2xl border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 text-[var(--admin-muted)]"><b className="text-[var(--admin-text)]">No contact requests visible.</b><p className="mt-2 text-sm">New requests and assignments will appear here automatically.</p><Link href="/admin/contacts" className="mt-4 inline-flex text-sm font-black text-[var(--admin-cyan)]">Review CRM filters →</Link></div>}
            <div className="grid gap-3">{contacts.slice(0, 4).map((contact) => <article key={contact.id} className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-lg font-black text-[var(--admin-text)]">{contact.name}</h3><p className="text-sm text-[var(--admin-muted)]">{contact.email}{contact.company ? ` · ${contact.company}` : ''}</p></div><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.12em] text-[var(--admin-cyan)]">{contact.status || 'new'}</span></div><p className="mt-3 line-clamp-2 text-sm text-[var(--admin-muted)]">{contact.message}</p></article>)}</div>
          </section>

          <section className="admin-panel p-6">
            <p className="admin-mono text-[10px] uppercase tracking-[.18em] text-[var(--admin-cyan)]">Connected modules</p>
            <h2 className="mt-2 text-3xl font-black text-[var(--admin-text)]">Data surface</h2>
            <p className="mt-2 text-sm text-[var(--admin-muted)]">Operational visibility of protected modules and queues.</p>
            <div className="mt-6 grid gap-3">{apiSurface.map(([name, path, state]) => <div key={name} className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4"><div className="flex items-center justify-between gap-3"><p className="font-black text-[var(--admin-text)]">{name}</p><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black text-[var(--admin-cyan)]">{state}</span></div><p className="admin-mono mt-2 text-[10px] text-[var(--admin-muted)]">{path}</p></div>)}</div>
          </section>
        </div>

        <section className="admin-panel mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="admin-mono text-[10px] uppercase tracking-[.18em] text-[var(--admin-cyan)]">Activity preview</p><h2 className="mt-2 text-3xl font-black text-[var(--admin-text)]">Operational feed</h2></div><Link href="/admin/activity" className="text-sm font-black text-[var(--admin-cyan)]">Open complete audit →</Link></div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{audit.map((event) => <div key={event.action} className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4"><div className="flex items-start justify-between gap-3"><p className="font-black text-[var(--admin-text)]">{event.action}</p><span className={event.severity === 'warn' ? 'h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,.8)]' : 'h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,.7)]'} /></div><p className="admin-mono mt-2 text-[10px] text-[var(--admin-muted)]">{event.actor} · {event.at}</p></div>)}</div>
        </section>
      </div>
    </main>
  )
}
