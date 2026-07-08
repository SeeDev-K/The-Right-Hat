'use client'

import { useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type CommunityPost = {
  id: string
  user_id: string
  author_email?: string | null
  title: string
  body: string
  status: string
  created_at: string
}

type CommunityReply = {
  id: string
  post_id: string
  author_email?: string | null
  body: string
  status: string
  created_at: string
}

const statuses = ['all', 'published', 'hidden'] as const

export function SimpleCommunityModerationBoard() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [replies, setReplies] = useState<CommunityReply[]>([])
  const [filter, setFilter] = useState<(typeof statuses)[number]>('all')
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const filteredPosts = useMemo(() => filter === 'all' ? posts : posts.filter((item) => item.status === filter), [posts, filter])
  const hiddenCount = posts.filter((item) => item.status === 'hidden').length + replies.filter((item) => item.status === 'hidden').length

  useEffect(() => { loadCommunity() }, [])

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

  async function loadCommunity() {
    setLoading(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); setLoading(false); return }
    const [{ data: postData, error: postError }, { data: replyData, error: replyError }] = await Promise.all([
      supabase.from('community_posts').select('id,user_id,author_email,title,body,status,created_at').order('created_at', { ascending: false }).limit(100),
      supabase.from('community_replies').select('id,post_id,author_email,body,status,created_at').order('created_at', { ascending: false }).limit(200),
    ])
    if (postError || replyError) { setNotice('Database permission required.'); setLoading(false); return }
    setPosts((postData || []) as CommunityPost[])
    setReplies((replyData || []) as CommunityReply[])
    setLoading(false)
  }

  async function updatePostStatus(post: CommunityPost, nextStatus: 'published' | 'hidden') {
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) return
    const { error } = await supabase.from('community_posts').update({ status: nextStatus }).eq('id', post.id)
    if (error) { setNotice('Could not update post.'); return }
    setPosts((current) => current.map((item) => item.id === post.id ? { ...item, status: nextStatus } : item))
    await writeAudit('Community post moderated', post.title, { from: post.status, to: nextStatus, author_email: post.author_email })
  }

  async function updateReplyStatus(reply: CommunityReply, nextStatus: 'published' | 'hidden') {
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) return
    const { error } = await supabase.from('community_replies').update({ status: nextStatus }).eq('id', reply.id)
    if (error) { setNotice('Could not update reply.'); return }
    setReplies((current) => current.map((item) => item.id === reply.id ? { ...item, status: nextStatus } : item))
    await writeAudit('Community reply moderated', reply.id, { from: reply.status, to: nextStatus, author_email: reply.author_email })
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Posts</p><strong className="mt-2 block text-4xl text-slate-950">{posts.length}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Replies</p><strong className="mt-2 block text-4xl text-slate-950">{replies.length}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Hidden</p><strong className="mt-2 block text-4xl text-slate-950">{hiddenCount}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Queue</p><strong className="mt-2 block text-4xl text-slate-950">{filteredPosts.length}</strong></div>
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Community moderation</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-950">Posts & replies</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Review member posts, hide problematic content and restore useful discussions.</p></div>
          <button onClick={loadCommunity} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">Refresh</button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">{statuses.map((status) => <button key={status} onClick={() => setFilter(status)} className={filter === status ? 'rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-white' : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-500'}>{status}</button>)}</div>
        {notice && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{notice}</p>}
      </div>

      <div className="grid gap-5">
        {loading ? <div className="rounded-[32px] border border-slate-200 bg-white/80 p-7 text-slate-500">Loading community moderation...</div> : filteredPosts.length === 0 ? <div className="rounded-[32px] border border-dashed border-slate-200 bg-white/80 p-7 text-slate-500">No posts in this filter.</div> : filteredPosts.map((post) => {
          const postReplies = replies.filter((reply) => reply.post_id === post.id)
          return <article key={post.id} className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/50"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-2xl font-black text-slate-950">{post.title}</h3><p className="mt-1 text-sm text-slate-500">{post.author_email || 'member'} · {new Date(post.created_at).toLocaleString()}</p><p className="mt-4 leading-7 text-slate-700">{post.body}</p></div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-slate-600">{post.status}</span><button onClick={() => updatePostStatus(post, post.status === 'hidden' ? 'published' : 'hidden')} className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-white">{post.status === 'hidden' ? 'restore' : 'hide'}</button></div></div>{postReplies.length > 0 && <div className="mt-5 grid gap-3">{postReplies.map((reply) => <div key={reply.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{reply.author_email || 'member'} · {new Date(reply.created_at).toLocaleString()}</p><p className="mt-2 text-slate-700">{reply.body}</p></div><button onClick={() => updateReplyStatus(reply, reply.status === 'hidden' ? 'published' : 'hidden')} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-slate-600">{reply.status === 'hidden' ? 'restore' : 'hide'}</button></div></div>)}</div>}</article>
        })}
      </div>
    </section>
  )
}
