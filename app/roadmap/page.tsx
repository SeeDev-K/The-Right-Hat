const phases = [
  ['Phase 1', 'Brand platform', 'Public pages, visual identity, services, academy, media and community positioning.'],
  ['Phase 2', 'Access layer', 'Member signup, login, account page, admin login and protected contact CRM.'],
  ['Phase 3', 'Content control', 'Admin editing for academy tracks, media posts, pages and community programs.'],
  ['Phase 4', 'Growth system', 'SEO, analytics, notifications, workflows, reporting and governance improvements.'],
]

export default function RoadmapPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Roadmap</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">The Right Hat product roadmap.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">The platform is moving from brand foundation to operational tooling, content control and growth infrastructure.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {phases.map(([phase, title, text]) => <article key={phase} className="card p-7"><span className="badge">{phase}</span><h2 className="mt-5 text-2xl font-black text-slate-950">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}
        </div>
      </div>
    </main>
  )
}
