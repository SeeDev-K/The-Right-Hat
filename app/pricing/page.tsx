const plans = [
  ['Starter Audit', 'For small teams that need a first cybersecurity health check.', 'Security review, risk summary, action roadmap.'],
  ['TRH Advisory', 'For organizations that need continuous cyber guidance.', 'Monthly advisory, governance, detection roadmap.'],
  ['Academy Teams', 'For teams that need practical cybersecurity training.', 'Learning tracks, workshops, labs and reporting.'],
]

export default function PricingPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Pricing</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">Simple offers, tailored execution.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">TRH pricing depends on scope, criticality and delivery model. These packages are starting points for a professional discussion.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {plans.map(([title, intro, details]) => (
            <article key={title} className="card p-7">
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{intro}</p>
              <p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-[var(--gold-soft)]">{details}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
