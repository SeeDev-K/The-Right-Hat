'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type GuardState = 'loading' | 'allowed' | 'denied' | 'missing-config'

const staffAccessPath = '/trh-staff/access'

export function AdminModuleGuard({ module, children }: { module: string; children: ReactNode }) {
  const router = useRouter()
  const [state, setState] = useState<GuardState>('loading')
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function checkAccess() {
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) { setState('missing-config'); return }

      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) { router.replace(staffAccessPath); return }

      const [{ data: accessData, error: accessError }, { data: roleData }] = await Promise.all([
        supabase.rpc('can_access_module', { required_module: module }),
        supabase.rpc('current_admin_role'),
      ])

      if (roleData) setRole(String(roleData))
      if (accessError || accessData !== true) { setState('denied'); return }
      setState('allowed')
    }

    checkAccess()
  }, [module, router])

  if (state === 'allowed') return <>{children}</>

  if (state === 'loading') {
    return (
      <div className="rounded-[32px] border border-slate-200 bg-white/80 p-8 text-slate-500 shadow-xl shadow-slate-200/60 backdrop-blur">
        Checking module access...
      </div>
    )
  }

  if (state === 'missing-config') {
    return (
      <div className="rounded-[32px] border border-red-200 bg-red-50/90 p-8 text-red-900 shadow-xl shadow-red-100/70 backdrop-blur">
        Supabase configuration is required.
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
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin" className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white">Back to Control Center</Link>
        <Link href="/access-restricted" className="inline-flex rounded-2xl border border-amber-300 px-5 py-3 text-sm font-black text-amber-900">Access details</Link>
      </div>
    </div>
  )
}
