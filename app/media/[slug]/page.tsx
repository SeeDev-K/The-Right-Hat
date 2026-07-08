import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

type PublishedMediaItem = {
  id: string
  title: string
  status: string
  created_at?: string
}

const posts: Record<string, { title: string; body: string; points: string[] }> = {
  'crisis-readiness': { title: 'Business Resilience', body: 'A practical guide for preparation, ownership, recovery planning and clear leadership communication.', points: ['Assign owners', 'Test recovery', 'Prepare decisions'] },
  'threat-detection-basics': { title: 'Monitoring Quality', body: 'Useful monitoring starts with relevant signals, business context and a clear operating workflow.', points: ['Map signals', 'Reduce noise', 'Document actions'] },
  'cloud-identity-perimeter': { title: 'Cloud Identity', body: 'Modern cloud posture depends on access design, visibility and disciplined configuration.', points: ['Review access', 'Enable logs', 'Limit exposure'] },
  'soc-modernization': { title: 'Operations Modernization', body: 'Teams improve when workflow, metrics, coaching and reporting are handled as one system.', points: ['Improve triage', 'Track metrics', 'Coach teams'] },
  'red-team-lessons': { title: 'Assessment Lessons', body: 'A strong review connects technical evidence with priorities that leadership can act on.', points: ['Keep scope clear', 'Capture proof', 'Prioritize fixes'] },
  'cyber-career-map': { title: 'Career Map', body: 'A realistic path combines fundamentals, lab practice, writing and consistent discipline.', points: ['Learn basics', 'Build labs', 'Write clearly'] },
}

export const dynamic = 'force-dynamic'

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'media-brief'
}

async function loadPublishedMediaItem(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC_ANON_KEY
  if (!url || !anonKey) return null

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .from('content_items')
    .select('id,title,status,created_at')
    .eq('kind', 'media')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error || !data) return null
  return (data as PublishedMediaItem[]).find((item) => slugify(item.title) === slug) || null
}

export default async function MediaPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dynamicPost = await loadPublishedMediaItem(slug)
  const post = dynamicPost
    ? { title: dynamicPost.title, body: 'This TRH Media item is published from the control center and ready for public reading.', points: ['Executive brief', 'Operational insight', 'Action roadmap'] }
    : posts[slug] || { title: 'TRH Media', body: 'This article is being prepared.', points: ['Coming soon'] }

  return (
    <main className="py-20">
      <div className="container max-w-5xl">
        <Link href="/media" className="text-sm font-black uppercase tracking-[.18em] text-[var(--primary)]">Back to Media</Link>
        <div className="mt-6"><span className="badge">Media</span></div>
        <h1 className="mt-5 text-5xl font-black text-slate-950">{post.title}</h1>
        <article className="card mt-10 p-8 text-lg leading-8 text-slate-600">{post.body}</article>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{post.points.map((item) => <div key={item} className="kpi-card p-5 font-black text-slate-950">{item}</div>)}</div>
      </div>
    </main>
  )
}
