import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

type PublishedTrack = {
  id: string
  title: string
  status: string
  created_at?: string
}

const fallbackTracks = [
  { title: 'SOC Analyst Track', slug: 'soc-analyst-track', image: '/assets/trh/sections/academy-soc-analyst.png', text: 'Alert triage, investigation workflow, reporting discipline, escalation logic and analyst mindset.' },
  { title: 'Security Assessment Track', slug: 'red-team-foundations', image: '/assets/trh/sections/academy-red-team.png', text: 'Methodology, scoping, evidence collection, reporting quality and responsible validation.' },
  { title: 'Cloud Security Track', slug: 'cloud-security-track', image: '/assets/trh/sections/academy-cloud-security.png', text: 'Identity, storage, network exposure, logging, secure architecture and cloud governance.' },
  { title: 'GRC Essentials', slug: 'grc-essentials', image: '/assets/trh/sections/academy-grc.png', text: 'Risk registers, policies, controls, audit preparation and executive security communication.' },
]

const outcomes = ['Operational labs', 'Templates and playbooks', 'Executive reporting', 'Career roadmap']

export const metadata = { title: 'Academy' }
export const dynamic = 'force-dynamic'

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'academy-track'
}

async function loadPublishedTracks() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC_ANON_KEY
  if (!url || !anonKey) return []

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .from('content_items')
    .select('id,title,status,created_at')
    .eq('kind', 'academy')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as PublishedTrack[]
}

export default async function AcademyPage() {
  const publishedTracks = await loadPublishedTracks()
  const tracks = publishedTracks.length
    ? publishedTracks.map((track, index) => ({
        title: track.title,
        slug: slugify(track.title),
        image: fallbackTracks[index % fallbackTracks.length].image,
        text: 'Published TRH Academy track prepared from the control center and ready for public discovery.',
      }))
    : fallbackTracks

  return (
    <main className="py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><span className="badge">TRH Academy</span><h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950 md:text-6xl">Cybersecurity learning built for real operational work.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">TRH Academy trains people to think, investigate, communicate and execute like professionals. Courses focus on practical outcomes, not theory alone.</p></div>
          <div className="card overflow-hidden p-3"><div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-blue-50"><Image src="/assets/trh/sections/academy-main.png" alt="TRH Academy" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /></div></div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">{outcomes.map((o) => <div key={o} className="kpi-card p-5 font-black text-slate-950">{o}</div>)}</div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {tracks.map((track) => <article key={track.title} className="card overflow-hidden"><div className="relative h-56 bg-blue-50"><Image src={track.image} alt={track.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" /></div><div className="p-7"><h2 className="text-2xl font-black text-slate-950">{track.title}</h2><p className="mt-3 leading-7 text-slate-600">{track.text}</p><Link href={`/academy/${track.slug}`} className="mt-6 inline-flex text-sm font-black uppercase tracking-[.18em] text-[var(--primary)]">Open track</Link></div></article>)}
        </div>
      </div>
    </main>
  )
}
