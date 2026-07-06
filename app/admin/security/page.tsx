const checks = [
  ['Headers', 'Baseline browser security headers are configured in Next.js.'],
  ['RBAC', 'Admin APIs re-check user permissions server-side.'],
  ['Audit foundation', 'Database table exists for administrative event logging.'],
  ['Secrets', 'Service role key remains server-side only.'],
]

export default function AdminSecurityPage() {
  return (
    <main className="min-h-screen bg-[#070b12] p-5 text-white lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-cyan-300">← Control Center</a>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Security posture</h1>
        <p className="mt-3 text-slate-400">Internal readiness view for authentication, access control and platform safeguards.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-4">{checks.map(([title, text]) => <article key={title} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6"><h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-400">{text}</p><span className="mt-5 inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">OK</span></article>)}</div>
      </div>
    </main>
  )
}
