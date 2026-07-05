'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function NewPasswordPage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    setError('')

    const password = String(new FormData(event.currentTarget).get('password') || '')
    const { error: updateError } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setStatus('Password updated. You can now login with the new password.')
    event.currentTarget.reset()
  }

  return (
    <main className="py-20">
      <div className="container max-w-lg">
        <span className="badge">Password</span>
        <h1 className="mt-5 text-4xl font-black">Choose a new password.</h1>
        <form onSubmit={onSubmit} className="card mt-8 grid gap-5 p-7">
          <label>New password<input name="password" type="password" required minLength={8} placeholder="Minimum 8 characters" /></label>
          <button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Updating...' : 'Update password'}</button>
          {status && <p className="text-sm text-emerald-300">{status}</p>}
          {error && <p className="text-sm text-red-300">{error}</p>}
          <Link href="/login" className="text-[var(--gold-soft)]">Back to login</Link>
        </form>
      </div>
    </main>
  )
}
