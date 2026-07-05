const items = [
  ['Companies', 'Advisory, audits, training and incident readiness for operational teams.'],
  ['Schools', 'Academy programs, workshops and career guidance for future cybersecurity talent.'],
  ['Communities', 'Awareness campaigns, events and local cyber culture initiatives.'],
]

export default function CollaborationsPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Collaborations</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">Build with TRH.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">The Right Hat can collaborate with organizations, academies, communities and media teams around practical cybersecurity impact.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map(([title, text]) => (
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
