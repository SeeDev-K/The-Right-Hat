const events = [
  ['Admin login', 'Session opened from staff portal', 'info'],
  ['CRM read', 'Contact requests viewed from admin console', 'info'],
  ['Status change', 'Contact qualification state updated', 'warning'],
]

export default function AdminActivityPage() {
  return (
    <main className="min-h-screen bg-[#070b12] p-5 text-white lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-cyan-300">← Control Center</a>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Activity feed</h1>
        <p className="mt-3 text-slate-400">Operational trace of staff activity and platform events.</p>
        <div className="mt-8 grid gap-4">{events.map(([title, text, level]) => <article key={title} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black">{title}</h2><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">{level}</span></div><p className="mt-3 text-slate-400">{text}</p></article>)}</div>
      </div>
    </main>
  )
}
