const services = [
  ['Red Team & Pentest', 'External, internal, web, API and cloud testing with executive-ready risk translation.'],
  ['SOC & Detection', 'Detection engineering, alert logic, response playbooks and operational maturity roadmaps.'],
  ['GRC & Advisory', 'Security governance, policy, audit readiness, vendor risk and board-level reporting.'],
  ['Cloud Security', 'Architecture reviews, IAM hardening, attack surface reduction and secure deployment standards.'],
  ['Incident Readiness', 'Crisis tabletop, response workflow, evidence handling and communication procedures.'],
  ['Cyber Awareness', 'Human-centered awareness programs for employees, managers and executives.'],
]

export const metadata = { title: 'Services' }

export default function ServicesPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Services</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">Cybersecurity services designed for clarity, action and trust.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">TRH turns complex technical risk into concrete business decisions with premium delivery and practical execution.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, text]) => (
            <article key={title} className="card p-7">
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
