import Image from 'next/image'
import Link from 'next/link'

const tracks = [
  ['SOC Analyst Track', 'soc-analyst-track', '/assets/trh/sections/academy-soc-analyst.png', 'Triage, SIEM workflows, alert validation, escalation and reporting.'],
  ['Red Team Foundations', 'red-team-foundations', '/assets/trh/sections/academy-red-team.png', 'Recon, exploitation mindset, privilege escalation and professional reporting.'],
  ['Cloud Security Track', 'cloud-security-track', '/assets/trh/sections/academy-cloud-security.png', 'IAM, network boundaries, deployment hardening and monitoring for modern cloud teams.'],
  ['GRC Essentials', 'grc-essentials', '/assets/trh/sections/academy-grc.png', 'Policies, controls, risk registers, audit preparation and compliance storytelling.'],
]

export const metadata = { title: 'Academy' }

export default function AcademyPage() {
  return (
    <main className="py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <span className="badge">TRH Academy</span>
            <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">Practical cybersecurity learning built like an operator program.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">The academy is designed for professionals who want skills that translate directly into real operational value.</p>
          </div>
          <div className="card overflow-hidden p-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-blue-50">
              <Image src="/assets/trh/sections/academy-main.png" alt="TRH Academy" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {tracks.map(([title, slug, image, text]) => (
            <article key={title} className="card overflow-hidden">
              <div className="relative h-56 bg-blue-50">
                <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="p-7">
                <h2 className="text-2xl font-black text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
                <Link href={`/academy/${slug}`} className="mt-6 inline-flex text-sm font-black uppercase tracking-[.18em] text-[var(--primary)]">Open track</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
