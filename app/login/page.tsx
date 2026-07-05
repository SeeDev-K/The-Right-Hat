'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')

    const supabase = createBrowserSupabaseClient()
    if (!supabase) {
      setError('Supabase public environment variables are missing in Vercel.')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/account')
    router.refresh()
  }

  return (
    <main className="py-20">
      <div className="container grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div className="max-w-lg">
          <span className="badge">Login</span>
          <h1 className="mt-5 text-4xl font-black text-slate-950">Access your TRH account.</h1>
          <p className="mt-4 leading-8 text-slate-600">Sign in to manage TRH admin, contact CRM and future academy/media operations.</p>
          <form onSubmit={onSubmit} className="card mt-8 grid gap-5 p-7">
            <label>Email<input name="email" type="email" required placeholder="admin@trh.ma" /></label>
            <label>Password<input name="password" type="password" required placeholder="Your password" /></label>
            <button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Signing in...' : 'Login'}</button>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/signup" className="text-[var(--primary)]">Create an account</Link>
              <Link href="/forgot-password" className="text-[var(--primary)]">Forgot password?</Link>
            </div>
          </form>
        </div>
        <div className="card overflow-hidden p-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-blue-50 lg:aspect-square">
            <Image src="/assets/trh/admin/admin-login-bg.png" alt="TRH secure login" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </div>
    </main>
  )
}
