'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type AccountState = { email: string; id: string; createdAt: string }
type MemberProfile = { display_name: string; headline: string; company: string; bio: string }

export function AccountClient() {
  const router = useRouter()
  const [account, setAccount] = useState<AccountState | null>(null)
  const [profile, setProfile] = useState<MemberProfile>({ display_name: '', headline: '', company: '', bio: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    async function run() {
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) {
        setError('Supabase configuration is missing in Vercel.')
        setLoading(false)
        return
      }

      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.replace('/login')
        return
      }

      setAccount({ id: data.user.id, email: data.user.email || '', createdAt: data.user.created_at || '' })

      const { data: profileData } = await supabase
        .from('member_profiles')
        .select('display_name,headline,company,bio')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (profileData) {
        setProfile({
          display_name: profileData.display_name || '',
          headline: profileData.headline || '',
          company: profileData.company || '',
          bio: profileData.bio || '',
        })
      }
      setLoading(false)
    }

    run()
  }, [router])

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!account) return
    setSaving(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setError('Supabase configuration is missing in Vercel.'); setSaving(false); return }
    const { error: saveError } = await supabase
      .from('member_profiles')
      .upsert({ user_id: account.id, ...profile, updated_at: new Date().toISOString() })
    if (saveError) { setNotice('Could not save your profile.'); setSaving(false); return }
    setNotice('Profile saved successfully.')
    setSaving(false)
  }

  async function signOut() {
    const supabase = await createBrowserSupabaseClient()
    if (supabase) await supabase.auth.signOut()
    router.replace('/login')
  }

  return (
    <main className="py-20">
      <div className="container max-w-4xl">
        <span className="badge">Member account</span>
        <h1 className="mt-5 text-5xl font-black">Your TRH member profile.</h1>
        <p className="mt-4 max-w-2xl leading-8 text-slate-600">This account is for members, clients and the TRH Community. Admin access is reserved for The Right Hat owners and employees.</p>
        {loading && <div className="card mt-8 p-7 text-slate-600">Loading account...</div>}
        {error && <div className="card mt-8 p-7 text-red-600">{error}</div>}
        {account && (
          <div className="mt-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
            <div className="card grid gap-4 p-7">
              <h2 className="text-2xl font-black text-slate-950">Account</h2>
              <p><strong className="text-slate-950">Email:</strong> <span className="text-slate-600">{account.email}</span></p>
              <p><strong className="text-slate-950">User ID:</strong> <span className="break-all text-slate-600">{account.id}</span></p>
              <p><strong className="text-slate-950">Created:</strong> <span className="text-slate-600">{account.createdAt ? new Date(account.createdAt).toLocaleString() : 'Unknown'}</span></p>
              <div className="mt-4 flex flex-wrap gap-3"><Link href="/community" className="btn btn-primary">Open community</Link><button onClick={signOut} className="btn btn-ghost">Sign out</button></div>
            </div>

            <form onSubmit={saveProfile} className="card grid gap-4 p-7">
              <h2 className="text-2xl font-black text-slate-950">Public profile</h2>
              <input value={profile.display_name} onChange={(event) => setProfile((current) => ({ ...current, display_name: event.target.value }))} placeholder="Display name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
              <input value={profile.headline} onChange={(event) => setProfile((current) => ({ ...current, headline: event.target.value }))} placeholder="Headline / role" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
              <input value={profile.company} onChange={(event) => setProfile((current) => ({ ...current, company: event.target.value }))} placeholder="Company" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
              <textarea value={profile.bio} onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))} placeholder="Short bio" rows={4} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
              <button disabled={saving} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save profile'}</button>
              {notice && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{notice}</p>}
            </form>
          </div>
        )}
      </div>
    </main>
  )
}
