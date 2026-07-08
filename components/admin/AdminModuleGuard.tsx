'use client'

import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type GuardState = 'loading' | 'allowed' | 'denied' | 'missing-config'

export function AdminModuleGuard({ module, children }: { module: string; children: ReactNode }) {
  const [state, setState] = useState<GuardState>('loading')
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function checkAccess() {
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) { setState('missing-config'); return }

      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) { setState('denied'); return }

      const [{ data: accessData, error: accessError }, { data: roleData }] = await Promise.all([
        supabase.rpc('can_access_module', { required_module: module }),
        supabase.rpc('current_admin_role'),
      ])

      if (roleData) setRole(String(roleData))
      if (accessError || accessData !== true) { setState('denied'); return }
      setState('allowed')
    }

    checkAccess()
  }, [module])

  if (state === 'allowed') return <>{children}</>

  if (state === 'loading') {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white/80 p-8 text-slate-500 shadow-xl shadow-slate-200/60 backdrop-blur">
        Checking module access...
      </div>
    )
  }

  return (
    <div className="rounded-[32px] border border-amber-200 bg-amber-50/90 p-8 text-amber-900 shadow-xl shadow-amber-100/70 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[.18em]">Restricted module</p>
      <h2 className="mt-3 text-3xl font-black tracking-[-.04em]">Access not allowed</h2>
      <p className="mt-3 max-w-xl leading-7">
        Your current role{role ? ` (${role})` : ''} is not allowed to open the <b>{module}</b> module.
        Ask an owner/admin to update your Team module access.
      </p>
      <Link href="/admin" className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
        Back to Control Center
      </Link>
    </div>
  )
}
