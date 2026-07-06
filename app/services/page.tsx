import Image from 'next/image'

const services = [
  ['Security Assessment', '/assets/trh/sections/service-offensive-security.png', 'Structured reviews of applications, infrastructure, cloud assets and operational exposure with clear remediation priorities.'],
  ['Detection Engineering', '/assets/trh/sections/service-defensive-operations.png', 'Alert quality, SIEM logic, response workflows, SOC maturity and practical playbooks for internal teams.'],
  ['Threat Intelligence', '/assets/trh/sections/service-threat-intelligence.png', 'Executive and operational briefs that explain adversary behavior, sector risk, signals to monitor and actions to take.'],
  ['Cloud Security', '/assets/trh/sections/service-cloud-security.png', 'Cloud posture, identity controls, logging, segmentation, storage exposure and secure deployment recommendations.'],
  ['Incident Readiness', '/assets/trh/sections/service-incident-response.png', 'Crisis preparation, tabletop exercises, response roles, evidence handling and recovery coordination.'],
  ['GRC & Advisory', '/assets/trh/sections/service-grc-advisory.png', 'Security governance, policies, audit readiness, vendor risk and board-level reporting for decision makers.'],
]

export const metadata = { title: 'Services' }

export default function ServicesPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Services</span>
        <h1 className="mt-5 max-w-4xl text-5xl font-black text-slate-950 md:text-6xl">Cybersecurity services designed for clarity, action and trust.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">TRH turns complex technical risk into concrete decisions. Every engagement delivers technical evidence, executive context and a practical roadmap.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, image, text]) => (
            <article key={title} className="card overflow-hidden">
              <div className="relative h-56 bg-blue-50"><Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" /></div>
              <div className="p-7"><h2 className="text-2xl font-black text-slate-950">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
