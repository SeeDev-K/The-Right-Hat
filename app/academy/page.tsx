import Link from 'next/link'

const tracks = [
  ['SOC Analyst Track', 'soc-analyst-track', 'Triage, SIEM workflows, alert validation, escalation and reporting.'],
  ['Red Team Foundations', 'red-team-foundations', 'Recon, exploitation mindset, privilege escalation and professional reporting.'],
  ['Cloud Security Track', 'cloud-security-track', 'IAM, network boundaries, deployment hardening and monitoring for modern cloud teams.'],
  ['GRC Essentials', 'grc-essentials', 'Policies, controls, risk registers, audit preparation and compliance storytelling.'],
]

export const metadata = { title: 'Academy' }

export default function AcademyPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">TRH Academy</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">Practical cybersecurity learning built like an operator program.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">The academy is designed for professionals who want skills that translate directly into real operational value.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {tracks.map(([title, slug, text]) => (
            <article key={title} className="card p-7">
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{text}</p>
              <Link href={`/academy/${slug}`} className="mt-6 inline-flex text-sm font-black uppercase tracking-[.18em] text-[var(--gold-soft)]">Open track</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
