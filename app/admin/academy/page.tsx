const rows = [
  ['SOC Analyst Track', 'Published', 'Training pathway for triage and investigation workflow.'],
  ['Security Assessment Track', 'Draft', 'Methodology, evidence handling and reporting standards.'],
  ['Cloud Security Track', 'Published', 'Identity, logging and exposure review foundations.'],
  ['GRC Essentials', 'Review', 'Risk, controls, policy and executive reporting.'],
]

export default function AdminAcademyPage() {
  return (
    <main className="min-h-screen bg-[#070b12] p-5 text-white lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-cyan-300">← Control Center</a>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Academy CMS</h1>
        <p className="mt-3 text-slate-400">Manage learning tracks, status, editorial notes and publication readiness.</p>
        <div className="mt-8 grid gap-4">{rows.map(([title, status, text]) => <article key={title} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-black">{title}</h2><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-black text-cyan-200">{status}</span></div><p className="mt-3 text-slate-400">{text}</p></article>)}</div>
      </div>
    </main>
  )
}
