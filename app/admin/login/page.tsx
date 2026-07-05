'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')
    const supabase = await createBrowserSupabaseClient()

    if (!supabase) {
      setError('Supabase configuration is missing.')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-[#f5f8ff]">
      <div className="grid min-h-screen lg:grid-cols-[.92fr_1.08fr]">
        <section className="flex items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-xl">
            <Image src="/assets/trh/logos/trh-logo-light-bg.png" alt="TRH" width={666} height={375} priority className="mb-10 h-20 w-auto object-contain" />
            <span className="badge">Admin access</span>
            <h1 className="mt-6 text-5xl font-black text-slate-950">Secure employee login.</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-slate-600">Dedicated access for TRH staff, editors, analysts and administrators.</p>
            <form onSubmit={onSubmit} className="card mt-8 grid gap-5 p-8">
              <label>Email<input name="email" type="email" required placeholder="staff@trh.ma" /></label>
              <label>Password<input name="password" type="password" required placeholder="Your password" /></label>
              <button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Signing in...' : 'Login to admin'}</button>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex flex-wrap gap-4 text-sm"><Link href="/forgot-password" className="text-[var(--primary)]">Forgot password?</Link><Link href="/" className="text-slate-600">Return to website</Link></div>
            </form>
          </div>
        </section>
        <section className="relative hidden overflow-hidden lg:block">
          <Image src="/assets/trh/admin/admin-login-bg.png" alt="TRH admin security" fill priority className="object-cover object-center" sizes="50vw" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#061126]/30 via-transparent to-[#061126]/75" />
        </section>
      </div>
    </main>
  )
}
