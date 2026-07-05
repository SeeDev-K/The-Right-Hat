'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type ContactRequest = {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  status: string
  source: string
  created_at: string
}

const modules = ['Contacts CRM', 'Academy CMS', 'Media CMS', 'Community Members', 'Security Settings', 'Analytics']

export default function AdminPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function loadAdmin() {
      setLoading(true)
      setError('')

      const supabase = createBrowserSupabaseClient()
      if (!supabase) {
        setError('Supabase public environment variables are missing in Vercel.')
        setLoading(false)
        return
      }

      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData.session

      if (!session) {
        router.replace('/login')
        return
      }

      setUserEmail(session.user.email || '')

      const response = await fetch('/api/admin/contact-requests', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      })

      if (!response.ok) {
        setError(response.status === 403 ? 'Your account is not admin yet. Add your user ID to admin_profiles.' : 'Unable to load contact requests.')
        setLoading(false)
        return
      }

      const payload = await response.json()
      setContacts(payload.items || [])
      setLoading(false)
    }

    loadAdmin()
  }, [router])

  async function signOut() {
    const supabase = createBrowserSupabaseClient()
    if (supabase) await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <main className="py-20">
      <div className="container">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <span className="badge">Admin</span>
            <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">TRH control center.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Authenticated dashboard for contacts, academy, media and community operations.</p>
          </div>
          <div className="card p-4 text-sm text-slate-600">
            <p className="font-bold text-slate-950">Signed in</p>
            <p>{userEmail || 'Loading...'}</p>
            <button onClick={signOut} className="mt-3 text-[var(--primary)]">Sign out</button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => <div key={module} className="card p-6 font-black text-slate-950">{module}</div>)}
        </div>

        <section className="mt-12">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-3xl font-black text-slate-950">Contact CRM</h2>
              <p className="mt-2 text-slate-600">Latest website contact requests from Supabase.</p>
            </div>
            <Link href="/contact" className="btn btn-ghost">Open public form</Link>
          </div>

          {loading && <div className="card p-6 text-slate-600">Loading contacts...</div>}
          {error && <div className="card p-6 text-red-600">{error}</div>}
          {!loading && !error && contacts.length === 0 && <div className="card p-6 text-slate-600">No contact requests yet.</div>}

          <div className="grid gap-4">
            {contacts.map((contact) => (
              <article key={contact.id} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-950">{contact.name}</h3>
                    <p className="text-slate-600">{contact.email}{contact.company ? ` · ${contact.company}` : ''}</p>
                  </div>
                  <span className="badge">{contact.status || 'new'}</span>
                </div>
                <p className="mt-4 leading-7 text-slate-600">{contact.message}</p>
                <p className="mt-4 text-xs uppercase tracking-[.18em] text-slate-500">{new Date(contact.created_at).toLocaleString()}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
