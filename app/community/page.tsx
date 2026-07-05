const items = [
  ['Private circles', 'Curated groups for cyber professionals, founders and decision makers.'],
  ['Events & briefings', 'Roundtables, practical workshops and executive cyber briefings.'],
  ['Mentorship', 'Guidance paths for juniors, career switchers and future operators.'],
]

export const metadata = { title: 'Community' }

export default function CommunityPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Community</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">A cybersecurity network built around trust and practical value.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">TRH Community is the human layer of the brand: knowledge exchange, mentorship, events and opportunity.</p>
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
