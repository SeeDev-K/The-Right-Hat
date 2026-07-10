'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type CommunityPost = {
  id: string
  user_id: string
  author_email?: string | null
  title: string
  body: string
  created_at: string
}

type CommunityReply = {
  id: string
  post_id: string
  user_id: string
  author_email?: string | null
  body: string
  created_at: string
}

type MemberProfile = {
  user_id: string
  display_name?: string | null
  headline?: string | null
  company?: string | null
}

type MemberModeration = {
  status?: string | null
}

export function CommunityBoard() {
  const [userEmail, setUserEmail] = useState('')
  const [userId, setUserId] = useState('')
  const [memberStatus, setMemberStatus] = useState('active')
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [replies, setReplies] = useState<CommunityReply[]>([])
  const [profiles, setProfiles] = useState<Record<string, MemberProfile>>({})
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [replyBody, setReplyBody] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const canPost = userId && memberStatus === 'active'

  useEffect(() => { loadCommunity() }, [])

  function profileLabel(userIdValue: string, fallbackEmail?: string | null) {
    const profile = profiles[userIdValue]
    return profile?.display_name || fallbackEmail || 'TRH member'
  }

  function profileMeta(userIdValue: string) {
    const profile = profiles[userIdValue]
    return [profile?.headline, profile?.company].filter(Boolean).join(' · ')
  }

  function moderationMessage() {
    if (memberStatus === 'paused') return 'Your community posting access is currently paused. You can still read and report discussions, but posting and replying are disabled.'
    if (memberStatus === 'banned') return 'Your community posting access is currently blocked. You can still read and report public discussions, but posting and replying are disabled.'
    return ''
  }

  async function loadProfiles(userIds: string[]) {
    const cleanIds = Array.from(new Set(userIds.filter(Boolean)))
    if (cleanIds.length === 0) return {}
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) return {}
    const { data } = await supabase
      .from('member_profiles')
      .select('user_id,display_name,headline,company')
      .in('user_id', cleanIds)
    return Object.fromEntries(((data || []) as MemberProfile[]).map((profile) => [profile.user_id, profile]))
  }

  async function loadCommunity() {
    setLoading(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); setLoading(false); return }
    const { data: sessionData } = await supabase.auth.getSession()
    const currentUserId = sessionData.session?.user.id || ''
    setUserId(currentUserId)
    setUserEmail(sessionData.session?.user.email || '')

    const moderationPromise = currentUserId
      ? supabase.from('member_moderation').select('status').eq('user_id', currentUserId).maybeSingle()
      : Promise.resolve({ data: null })

    const [{ data: postData, error: postError }, { data: replyData }, moderationResult] = await Promise.all([
      supabase.from('community_posts').select('id,user_id,author_email,title,body,created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(30),
      supabase.from('community_replies').select('id,post_id,user_id,author_email,body,created_at').eq('status', 'published').order('created_at', { ascending: true }).limit(120),
      moderationPromise,
    ])
    if (postError) { setNotice('Community database is not ready yet.'); setLoading(false); return }
    const loadedPosts = (postData || []) as CommunityPost[]
    const loadedReplies = (replyData || []) as CommunityReply[]
    const moderation = moderationResult.data as MemberModeration | null
    setMemberStatus(moderation?.status || 'active')
    setPosts(loadedPosts)
    setReplies(loadedReplies)
    setProfiles(await loadProfiles([...loadedPosts.map((post) => post.user_id), ...loadedReplies.map((reply) => reply.user_id), currentUserId]))
    setLoading(false)
  }

  async function createPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanTitle = title.trim()
    const cleanBody = body.trim()
    if (!cleanTitle || !cleanBody) return
    if (!canPost) { setNotice(moderationMessage() || 'Please sign in to post in the community.'); return }
    const supabase = await createBrowserSupabaseClient()
    if (!supabase || !userId) { setNotice('Please sign in to post in the community.'); return }
    const { data, error } = await supabase
      .from('community_posts')
      .insert({ user_id: userId, author_email: userEmail, title: cleanTitle, body: cleanBody })
      .select('id,user_id,author_email,title,body,created_at')
      .single()
    if (error || !data) { setNotice('Could not publish your post. Your community access may be restricted.'); return }
    setPosts((current) => [data as CommunityPost, ...current])
    setProfiles((current) => ({ ...current }))
    setTitle('')
    setBody('')
  }

  async function createReply(postId: string) {
    const cleanBody = (replyBody[postId] || '').trim()
    if (!cleanBody) return
    if (!canPost) { setNotice(moderationMessage() || 'Please sign in to reply.'); return }
    const supabase = await createBrowserSupabaseClient()
    if (!supabase || !userId) { setNotice('Please sign in to reply.'); return }
    const { data, error } = await supabase
      .from('community_replies')
      .insert({ post_id: postId, user_id: userId, author_email: userEmail, body: cleanBody })
      .select('id,post_id,user_id,author_email,body,created_at')
      .single()
    if (error || !data) { setNotice('Could not publish your reply. Your community access may be restricted.'); return }
    setReplies((current) => [...current, data as CommunityReply])
    setReplyBody((current) => ({ ...current, [postId]: '' }))
  }

  async function reportContent(targetType: 'post' | 'reply', targetId: string) {
    const supabase = await createBrowserSupabaseClient()
    if (!supabase || !userId) { setNotice('Please sign in to report content.'); return }
    const reason = window.prompt('Why are you reporting this content?') || 'Reported by community member'
    const { error } = await supabase.from('community_reports').insert({
      reporter_user_id: userId,
      target_type: targetType,
      target_id: targetId,
      reason: reason.trim() || 'Reported by community member',
    })
    if (error) { setNotice('Could not submit the report.'); return }
    setNotice('Report submitted. TRH community moderators will review it.')
  }

  return (
    <section className="mt-12 grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
      <div className="card p-7">
        <p className="text-xs font-black uppercase tracking-[.2em] text-[var(--primary)]">Member area</p>
        <h2 className="mt-3 text-3xl font-black text-slate-950">Post in the TRH Community</h2>
        <p className="mt-3 leading-7 text-slate-600">Members can share ideas, questions, updates and professional discussions with the community.</p>
        {userEmail ? <div className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700"><p>Signed in as {profileLabel(userId, userEmail)}</p>{profileMeta(userId) && <p className="mt-1 text-xs text-blue-600">{profileMeta(userId)}</p>}<p className="mt-2 text-xs font-black uppercase tracking-[.14em]">Community status: {memberStatus}</p><Link href="/account" className="mt-2 inline-flex text-xs font-black uppercase tracking-[.14em]">Edit profile →</Link></div> : <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5"><p className="font-bold text-slate-950">Sign in required</p><p className="mt-2 text-sm text-slate-600">Create a member account to publish posts, replies and reports.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/login" className="btn btn-primary">Member sign in</Link><Link href="/signup" className="btn btn-ghost">Join TRH</Link></div></div>}
        {moderationMessage() && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{moderationMessage()}</p>}
        <form onSubmit={createPost} className="mt-6 grid gap-3">
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write something useful for the community..." rows={5} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <button disabled={!canPost} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">Publish post</button>
        </form>
        {notice && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{notice}</p>}
      </div>

      <div className="grid gap-4">
        {loading ? <div className="card p-7 text-slate-500">Loading community posts...</div> : posts.length === 0 ? <div className="card p-7 text-slate-500">No posts yet. Be the first to start a discussion.</div> : posts.map((post) => {
          const postReplies = replies.filter((reply) => reply.post_id === post.id)
          return <article key={post.id} className="card p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-2xl font-black text-slate-950">{post.title}</h3><p className="mt-1 text-sm text-slate-500">{profileLabel(post.user_id, post.author_email)} · {new Date(post.created_at).toLocaleString()}</p>{profileMeta(post.user_id) && <p className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-blue-600">{profileMeta(post.user_id)}</p>}</div>{userId && <button onClick={() => reportContent('post', post.id)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-500 hover:bg-slate-50">Report</button>}</div><p className="mt-4 leading-7 text-slate-700">{post.body}</p><div className="mt-5 grid gap-3">{postReplies.map((reply) => <div key={reply.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-slate-500">{profileLabel(reply.user_id, reply.author_email)} · {new Date(reply.created_at).toLocaleString()}</p>{profileMeta(reply.user_id) && <p className="mt-1 text-xs font-bold uppercase tracking-[.14em] text-blue-600">{profileMeta(reply.user_id)}</p>}<p className="mt-2 text-slate-700">{reply.body}</p></div>{userId && <button onClick={() => reportContent('reply', reply.id)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-500 hover:bg-slate-50">Report</button>}</div></div>)}</div>{userId && <div className="mt-5 flex gap-3"><input disabled={!canPost} value={replyBody[post.id] || ''} onChange={(event) => setReplyBody((current) => ({ ...current, [post.id]: event.target.value }))} placeholder={canPost ? 'Reply to this discussion' : 'Reply disabled'} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400 disabled:opacity-60" /><button disabled={!canPost} onClick={() => createReply(post.id)} className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">Reply</button></div>}</article>
        })}
      </div>
    </section>
  )
}
