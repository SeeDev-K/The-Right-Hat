import Image from 'next/image'

const services = [
  ['Red Team & Pentest', '/assets/trh/sections/service-offensive-security.png', 'External, internal, web, API and cloud testing with executive-ready risk translation.'],
  ['SOC & Detection', '/assets/trh/sections/service-defensive-operations.png', 'Detection engineering, alert logic, response playbooks and operational maturity roadmaps.'],
  ['GRC & Advisory', '/assets/trh/sections/service-grc-advisory.png', 'Security governance, policy, audit readiness, vendor risk and board-level reporting.'],
  ['Cloud Security', '/assets/trh/sections/service-cloud-security.png', 'Architecture reviews, IAM hardening, attack surface reduction and secure deployment standards.'],
  ['Incident Readiness', '/assets/trh/sections/service-incident-response.png', 'Crisis tabletop, response workflow, evidence handling and communication procedures.'],
  ['Threat Intelligence', '/assets/trh/sections/service-threat-intelligence.png', 'Adversary tracking, operational context and intelligence reports for decision makers.'],
]

export const metadata = { title: 'Services' }

export default function ServicesPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Services</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">Cybersecurity services designed for clarity, action and trust.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">TRH turns complex technical risk into concrete business decisions with premium delivery and practical execution.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, image, text]) => (
            <article key={title} className="card overflow-hidden">
              <div className="relative h-48 bg-blue-50">
                <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-7">
                <h2 className="text-2xl font-black text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
