import Image from 'next/image'
import Link from 'next/link'

const stats = [
  ['SOC-ready', 'Program design'],
  ['24/7', 'Detection & response'],
  ['ISO-ready', 'Aligned programs'],
]

const metrics = [
  ['2,400+', 'Engagements delivered'],
  ['18k', 'Critical findings surfaced'],
  ['9,700', 'Academy graduates'],
  ['< 6 min', 'Mean time to detect'],
]

const capabilities = [
  ['Offensive Security', 'Red teaming, penetration testing, attack-path mapping and executive risk translation.'],
  ['Defensive Operations', 'Detection engineering, SOC maturity, playbooks and response architecture.'],
  ['Threat Intelligence', 'Adversary tracking, field notes and practical intelligence for leaders and operators.'],
  ['GRC & Advisory', 'Risk programs, governance, audit readiness and clear security roadmaps.'],
]

const platform = [
  ['Academy', 'Hands-on courses and labs that turn practitioners into operators.'],
  ['Media', 'Threat research, field notes and analysis from the front line.'],
  ['Community', 'A vetted network of security professionals sharing playbooks and lessons.'],
]

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-[var(--border)] py-24 md:py-32">
        <div className="absolute inset-0 grid-lines opacity-60" aria-hidden />
        <div className="container relative grid gap-12 lg:grid-cols-[1.02fr_.98fr] lg:items-center">
          <div>
            <span className="badge">Wear the right hat</span>
            <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[1.03] tracking-tight text-slate-950 md:text-7xl">
              Elite cybersecurity for the organizations that can&apos;t afford to lose.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
              The Right Hat unites offensive and defensive operations, threat intelligence, a professional academy, media, and a global community — so you can outpace every adversary.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/contact" className="btn btn-primary">Book a consult →</Link>
              <Link href="/academy" className="btn btn-ghost">Explore the Academy</Link>
              <Link href="/signup" className="btn btn-ghost">Create account</Link>
            </div>
            <dl className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-[var(--border)] pt-8">
              {stats.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-lg font-black text-slate-950">{k}</dt>
                  <dd className="mt-1 text-sm text-slate-600">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="card relative overflow-hidden p-3">
            <div className="relative aspect-square overflow-hidden rounded-[22px] bg-white">
              <Image src="/trh-hero-light.svg" alt="TRH cybersecurity emblem" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--border)] bg-white/60">
        <div className="container grid divide-y divide-[var(--border)] md:grid-cols-4 md:divide-x md:divide-y-0">
          {metrics.map(([value, label]) => (
            <div key={label} className="py-10 md:px-8">
              <div className="text-4xl font-black text-slate-950">{value}</div>
              <div className="mt-2 text-slate-600">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <span className="font-mono text-xs uppercase tracking-[.22em] text-[var(--primary)]">Capabilities</span>
          <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">A full-spectrum security partner</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Offense informs defense. We run both — and feed everything we learn back into intelligence, training, and community.</p>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map(([title, text]) => (
              <article key={title} className="card p-7">
                <div className="mb-8 grid h-12 w-12 place-items-center rounded-xl border border-[var(--border)] bg-blue-50 text-[var(--primary)]">✦</div>
                <h3 className="text-xl font-black text-slate-950">{title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white py-24">
        <div className="container">
          <span className="font-mono text-xs uppercase tracking-[.22em] text-[var(--primary)]">The platform</span>
          <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">More than a firm — an ecosystem</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {platform.map(([title, text]) => (
              <article key={title} className="card p-8">
                <div className="mb-8 grid h-14 w-14 place-items-center rounded-xl border border-[var(--border)] bg-blue-50 text-2xl text-[var(--primary)]">⌁</div>
                <h3 className="text-2xl font-black text-slate-950">{title}</h3>
                <p className="mt-5 leading-8 text-slate-600">{text}</p>
                <Link href={`/${title.toLowerCase()}`} className="mt-8 inline-flex font-black text-[var(--primary)]">Open {title} →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 text-center">
        <div className="absolute inset-0 grid-lines opacity-50" aria-hidden />
        <div className="container relative">
          <Image src="/images/trh-logo-header.svg" alt="TRH" width={72} height={44} className="mx-auto h-12 w-auto" />
          <h2 className="mx-auto mt-8 max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Ready to see what your adversaries already see?</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Book a no-pressure consult with our team. We&apos;ll map your risk, recommend a path, and show you exactly where to start.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/contact" className="btn btn-primary">Book a consult →</Link>
            <Link href="/services" className="btn btn-ghost">View all services</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
