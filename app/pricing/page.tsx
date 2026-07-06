const plans = [
  ['Starter Review', 'A focused review for small teams that need visibility and priorities.', 'Risk summary, quick wins, roadmap.'],
  ['TRH Advisory', 'Continuous guidance for leaders and technical teams.', 'Monthly sessions, governance, reporting.'],
  ['Academy Teams', 'Practical training for people who need usable skills.', 'Tracks, workshops, labs, templates.'],
]

export default function PricingPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Pricing</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">Simple offers, tailored execution.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">TRH work is scoped around impact, urgency and responsibility. These packages are starting points for a serious discussion.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map(([title, intro, details]) => <article key={title} className="card p-7"><h2 className="text-2xl font-black text-slate-950">{title}</h2><p className="mt-3 leading-7 text-slate-600">{intro}</p><p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-[var(--primary)]">{details}</p></article>)}
        </div>
      </div>
    </main>
  )
}
