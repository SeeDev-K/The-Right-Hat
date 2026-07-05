import Link from 'next/link'

const pillars = [
  ['Offensive Security', 'Penetration testing, red-team simulation, attack-path mapping and executive risk translation.'],
  ['Defensive Operations', 'Detection engineering, incident readiness, SOC maturity, playbooks and response architecture.'],
  ['TRH Academy', 'Operator-grade training tracks for cyber teams, IT leaders and ambitious beginners.'],
  ['Media & Community', 'Cyber awareness, practical research, events and a trusted professional network.'],
]

const stats = [
  ['4', 'strategic pillars'],
  ['24/7', 'readiness mindset'],
  ['100%', 'clarity-first delivery'],
]

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 grid-lines opacity-40" />
        <div className="container relative grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <span className="badge">Wear the right hat</span>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
              Cybersecurity, intelligence and training for teams that need to move with confidence.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              The Right Hat brings offensive security, defensive operations, professional academy, media and community into one premium cybersecurity brand built for clarity before crisis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">Book a consult</Link>
              <Link href="/academy" className="btn btn-ghost">Explore academy</Link>
            </div>
          </div>
          <div className="card relative overflow-hidden p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,177,95,.22),transparent_36rem)]" />
            <div className="relative grid min-h-[420px] place-items-center rounded-3xl border border-[var(--border)] bg-[#08111f] p-8 text-center">
              <div>
                <div className="mx-auto grid h-32 w-32 place-items-center rounded-[2rem] border border-[var(--border)] bg-white/5 text-4xl font-black text-[var(--gold-soft)] shadow-2xl">TRH</div>
                <h2 className="mt-8 text-3xl font-black">The Right Hat</h2>
                <p className="mx-auto mt-3 max-w-sm text-slate-400">A premium cybersecurity identity for operators, founders and decision makers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container grid gap-4 md:grid-cols-3">
          {stats.map(([value, label]) => (
            <div key={label} className="card p-6">
              <div className="text-4xl font-black text-[var(--gold-soft)]">{value}</div>
              <div className="mt-2 font-bold text-slate-300">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <span className="badge">TRH platform</span>
          <h2 className="mt-5 max-w-3xl text-4xl font-black md:text-5xl">One brand, multiple hats, one operational standard.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {pillars.map(([title, text]) => (
              <article key={title} className="card p-7">
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container card grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <span className="badge">Next step</span>
            <h2 className="mt-5 text-4xl font-black">Ready to turn TRH into a live operation?</h2>
            <p className="mt-4 max-w-2xl text-slate-300">Connect GitHub to Vercel, create Supabase, add the environment variables and the platform becomes deployable with contact storage and future admin features.</p>
          </div>
          <Link href="/contact" className="btn btn-primary">Start project</Link>
        </div>
      </section>
    </main>
  )
}
