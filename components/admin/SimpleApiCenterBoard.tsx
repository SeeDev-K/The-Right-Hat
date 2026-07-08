'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type ApiStatus = 'active' | 'inactive' | 'degraded' | 'error'
type AuthType = 'none' | 'bearer' | 'apikey' | 'basic' | 'oauth2'

type ApiIntegration = {
  id: string
  name: string
  slug: string
  category: string
  base_url?: string | null
  status: ApiStatus
  auth_type: AuthType
  masked_key?: string | null
  webhook_url?: string | null
  rate_limit_per_min?: number | null
  last_status_code?: number | null
  last_latency_ms?: number | null
  last_check_at?: string | null
  notes?: string | null
  created_at?: string
}

type ApiLog = {
  id: string
  integration_id?: string | null
  event_type: string
  status: string
  message?: string | null
  status_code?: number | null
  latency_ms?: number | null
  created_at?: string
}

const statuses: ApiStatus[] = ['active', 'inactive', 'degraded', 'error']
const authTypes: AuthType[] = ['none', 'bearer', 'apikey', 'basic', 'oauth2']

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'api-integration'
}

export function SimpleApiCenterBoard() {
  const [items, setItems] = useState<ApiIntegration[]>([])
  const [logs, setLogs] = useState<ApiLog[]>([])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('internal')
  const [baseUrl, setBaseUrl] = useState('')
  const [authType, setAuthType] = useState<AuthType>('none')
  const [maskedKey, setMaskedKey] = useState('')
  const [rateLimit, setRateLimit] = useState('')
  const [filter, setFilter] = useState<'all' | ApiStatus>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  const filteredItems = useMemo(() => filter === 'all' ? items : items.filter((item) => item.status === filter), [items, filter])
  const activeCount = items.filter((item) => item.status === 'active').length
  const degradedCount = items.filter((item) => item.status === 'degraded' || item.status === 'error').length

  useEffect(() => { loadApis() }, [])

  async function loadApis() {
    setLoading(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); setLoading(false); return }
    const [{ data: apiData, error: apiError }, { data: logData }] = await Promise.all([
      supabase.from('api_integrations').select('*').order('created_at', { ascending: false }),
      supabase.from('api_logs').select('*').order('created_at', { ascending: false }).limit(12),
    ])
    if (apiError) { setNotice('Database permission required.'); setLoading(false); return }
    setItems((apiData || []) as ApiIntegration[])
    setLogs((logData || []) as ApiLog[])
    setLoading(false)
  }

  async function createIntegration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = name.trim()
    if (!cleanName) return
    setSaving(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); setSaving(false); return }
    const { data, error } = await supabase
      .from('api_integrations')
      .insert({
        name: cleanName,
        slug: slugify(cleanName),
        category: category.trim() || 'internal',
        base_url: baseUrl.trim() || null,
        status: 'inactive',
        auth_type: authType,
        masked_key: maskedKey.trim() || null,
        rate_limit_per_min: rateLimit ? Number(rateLimit) : null,
      })
      .select('*')
      .single()
    if (error || !data) { setNotice('Could not create API integration. Check duplicate slug or database permissions.'); setSaving(false); return }
    setItems((current) => [data as ApiIntegration, ...current])
    setName('')
    setCategory('internal')
    setBaseUrl('')
    setAuthType('none')
    setMaskedKey('')
    setRateLimit('')
    setSaving(false)
  }

  async function updateStatus(item: ApiIntegration, nextStatus: ApiStatus) {
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); return }
    const latency = Math.floor(80 + Math.random() * 320)
    const statusCode = nextStatus === 'active' ? 200 : nextStatus === 'degraded' ? 429 : nextStatus === 'error' ? 500 : null
    const { error } = await supabase
      .from('api_integrations')
      .update({ status: nextStatus, last_status_code: statusCode, last_latency_ms: latency, last_check_at: new Date().toISOString() })
      .eq('id', item.id)
    if (error) { setNotice('Could not update integration status.'); return }
    await supabase.from('api_logs').insert({ integration_id: item.id, event_type: 'status_update', status: nextStatus, message: `${item.name} marked ${nextStatus}`, status_code: statusCode, latency_ms: latency })
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: nextStatus, last_status_code: statusCode, last_latency_ms: latency, last_check_at: new Date().toISOString() } : entry))
    loadApis()
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Integrations</p><strong className="mt-2 block text-4xl text-slate-950">{items.length}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Active</p><strong className="mt-2 block text-4xl text-slate-950">{activeCount}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Attention</p><strong className="mt-2 block text-4xl text-slate-950">{degradedCount}</strong></div>
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">API Center</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-950">Integration registry</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Create, classify and monitor API integrations without exposing real secrets in the browser.</p></div>
          <button onClick={loadApis} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">Refresh</button>
        </div>

        <form onSubmit={createIntegration} className="mt-6 grid gap-3 xl:grid-cols-[1fr_140px_1fr_130px_160px_110px_auto]">
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Integration name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="category" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="Base URL" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <select value={authType} onChange={(event) => setAuthType(event.target.value as AuthType)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400">{authTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select>
          <input value={maskedKey} onChange={(event) => setMaskedKey(event.target.value)} placeholder="masked key" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <input value={rateLimit} onChange={(event) => setRateLimit(event.target.value)} placeholder="rate/min" type="number" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <button disabled={saving} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 disabled:opacity-60">{saving ? 'Saving...' : 'Add API'}</button>
        </form>

        <div className="mt-5 flex flex-wrap gap-2">
          {(['all', ...statuses] as const).map((status) => <button key={status} onClick={() => setFilter(status)} className={filter === status ? 'rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-white' : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-500'}>{status}</button>)}
        </div>

        {notice && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{notice}</p>}
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <h3 className="text-2xl font-black tracking-[-.04em] text-slate-950">Integrations</h3>
        {loading ? <p className="mt-5 text-slate-500">Loading API integrations...</p> : filteredItems.length === 0 ? <p className="mt-5 rounded-2xl border border-dashed border-slate-200 p-5 text-slate-500">No integrations in this view.</p> : <div className="mt-5 divide-y divide-slate-100">{filteredItems.map((item) => <article key={item.id} className="grid gap-4 py-5 xl:grid-cols-[1fr_130px_130px_150px_1fr] xl:items-center"><div><h4 className="font-black text-slate-950">{item.name}</h4><p className="mt-1 font-mono text-xs text-slate-500">{item.slug}</p><p className="mt-1 text-sm text-slate-500">{item.base_url || 'No base URL'}</p></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-slate-600">{item.category}</span><span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-blue-700">{item.status}</span><span className="font-mono text-xs text-slate-500">{item.last_status_code || '—'} · {item.last_latency_ms || '—'}ms</span><div className="flex flex-wrap gap-2">{statuses.map((status) => <button key={status} onClick={() => updateStatus(item, status)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-600 hover:border-blue-300 hover:text-blue-700">{status}</button>)}</div></article>)}</div>}
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <h3 className="text-2xl font-black tracking-[-.04em] text-slate-950">Recent API logs</h3>
        {logs.length === 0 ? <p className="mt-5 rounded-2xl border border-dashed border-slate-200 p-5 text-slate-500">No API logs yet.</p> : <div className="mt-5 grid gap-3">{logs.map((log) => <div key={log.id} className="rounded-2xl border border-slate-100 bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-3"><p className="font-black text-slate-950">{log.event_type}</p><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-slate-600">{log.status}</span></div><p className="mt-1 text-sm text-slate-500">{log.message || 'No message'} · {log.status_code || '—'} · {log.latency_ms || '—'}ms</p></div>)}</div>}
      </div>
    </section>
  )
}
