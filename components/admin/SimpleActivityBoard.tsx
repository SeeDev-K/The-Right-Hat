'use client'

import { useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type AuditLog = {
  id: string
  actor_email?: string | null
  module?: string | null
  action: string
  target?: string | null
  severity: string
  details?: Record<string, unknown> | null
  created_at: string
}

const severities = ['all', 'info', 'success', 'warning', 'critical'] as const

export function SimpleActivityBoard() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [moduleFilter, setModuleFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState<(typeof severities)[number]>('all')
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState('')

  const modules = useMemo(() => ['all', ...Array.from(new Set(logs.map((log) => log.module || 'system')))], [logs])
  const filteredLogs = useMemo(() => logs.filter((log) => {
    const moduleMatch = moduleFilter === 'all' || (log.module || 'system') === moduleFilter
    const severityMatch = severityFilter === 'all' || log.severity === severityFilter
    return moduleMatch && severityMatch
  }), [logs, moduleFilter, severityFilter])

  useEffect(() => { loadLogs() }, [])

  async function loadLogs() {
    setLoading(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); setLoading(false); return }
    const { data, error } = await supabase
      .from('audit_logs')
      .select('id,actor_email,module,action,target,severity,details,created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) { setNotice('Database permission required.'); setLoading(false); return }
    setLogs((data || []) as AuditLog[])
    setLoading(false)
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Events</p><strong className="mt-2 block text-4xl text-slate-950">{logs.length}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Modules</p><strong className="mt-2 block text-4xl text-slate-950">{Math.max(modules.length - 1, 0)}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Warnings</p><strong className="mt-2 block text-4xl text-slate-950">{logs.filter((log) => log.severity === 'warning').length}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Critical</p><strong className="mt-2 block text-4xl text-slate-950">{logs.filter((log) => log.severity === 'critical').length}</strong></div>
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Activity Center</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-950">Audit trail</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Review administrative activity, module operations and important system events.</p></div>
          <button onClick={loadLogs} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">Refresh</button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {modules.map((module) => <button key={module} onClick={() => setModuleFilter(module)} className={moduleFilter === module ? 'rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-white' : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-500'}>{module}</button>)}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {severities.map((severity) => <button key={severity} onClick={() => setSeverityFilter(severity)} className={severityFilter === severity ? 'rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-white' : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-500'}>{severity}</button>)}
        </div>
        {notice && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{notice}</p>}
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        {loading ? <p className="text-slate-500">Loading activity...</p> : filteredLogs.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-slate-500">No activity found for this filter.</p> : <div className="divide-y divide-slate-100">{filteredLogs.map((log) => <article key={log.id} className="grid gap-4 py-5 lg:grid-cols-[160px_1fr_140px_180px] lg:items-center"><div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-blue-700">{log.module || 'system'}</span><p className="mt-2 text-xs text-slate-400">{new Date(log.created_at).toLocaleString()}</p></div><div><h3 className="font-black text-slate-950">{log.action}</h3><p className="mt-1 text-sm text-slate-500">{log.target || 'No target'} · {log.actor_email || 'system'}</p></div><span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-[.12em] text-slate-600">{log.severity}</span><p className="truncate font-mono text-xs text-slate-400">{log.details ? JSON.stringify(log.details) : '{}'}</p></article>)}</div>}
      </div>
    </section>
  )
}
