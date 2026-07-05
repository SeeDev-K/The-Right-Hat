'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export function ForgotPasswordClient() {
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    setError('')

    const supabase = await createBrowserSupabaseClient()
    if (!supabase) {
      setError('Supabase configuration is missing in Vercel.')
      setLoading(false)
      return
    }

    const email = String(new FormData(event.currentTarget).get('email') || '').trim()
    const redirectTo = `${window.location.origin}/password/new`
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    setLoading(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setStatus('Password reset email sent. Check your inbox.')
    event.currentTarget.reset()
  }

  return (
    <main className="py-20">
      <div className="container max-w-lg">
        <span className="badge">Password</span>
        <h1 className="mt-5 text-4xl font-black text-slate-950">Reset your password.</h1>
        <form onSubmit={onSubmit} className="card mt-8 grid gap-5 p-7">
          <label>Email<input name="email" type="email" required placeholder="you@company.com" /></label>
          <button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Sending...' : 'Send reset link'}</button>
          {status && <p className="text-sm text-emerald-600">{status}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Link href="/login" className="text-[var(--primary)]">Back to login</Link>
        </form>
      </div>
    </main>
  )
}
