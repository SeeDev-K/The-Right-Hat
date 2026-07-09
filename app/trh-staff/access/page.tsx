'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

const staffModules = ['crm', 'academy', 'media', 'community', 'apis', 'library', 'team', 'activity', 'security', 'settings']

export default function StaffAccessPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [failed, setFailed] = useState(0)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (failed >= 5) { setError('Access temporarily locked. Try again later.'); return }
    setLoading(true); setError('')
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setError('Supabase configuration is missing.'); setLoading(false); return }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) { setLoading(false); setFailed((x) => x + 1); setError('Access denied.'); return }

    const accessChecks = await Promise.all(staffModules.map(async (moduleName) => {
      const { data: allowed } = await supabase.rpc('can_access_module', { required_module: moduleName })
      return allowed === true
    }))

    if (!accessChecks.some(Boolean)) {
      await supabase.auth.signOut()
      setLoading(false)
      setFailed((x) => x + 1)
      setError('Access denied. This entry is reserved for approved TRH staff.')
      return
    }

    setLoading(false)
    router.push('/admin'); router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#070b12] text-white">
      <div className="grid min-h-screen lg:grid-cols-[.92fr_1.08fr]">
        <section className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-xl">
            <Image src="/assets/trh/logos/trh-logo-light-bg.png" alt="TRH" width={666} height={375} priority className="mb-10 h-20 w-auto object-contain brightness-125" />
            <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-200">TRH staff access</span>
            <h1 className="mt-7 text-5xl font-black tracking-[-.06em] text-white md:text-6xl">Private operations entry.</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-300">Reserved for approved The Right Hat owners, operators and employees only.</p>
            <form onSubmit={onSubmit} className="mt-8 grid gap-5 rounded-[32px] border border-white/10 bg-white/[.06] p-8 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
              <label className="text-slate-200">Staff email<input name="email" type="email" required placeholder="approved@trh.ma" className="border-white/10 bg-black/25 text-white placeholder:text-slate-500" /></label>
              <label className="text-slate-200">Password<div className="relative"><input name="password" type={showPassword ? 'text' : 'password'} required placeholder="Your password" onKeyUp={(e) => setCapsLock(e.getModifierState('CapsLock'))} className="border-white/10 bg-black/25 pr-24 text-white placeholder:text-slate-500" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-cyan-200">{showPassword ? 'Hide' : 'Show'}</button></div></label>
              {capsLock && <p className="text-sm text-amber-300">Caps Lock is enabled.</p>}
              <button disabled={loading} className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-400 px-5 py-4 font-black text-white shadow-lg shadow-blue-600/25" type="submit">{loading ? 'Verifying permissions...' : 'Enter control center'}</button>
              <p className="text-xs font-bold text-slate-400">Private staff access · Role and module permissions checked before opening the console</p>
              {failed > 0 && <p className="text-xs text-amber-300">Failed attempts: {failed}/5</p>}
              {error && <p className="text-sm text-red-300">{error}</p>}
              <div className="flex flex-wrap gap-4 text-sm"><Link href="/forgot-password" className="text-cyan-200">Forgot password?</Link><Link href="/" className="text-slate-400">Return to website</Link></div>
            </form>
          </div>
        </section>
        <section className="relative hidden overflow-hidden lg:block">
          <Image src="/assets/trh/admin/admin-login-bg.png" alt="TRH private operations" fill priority className="object-cover object-center" sizes="50vw" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.28),transparent_32%),linear-gradient(to_bottom,rgba(7,11,18,.05),rgba(7,11,18,.84))]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,.08)_1px,transparent_1px),linear-gradient(rgba(34,211,238,.08)_1px,transparent_1px)] bg-[size:64px_64px] opacity-50" />
        </section>
      </div>
    </main>
  )
}
