import Image from 'next/image'

const items = [
  ['Private circles', '/assets/trh/sections/community-members.png', 'Curated groups for cyber professionals, founders and decision makers.'],
  ['Events & briefings', '/assets/trh/sections/community-events.png', 'Roundtables, practical workshops and executive cyber briefings.'],
  ['Network intelligence', '/assets/trh/sections/community-network.png', 'A trusted professional network sharing playbooks, tooling and lessons every day.'],
]

export const metadata = { title: 'Community' }

export default function CommunityPage() {
  return (
    <main className="py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <span className="badge">Community</span>
            <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">A cybersecurity network built around trust and practical value.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">TRH Community is the human layer of the brand: knowledge exchange, mentorship, events and opportunity.</p>
          </div>
          <div className="card overflow-hidden p-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-blue-50">
              <Image src="/assets/trh/sections/community-main.png" alt="TRH Community" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(([title, image, text]) => (
            <article key={title} className="card overflow-hidden">
              <div className="relative h-52 bg-blue-50">
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
