'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function SignupPage() {
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    setError('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const fullName = String(formData.get('full_name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const password = String(formData.get('password') || '')
    const role = String(formData.get('role') || '').trim()

    const supabase = createBrowserSupabaseClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, requested_role: role } },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setStatus('Account request created. Check your email if confirmation is enabled in Supabase.')
    form.reset()
  }

  return (
    <main className="py-20">
      <div className="container max-w-lg">
        <span className="badge">Signup</span>
        <h1 className="mt-5 text-4xl font-black">Request TRH access.</h1>
        <form onSubmit={onSubmit} className="card mt-8 grid gap-5 p-7">
          <label>Name<input name="full_name" required placeholder="Full name" /></label>
          <label>Email<input name="email" type="email" required placeholder="you@company.com" /></label>
          <label>Password<input name="password" type="password" required minLength={8} placeholder="Minimum 8 characters" /></label>
          <label>Role<input name="role" placeholder="Founder, analyst, student..." /></label>
          <button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Creating...' : 'Request access'}</button>
          {status && <p className="text-sm text-emerald-300">{status}</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Link href="/login" className="text-[var(--gold-soft)]">Already have access?</Link>
        </form>
      </div>
    </main>
  )
}
