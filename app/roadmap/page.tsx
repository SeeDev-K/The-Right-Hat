const phases = [
  ['Phase 1', 'Public platform', 'Homepage, services, academy, media, community, contact and brand foundation.'],
  ['Phase 2', 'Auth and admin CRM', 'Signup, login, account, protected admin and Supabase contact requests.'],
  ['Phase 3', 'CMS', 'Admin CRUD for academy tracks, media posts and community members.'],
  ['Phase 4', 'Operations', 'Email notifications, analytics, audit logs, RBAC and production SEO.'],
]

export default function RoadmapPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Roadmap</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">The Right Hat development roadmap.</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {phases.map(([phase, title, text]) => (
            <article key={phase} className="card p-7">
              <span className="badge">{phase}</span>
              <h2 className="mt-5 text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
