'use client'

import { FormEvent, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type TeamMember = {
  id: string
  full_name: string
  email: string
  role: string
  status: string
  modules?: string[] | null
  created_at?: string
}

type TeamInvite = {
  id: string
  full_name?: string | null
  email: string
  role: string
  status: string
  created_at?: string
}

const roles = ['owner', 'admin', 'editor', 'analyst', 'viewer']
const moduleOptions = ['crm', 'academy', 'media', 'community', 'apis', 'activity', 'security']

export function SimpleTeamBoard() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('editor')
  const [modules, setModules] = useState<string[]>(['crm', 'academy'])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => { loadTeam() }, [])

  async function writeAudit(action: string, target: string, details: Record<string, unknown> = {}) {
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) return
    const { data } = await supabase.auth.getUser()
    await supabase.from('audit_logs').insert({
      actor_user_id: data.user?.id || null,
      actor_email: data.user?.email || null,
      module: 'team',
      action,
      target,
      severity: 'info',
      details,
    })
  }

  async function loadTeam() {
    setLoading(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); setLoading(false); return }
    const [{ data: memberData, error: memberError }, { data: inviteData, error: inviteError }] = await Promise.all([
      supabase.from('team_members').select('id,full_name,email,role,status,modules,created_at').order('created_at', { ascending: false }),
      supabase.from('team_invites').select('id,full_name,email,role,status,created_at').order('created_at', { ascending: false }),
    ])
    if (memberError || inviteError) { setNotice('Database permission required.'); setLoading(false); return }
    setMembers((memberData || []) as TeamMember[])
    setInvites((inviteData || []) as TeamInvite[])
    setLoading(false)
  }

  async function createInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail) return
    setSaving(true)
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); setSaving(false); return }
    const { data, error } = await supabase
      .from('team_invites')
      .insert({ email: cleanEmail, full_name: fullName.trim() || null, role, status: 'pending' })
      .select('id,full_name,email,role,status,created_at')
      .single()
    if (error || !data) { setNotice('Database permission required.'); setSaving(false); return }
    setInvites((current) => [data as TeamInvite, ...current])
    await writeAudit('Team invite created', cleanEmail, { role, modules })
    setFullName('')
    setEmail('')
    setRole('editor')
    setSaving(false)
  }

  async function addMemberFromInvite(invite: TeamInvite) {
    setNotice('')
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) { setNotice('Supabase configuration required.'); return }
    const { data, error } = await supabase
      .from('team_members')
      .insert({ full_name: invite.full_name || invite.email, email: invite.email, role: invite.role, status: 'active', modules })
      .select('id,full_name,email,role,status,modules,created_at')
      .single()
    if (error || !data) { setNotice('Could not activate member. Check duplicate email or database permissions.'); return }
    await supabase.from('team_invites').update({ status: 'accepted', accepted_at: new Date().toISOString() }).eq('id', invite.id)
    setMembers((current) => [data as TeamMember, ...current])
    setInvites((current) => current.map((item) => item.id === invite.id ? { ...item, status: 'accepted' } : item))
    await writeAudit('Team member activated', invite.email, { role: invite.role, modules })
  }

  async function updateMemberRole(memberId: string, nextRole: string) {
    const supabase = await createBrowserSupabaseClient()
    if (!supabase) return
    const currentMember = members.find((member) => member.id === memberId)
    const { error } = await supabase.from('team_members').update({ role: nextRole }).eq('id', memberId)
    if (error) { setNotice('Could not update role.'); return }
    setMembers((current) => current.map((member) => member.id === memberId ? { ...member, role: nextRole } : member))
    await writeAudit('Team role updated', currentMember?.email || memberId, { from: currentMember?.role || null, to: nextRole })
  }

  function toggleModule(module: string) {
    setModules((current) => current.includes(module) ? current.filter((item) => item !== module) : [...current, module])
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-blue-600">Team access</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-.04em] text-slate-950">Members & invitations</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Invite collaborators, assign roles and prepare module access for the TRH control center.</p>
          </div>
          <button onClick={loadTeam} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">Refresh</button>
        </div>

        <form onSubmit={createInvite} className="mt-6 grid gap-3 lg:grid-cols-[1fr_1fr_160px_auto]">
          <input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@company.com" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400" />
          <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-400">
            {roles.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button disabled={saving} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-lg shadow-slate-300 disabled:opacity-60">{saving ? 'Saving...' : 'Create invite'}</button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {moduleOptions.map((module) => <button key={module} type="button" onClick={() => toggleModule(module)} className={modules.includes(module) ? 'rounded-full bg-blue-600 px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-white' : 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-[.12em] text-slate-500'}>{module}</button>)}
        </div>

        {notice && <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{notice}</p>}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <h3 className="text-2xl font-black tracking-[-.04em] text-slate-950">Active members</h3>
          {loading ? <p className="mt-5 text-slate-500">Loading members...</p> : members.length === 0 ? <p className="mt-5 rounded-2xl border border-dashed border-slate-200 p-5 text-slate-500">No active members yet.</p> : <div className="mt-5 divide-y divide-slate-100">{members.map((member) => <article key={member.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><h4 className="font-black text-slate-950">{member.full_name}</h4><p className="text-sm text-slate-500">{member.email}</p><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-blue-600">{member.status}</p></div><select value={member.role} onChange={(event) => updateMemberRole(member.id, event.target.value)} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">{roles.map((item) => <option key={item} value={item}>{item}</option>)}</select></article>)}</div>}
        </div>

        <div className="rounded-[32px] border border-slate-200/80 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
          <h3 className="text-2xl font-black tracking-[-.04em] text-slate-950">Invitations</h3>
          {loading ? <p className="mt-5 text-slate-500">Loading invitations...</p> : invites.length === 0 ? <p className="mt-5 rounded-2xl border border-dashed border-slate-200 p-5 text-slate-500">No pending invitations yet.</p> : <div className="mt-5 divide-y divide-slate-100">{invites.map((invite) => <article key={invite.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><h4 className="font-black text-slate-950">{invite.full_name || invite.email}</h4><p className="text-sm text-slate-500">{invite.email} · {invite.role}</p><p className="mt-1 text-xs font-bold uppercase tracking-[.12em] text-slate-400">{invite.status}</p></div>{invite.status === 'pending' && <button onClick={() => addMemberFromInvite(invite)} className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-black text-white shadow-lg shadow-blue-100">Activate</button>}</article>)}</div>}
        </div>
      </div>
    </section>
  )
}
