import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

type PublishedTrack = {
  id: string
  title: string
  status: string
  created_at?: string
}

const lessons: Record<string, { title: string; intro: string; body: string[] }> = {
  'soc-analyst-track': {
    title: 'SOC Analyst Track',
    intro: 'Learn how to qualify alerts, build investigation notes and communicate findings clearly.',
    body: ['Triage method', 'Log review workflow', 'Escalation notes', 'Case summary template'],
  },
  'red-team-foundations': {
    title: 'Security Assessment Track',
    intro: 'Build a professional assessment mindset: scope, evidence, validation and reporting.',
    body: ['Scoping basics', 'Asset review', 'Evidence handling', 'Executive report structure'],
  },
  'cloud-security-track': {
    title: 'Cloud Security Track',
    intro: 'Understand cloud identity, exposure, logging and secure operating patterns.',
    body: ['Identity review', 'Storage exposure', 'Network boundaries', 'Logging baseline'],
  },
  'grc-essentials': {
    title: 'GRC Essentials',
    intro: 'Translate controls, risk and audit needs into clear business language.',
    body: ['Risk register', 'Policy structure', 'Control mapping', 'Leadership reporting'],
  },
}

export const dynamic = 'force-dynamic'

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'academy-track'
}

async function loadPublishedTrack(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLIC_ANON_KEY
  if (!url || !anonKey) return null

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .from('content_items')
    .select('id,title,status,created_at')
    .eq('kind', 'academy')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error || !data) return null
  return (data as PublishedTrack[]).find((track) => slugify(track.title) === slug) || null
}

export default async function AcademyLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dynamicTrack = await loadPublishedTrack(slug)
  const lesson = dynamicTrack
    ? {
        title: dynamicTrack.title,
        intro: 'This TRH Academy track is published from the control center and ready for public discovery.',
        body: ['Program overview', 'Operational objectives', 'Practice labs', 'Certification roadmap'],
      }
    : lessons[slug] || { title: 'TRH Academy Track', intro: 'This track is being prepared.', body: ['Program coming soon'] }

  return (
    <main className="py-20">
      <div className="container max-w-5xl">
        <Link href="/academy" className="text-sm font-black uppercase tracking-[.18em] text-[var(--primary)]">Back to Academy</Link>
        <div className="mt-6"><span className="badge">Academy</span></div>
        <h1 className="mt-5 text-5xl font-black text-slate-950">{lesson.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{lesson.intro}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {lesson.body.map((item) => <div key={item} className="card p-6 font-bold text-slate-950">{item}</div>)}
        </div>
      </div>
    </main>
  )
}
