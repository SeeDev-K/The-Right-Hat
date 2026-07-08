import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

type PublishedMediaItem = {
  id: string
  title: string
  status: string
  slug?: string | null
  summary?: string | null
  created_at?: string
}

const fallbackArticles = [
  { title: 'Crisis readiness', slug: 'crisis-readiness', image: '/assets/trh/articles/article-detection-engineering.png', text: 'How leaders prepare teams, roles and communication before disruption.' },
  { title: 'Detection engineering', slug: 'threat-detection-basics', image: '/assets/trh/articles/article-detection-engineering.png', text: 'How to design useful alerts around behavior, context and response ownership.' },
  { title: 'Cloud identity', slug: 'cloud-identity-perimeter', image: '/assets/trh/articles/article-cloud-identity.png', text: 'Why identity, permissions and logging define the modern security boundary.' },
  { title: 'SOC modernization', slug: 'soc-modernization', image: '/assets/trh/articles/article-soc-modernization.png', text: 'Improving analyst workflow, alert quality, metrics and escalation.' },
  { title: 'Assessment lessons', slug: 'red-team-lessons', image: '/assets/trh/articles/article-red-team-lessons.png', text: 'Field lessons from validation, reporting discipline and remediation follow-up.' },
  { title: 'Cyber career map', slug: 'cyber-career-map', image: '/assets/trh/articles/article-cyber-career.png', text: 'A realistic roadmap for juniors entering security operations and advisory roles.' },
]

export const metadata = { title: 'Media' }
export const dynamic = 'force-dynamic'

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'media-brief'
}

async function loadPublishedMediaItems() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC_ANON_KEY
  if (!url || !anonKey) return []

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .from('content_items')
    .select('id,title,status,slug,summary,created_at')
    .eq('kind', 'media')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as PublishedMediaItem[]
}

export default async function MediaPage() {
  const publishedItems = await loadPublishedMediaItems()
  const articles = publishedItems.length
    ? publishedItems.map((item, index) => ({
        title: item.title,
        slug: item.slug || slugify(item.title),
        image: fallbackArticles[index % fallbackArticles.length].image,
        text: item.summary || 'Published TRH Media item prepared from the control center and ready for public reading.',
      }))
    : fallbackArticles

  return (
    <main className="py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><span className="badge">TRH Media</span><h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950 md:text-6xl">Cybersecurity media with operational value.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">TRH Media publishes field notes, explainers and executive briefs written to help teams understand risk and act with confidence.</p></div>
          <div className="card overflow-hidden p-3"><div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-blue-50"><Image src="/assets/trh/sections/media-main.png" alt="TRH Media" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /></div></div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => <article key={article.title} className="card overflow-hidden"><div className="relative h-56 bg-blue-50"><Image src={article.image} alt={article.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" /></div><div className="p-7"><h2 className="text-2xl font-black text-slate-950">{article.title}</h2><p className="mt-3 leading-7 text-slate-600">{article.text}</p><Link href={`/media/${article.slug}`} className="mt-6 inline-flex text-sm font-black uppercase tracking-[.18em] text-[var(--primary)]">Read article</Link></div></article>)}
        </div>
      </div>
    </main>
  )
}
