const posts: Record<string, { title: string; body: string; points: string[] }> = {
  'ransomware-readiness': { title: 'Business Resilience', body: 'A practical guide for preparation, ownership, recovery planning and clear leadership communication.', points: ['Assign owners', 'Test recovery', 'Prepare decisions'] },
  'threat-detection-basics': { title: 'Monitoring Quality', body: 'Useful monitoring starts with relevant signals, business context and a clear operating workflow.', points: ['Map signals', 'Reduce noise', 'Document actions'] },
  'cloud-identity-perimeter': { title: 'Cloud Identity', body: 'Modern cloud posture depends on access design, visibility and disciplined configuration.', points: ['Review access', 'Enable logs', 'Limit exposure'] },
  'soc-modernization': { title: 'Operations Modernization', body: 'Teams improve when workflow, metrics, coaching and reporting are handled as one system.', points: ['Improve triage', 'Track metrics', 'Coach teams'] },
  'red-team-lessons': { title: 'Assessment Lessons', body: 'A strong review connects technical evidence with priorities that leadership can act on.', points: ['Keep scope clear', 'Capture proof', 'Prioritize fixes'] },
  'cyber-career-map': { title: 'Career Map', body: 'A realistic path combines fundamentals, lab practice, writing and consistent discipline.', points: ['Learn basics', 'Build labs', 'Write clearly'] },
}

export default async function MediaPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug] || { title: 'TRH Media', body: 'This article is being prepared.', points: ['Coming soon'] }
  return (
    <main className="py-20">
      <div className="container max-w-5xl">
        <span className="badge">Media</span>
        <h1 className="mt-5 text-5xl font-black text-slate-950">{post.title}</h1>
        <article className="card mt-10 p-8 text-lg leading-8 text-slate-600">{post.body}</article>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{post.points.map((item) => <div key={item} className="kpi-card p-5 font-black text-slate-950">{item}</div>)}</div>
      </div>
    </main>
  )
}
