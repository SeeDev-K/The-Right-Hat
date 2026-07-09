'use client'

import { useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type MemberProfile = {
  user_id: string
  display_name?: string | null
  headline?: string | null
  company?: string | null
  bio?: string | null
  created_at?: string
}

type MemberModeration = {
  user_id: string
  status: string
  reason?: string | null
  updated_at?: string
}

type CommunityPost = { user_id: string }
type CommunityReply = { user_id: string }

const statuses = ['active', 'paused', 'banned']

export function SimpleMemberDirectoryBoard() {
  const [profiles, setProfiles] = useState<MemberProfile[]>([])
  const [moderation, setModeration] = useState<Record<string, MemberModeration>>({})
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [replies, setReplies] = useState<CommunityReply[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  useEffect(() => { loadMembers() }, [])

  const filtered = useMemo(() => profiles.filter((profile) => `${profile.display_name || ''} ${profile.headline || ''} ${profile.company || ''} ${profile.bio || ''}`.toLowerCase().includes(query.toLowerCase())), [profiles, query])
  const pausedCount = Object.values(moderation).filter((item) => item.status === 'paused').length
  const bannedCount = Object.values(moderation).filter((item) => item.status === 'banned').length

  function statusFor(userId: string) {
    return moderation[userId]?.status || 'active'
  }

  function countFor(userId: string, items: { user_id: string }[]) {
    return items.filter((item) => item.user_id === userId).length
  }

  async function writeAudit(action: string, target: string, details: Record<string, unknown> = {}) {
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) return
    const { data } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      actor_user_id: data.user?.id || null,
      actor_email: data.user?.email || null,
      module: 'community',
      action,
      target,
      severity: 'info',
      details,
    })
  }

  async function loadMembers() {
    setLoading(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); setLoading(false); return }
    const [{ data: profileData, error: profileError }, { data: moderationData }, { data: postData }, { data: replyData }] = await Promise.all([
      supabase.from('member_profiles').select('user_id,display_name,headline,company,bio,created_at').order('created_at', { ascending: false }),
      supabase.from('member_moderation').select('user_id,status,reason,updated_at'),
      supabase.from('community_posts').select('user_id'),
      supabase.from('community_replies').select('user_id'),
    ])

    if (profileError) { setNotice('Could not load member profiles.'); setLoading(false); return }
    setProfiles((profileData || []) as MemberProfile[])
    setModeration(Object.fromEntries(((moderationData || []) as MemberModeration[]).map((item) => [item.user_id, item])))
    setPosts((postData || []) as CommunityPost[])
    setReplies((replyData || []) as CommunityReply[])
    setLoading(false)
  }

  async function updateMemberStatus(profile: MemberProfile, nextStatus: string) {
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) return
    const previousStatus = statusFor(profile.user_id)
    const payload = { user_id: profile.user_id, status: nextStatus, updated_at: new Date().toISOString() }
    const { data, error } = await supabase
      .from('member_moderation')
      .upsert(payload)
      .select('user_id,status,reason,updated_at')
      .single()
    if (error || !data) { setNotice('Could not update member status. Run the member moderation migration if needed.'); return }
    setModeration((current) => ({ ...current, [profile.user_id]: data as MemberModeration }))
    await writeAudit('Community member status updated', profile.display_name || profile.user_id, { from: previousStatus, to: nextStatus, user_id: profile.user_id })
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60"><p className="text-sm font-black text-slate-500">Members</p><strong className="mt-2 block text-4xl text-slate-950">{profiles.length}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60"><p className="text-sm font-black text-slate-500">Posts</p><strong className="mt-2 block text-4xl text-slate-950">{posts.length}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60"><p className="text-sm font-black text-slate-500">Paused</p><strong className="mt-2 block text-4xl text-slate-950">{pausedCount}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60"><p className="text-sm font-black text-slate-500">Banned</p><strong className="mt-2 block text-4xl text-slate-950">{bannedCount}</strong></div>
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Member directory</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-950">Community members</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Review member profiles and control who can publish in the TRH Community.</p></div>
          <button onClick={loadMembers} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">Refresh</button>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members" className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
        {notice && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{notice}</p>}
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        {loading ? <p className="text-slate-500">Loading members...</p> : filtered.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-slate-500">No members found.</p> : <div className="divide-y divide-slate-100">{filtered.map((profile) => {
          const currentStatus = statusFor(profile.user_id)
          return <article key={profile.user_id} className="py-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-xl font-black text-slate-950">{profile.display_name || 'Unnamed member'}</h3><p className="mt-1 text-sm text-slate-500">{profile.headline || 'No headline'}{profile.company ? ` · ${profile.company}` : ''}</p><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{profile.bio || 'No bio yet.'}</p><p className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-blue-600">{countFor(profile.user_id, posts)} posts · {countFor(profile.user_id, replies)} replies</p></div><div className="min-w-48"><span className={currentStatus === 'banned' ? 'rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-red-700' : currentStatus === 'paused' ? 'rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-amber-700' : 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-emerald-700'}>{currentStatus}</span><div className="mt-3 flex flex-wrap gap-2">{statuses.map((status) => <button key={status} onClick={() => updateMemberStatus(profile, status)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-600 hover:bg-slate-50">{status}</button>)}</div></div></div></article>
        })}</div>}
      </div>
    </section>
  )
}
