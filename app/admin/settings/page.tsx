const sections = [
  ['Profile', 'Admin identity, email and operational contact.'],
  ['Team & roles', 'RBAC model: owner, admin, editor, analyst and readonly.'],
  ['Security', 'MFA policy, active sessions, API keys and secret rotation.'],
  ['Audit logs', 'Immutable administrative events and sensitive activity review.'],
]

export default function AdminSettingsPage() {
  return (
    <main className="min-h-screen bg-[#070b12] p-5 text-white lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-cyan-300">← Control Center</a>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Settings</h1>
        <p className="mt-3 text-slate-400">Security, roles, sessions and operational configuration for TRH staff.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">{sections.map(([title, text]) => <article key={title} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6"><h2 className="text-2xl font-black">{title}</h2><p className="mt-3 text-slate-400">{text}</p><button className="mt-6 rounded-2xl border border-white/10 px-4 py-3 text-sm font-black text-slate-300">Configure</button></article>)}</div>
      </div>
    </main>
  )
}
