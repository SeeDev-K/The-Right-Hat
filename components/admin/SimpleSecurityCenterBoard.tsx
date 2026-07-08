'use client'

import { useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type ModuleAccess = { name: string; allowed: boolean }

type SecurityState = {
  email: string
  userId: string
  role: string
  modules: ModuleAccess[]
  sessionReady: boolean
  auditReadable: boolean
  apiReadable: boolean
  notice: string
}

const moduleNames = ['crm', 'academy', 'media', 'community', 'apis', 'team', 'activity', 'security']

export function SimpleSecurityCenterBoard() {
  const [state, setState] = useState<SecurityState>({
    email: '',
    userId: '',
    role: 'unknown',
    modules: moduleNames.map((name) => ({ name, allowed: false })),
    sessionReady: false,
    auditReadable: false,
    apiReadable: false,
    notice: '',
  })
  const [loading, setLoading] = useState(true)

  const allowedCount = useMemo(() => state.modules.filter((item) => item.allowed).length, [state.modules])

  useEffect(() => { loadSecurityState() }, [])

  async function loadSecurityState() {
    setLoading(true)
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) {
      setState((current) => ({ ...current, notice: 'Supabase configuration required.' }))
      setLoading(false)
      return
    }

    const { data: sessionData } = await supabase.auth.getSession()
    const user = sessionData.session?.user
    if (!user) {
      setState((current) => ({ ...current, notice: 'No active admin session.' }))
      setLoading(false)
      return
    }

    const roleResponse = await supabase.rpc('current_admin_role')
    const accessResults = await Promise.all(moduleNames.map(async (name) => {
      const { data } = await supabase.rpc('can_access_module', { required_module: name })
      return { name, allowed: data === true }
    }))

    const auditResult = await supabase.from('audit_logs').select('id', { count: 'exact', head: true })
    const apiResult = await supabase.from('api_integrations').select('id', { count: 'exact', head: true })

    setState({
      email: user.email || '',
      userId: user.id,
      role: String(roleResponse.data || 'member'),
      modules: accessResults,
      sessionReady: true,
      auditReadable: !auditResult.error,
      apiReadable: !apiResult.error,
      notice: '',
    })
    setLoading(false)
  }

  const checks = [
    ['Session', state.sessionReady ? 'Active authenticated admin session.' : 'No active session.', state.sessionReady],
    ['RBAC functions', state.role !== 'unknown' ? `Resolved role: ${state.role}.` : 'Role could not be resolved.', state.role !== 'unknown'],
    ['Module permissions', `${allowedCount}/${moduleNames.length} modules allowed.`, allowedCount > 0],
    ['Audit visibility', state.auditReadable ? 'Audit logs are readable for this account.' : 'Audit logs are restricted for this account.', state.auditReadable],
    ['API visibility', state.apiReadable ? 'API integrations are readable for this account.' : 'API integrations are restricted for this account.', state.apiReadable],
  ]

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Session</p><strong className="mt-2 block text-4xl text-slate-950">{state.sessionReady ? 'ON' : 'OFF'}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Role</p><strong className="mt-2 block text-3xl text-slate-950">{state.role}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Modules</p><strong className="mt-2 block text-4xl text-slate-950">{allowedCount}</strong></div>
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-xl shadow-slate-200/60 backdrop-blur"><p className="text-sm font-black text-slate-500">Audit</p><strong className="mt-2 block text-4xl text-slate-950">{state.auditReadable ? 'OK' : '—'}</strong></div>
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Security Center</p><h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-950">Admin identity & access</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Live security view based on the current Supabase session, RBAC functions and module policies.</p></div>
          <button onClick={loadSecurityState} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">Refresh</button>
        </div>

        {loading ? <p className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 text-slate-500">Checking security state...</p> : null}
        {state.notice ? <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{state.notice}</p> : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-5">
            <h3 className="text-xl font-black text-slate-950">Current identity</h3>
            <div className="mt-4 space-y-3 text-sm">
              <p className="text-slate-500">Email<br /><b className="text-slate-950">{state.email || '—'}</b></p>
              <p className="text-slate-500">User ID<br /><b className="font-mono text-xs text-slate-950">{state.userId || '—'}</b></p>
              <p className="text-slate-500">Role<br /><b className="text-slate-950">{state.role}</b></p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5">
            <h3 className="text-xl font-black text-slate-950">Security checks</h3>
            <div className="mt-4 grid gap-3">{checks.map(([title, text, ok]) => <div key={String(title)} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 p-4"><div><p className="font-black text-slate-950">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div><span className={ok ? 'rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700' : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500'}>{ok ? 'OK' : 'LOCKED'}</span></div>)}</div>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <h3 className="text-2xl font-black tracking-[-.04em] text-slate-950">Module access matrix</h3>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {state.modules.map((item) => <div key={item.name} className="rounded-2xl border border-slate-100 bg-white p-4"><div className="flex items-center justify-between gap-3"><p className="font-black uppercase tracking-[.12em] text-slate-700">{item.name}</p><span className={item.allowed ? 'rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700' : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500'}>{item.allowed ? 'allowed' : 'blocked'}</span></div></div>)}
        </div>
      </div>
    </section>
  )
}
