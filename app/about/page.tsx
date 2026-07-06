export const metadata = { title: 'About' }

const principles = [
  ['Clarity', 'Every mission must produce decisions, not confusion.'],
  ['Discipline', 'Security work needs structure, evidence and accountability.'],
  ['Impact', 'Technical findings only matter when they improve business resilience.'],
  ['Trust', 'We communicate with honesty, confidentiality and professional care.'],
]

export default function AboutPage() {
  return (
    <main className="py-20">
      <div className="container max-w-5xl">
        <span className="badge">About TRH</span>
        <h1 className="mt-5 max-w-4xl text-5xl font-black text-slate-950 md:text-6xl">The Right Hat is built for organizations that need security with judgment.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">TRH helps leaders and technical teams understand risk, improve readiness and build capabilities that survive real pressure. We combine advisory, engineering, training, media and community into one trusted ecosystem.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="card p-7"><h2 className="text-2xl font-black text-slate-950">Mission</h2><p className="mt-3 text-slate-600">Turn complex security challenges into clear priorities, practical action and measurable progress.</p></div>
          <div className="card p-7"><h2 className="text-2xl font-black text-slate-950">Standard</h2><p className="mt-3 text-slate-600">Premium execution, sober communication, strong documentation and operator-grade thinking.</p></div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">{principles.map(([title, text]) => <div key={title} className="kpi-card p-5"><h3 className="font-black text-slate-950">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div>
      </div>
    </main>
  )
}
