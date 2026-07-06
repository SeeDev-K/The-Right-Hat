'use client'

import { FormEvent, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type AcademyItem = {
  id: string
  title: string
  status: string
  created_at?: string
}

const defaultRows: AcademyItem[] = [
  { id: 'default-1', title: 'Cybersecurity Foundations', status: 'draft' },
  { id: 'default-2', title: 'Incident Response Essentials', status: 'draft' },
  { id: 'default-3', title: 'Threat Intelligence Lab', status: 'published' },
]

export function SimpleAcademyBoard() {
  const [items, setItems] = useState<AcademyItem[]>(defaultRows)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [permissionNotice, setPermissionNotice] = useState(false)
  const [usingFallback, setUsingFallback] = useState(true)

  useEffect(() => {
    async function loadAcademyItems() {
      setLoading(true)

      const supabase = await createBrowserSupabaseClient()
      if (!supabase) {
        setItems(defaultRows)
        setUsingFallback(true)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('content_items')
        .select('id,title,status,created_at')
        .eq('kind', 'academy')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setItems(defaultRows)
        setUsingFallback(true)
      } else {
        setItems(data)
        setUsingFallback(false)
      }

      setLoading(false)
    }

    loadAcademyItems()
  }, [])

  async function addAcademyItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanTitle = title.trim()
    if (!cleanTitle) return

    setSaving(true)
    setPermissionNotice(false)

    const supabase = await createBrowserSupabaseClient()
    if (!supabase) {
      setPermissionNotice(true)
      setSaving(false)
      return
    }

    const { data, error } = await supabase
      .from('content_items')
      .insert({ title: cleanTitle, kind: 'academy', status: 'draft' })
      .select('id,title,status,created_at')
      .single()

    if (error || !data) {
      setPermissionNotice(true)
      setSaving(false)
      return
    }

    setItems((currentItems) => (usingFallback ? [data] : [data, ...currentItems]))
    setUsingFallback(false)
    setTitle('')
    setSaving(false)
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-amber-300">Academy CMS</p>
          <h2 className="mt-2 text-3xl font-black text-white">Academy board</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Draft and review academy content from Supabase.
          </p>
        </div>
        {usingFallback && (
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-bold uppercase tracking-[.16em] text-slate-400">
            Defaults
          </span>
        )}
      </div>

      <form onSubmit={addAcademyItem} className="mt-6 grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New academy item title"
          className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-amber-300 focus:shadow-none"
        />
        <button
          disabled={saving}
          type="submit"
          className="rounded-2xl bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Adding...' : 'Add draft'}
        </button>
      </form>

      {permissionNotice && (
        <p className="mt-4 rounded-2xl border border-amber-300/40 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-200">
          Database permission required.
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
        <div className="grid grid-cols-[1fr_120px] bg-slate-900 px-4 py-3 text-xs font-black uppercase tracking-[.16em] text-slate-500">
          <span>Title</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="px-4 py-5 text-sm text-slate-400">Loading academy items...</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {items.map((item) => (
              <article key={item.id} className="grid grid-cols-[1fr_120px] items-center gap-4 px-4 py-4">
                <h3 className="font-bold text-white">{item.title}</h3>
                <span className="w-fit rounded-full border border-slate-700 px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-amber-200">
                  {item.status || 'draft'}
                </span>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
