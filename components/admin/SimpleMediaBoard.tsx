'use client'

import { FormEvent, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type MediaStatus = 'draft' | 'review' | 'published' | 'archived'

type MediaItem = {
  id: string
  title: string
  status: MediaStatus
  slug?: string | null
  summary?: string | null
  created_at?: string
}

const statusActions: { label: string; value: MediaStatus }[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Review', value: 'review' },
  { label: 'Publish', value: 'published' },
  { label: 'Archive', value: 'archived' },
]

const defaultRows: MediaItem[] = [
  { id: 'default-media-1', title: 'Executive Brief', status: 'draft', slug: 'executive-brief', summary: 'Leadership-ready media brief.' },
  { id: 'default-media-2', title: 'Operations Field Note', status: 'review', slug: 'operations-field-note', summary: 'Practical operations insight.' },
  { id: 'default-media-3', title: 'Career Insight', status: 'published', slug: 'career-insight', summary: 'Career and learning guidance.' },
]

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'media-brief'
}

export function SimpleMediaBoard() {
  const [items, setItems] = useState<MediaItem[]>(defaultRows)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [permissionNotice, setPermissionNotice] = useState(false)
  const [usingFallback, setUsingFallback] = useState(true)

  useEffect(() => {
    async function loadMediaItems() {
      setLoading(true)
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) { setItems(defaultRows); setUsingFallback(true); setLoading(false); return }
      const { data, error } = await supabase
        .from('content_items')
        .select('id,title,status,slug,summary,created_at')
        .eq('kind', 'media')
        .order('created_at', { ascending: false })
      if (error || !data || data.length === 0) { setItems(defaultRows); setUsingFallback(true) } else { setItems(data as MediaItem[]); setUsingFallback(false) }
      setLoading(false)
    }
    loadMediaItems()
  }, [])

  async function writeAudit(action: string, target: string, details: Record<string, unknown> = {}) {
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) return
    const { data } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      actor_user_id: data.user?.id || null,
      actor_email: data.user?.email || null,
      module: 'media',
      action,
      target,
      severity: 'info',
      details,
    })
  }

  async function addMediaItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanTitle = title.trim()
    if (!cleanTitle) return
    const cleanSummary = summary.trim()
    setSaving(true)
    setPermissionNotice(false)
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setPermissionNotice(true); setSaving(false); return }
    const { data, error } = await supabase
      .from('content_items')
      .insert({ title: cleanTitle, slug: slugify(cleanTitle), summary: cleanSummary || null, kind: 'media', status: 'draft' })
      .select('id,title,status,slug,summary,created_at')
      .single()
    if (error || !data) { setPermissionNotice(true); setSaving(false); return }
    setItems((currentItems) => (usingFallback ? [data as MediaItem] : [data as MediaItem, ...currentItems]))
    await writeAudit('Media item created', cleanTitle, { slug: slugify(cleanTitle), status: 'draft' })
    setUsingFallback(false)
    setTitle('')
    setSummary('')
    setSaving(false)
  }

  async function updateMediaStatus(itemId: string, status: MediaStatus) {
    setUpdatingId(itemId)
    setPermissionNotice(false)
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setPermissionNotice(true); setUpdatingId(null); return }
    const currentItem = items.find((item) => item.id === itemId)
    const { error } = await supabase.from('content_items').update({ status }).eq('id', itemId).eq('kind', 'media')
    if (error) { setPermissionNotice(true); setUpdatingId(null); return }
    setItems((currentItems) => currentItems.map((item) => (item.id === itemId ? { ...item, status } : item)))
    await writeAudit('Media status updated', currentItem?.title || itemId, { from: currentItem?.status || null, to: status })
    setUpdatingId(null)
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-[.18em] text-amber-300">Media CMS</p><h2 className="mt-2 text-3xl font-black text-white">Media board</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Draft and publish media items from Supabase.</p></div>
        {usingFallback && <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-slate-400">Defaults</span>}
      </div>
      <form onSubmit={addMediaItem} className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="New media item title" className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-amber-300 focus:shadow-none" />
        <input value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short public summary" className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-amber-300 focus:shadow-none" />
        <button disabled={saving} type="submit" className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Adding...' : 'Add draft'}</button>
      </form>
      {permissionNotice && <p className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-200">Database permission required.</p>}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <div className="grid gap-4 bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-[.16em] text-slate-500 md:grid-cols-[1fr_160px_120px_360px]"><span>Title</span><span>Slug</span><span>Status</span><span>Workflow</span></div>
        {loading ? <div className="px-4 py-5 text-sm text-slate-400">Loading media items...</div> : <div className="divide-y divide-slate-800">{items.map((item) => <article key={item.id} className="grid items-center gap-4 px-4 py-4 md:grid-cols-[1fr_160px_120px_360px]"><div><h3 className="font-bold text-white">{item.title}</h3>{item.summary && <p className="mt-1 text-xs text-slate-500">{item.summary}</p>}</div><span className="truncate font-mono text-xs text-slate-500">{item.slug || slugify(item.title)}</span><span className="w-fit rounded-full border border-slate-700 px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-amber-200">{item.status || 'draft'}</span><div className="flex flex-wrap gap-2">{statusActions.map((action) => { const isActive = item.status === action.value; return <button key={action.value} type="button" disabled={updatingId === item.id || isActive} onClick={() => updateMediaStatus(item.id, action.value)} className={['rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] transition disabled:cursor-not-allowed', isActive ? 'border-amber-300 bg-amber-300 text-slate-950' : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-300 hover:text-amber-200', updatingId === item.id && !isActive ? 'opacity-60' : ''].join(' ')}>{action.label}</button> })}</div></article>)}</div>}
      </div>
    </section>
  )
}
