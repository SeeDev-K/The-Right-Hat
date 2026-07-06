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

export default async function AcademyLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = lessons[slug] || { title: 'TRH Academy Track', intro: 'This track is being prepared.', body: ['Program coming soon'] }

  return (
    <main className="py-20">
      <div className="container max-w-5xl">
        <span className="badge">Academy</span>
        <h1 className="mt-5 text-5xl font-black text-slate-950">{lesson.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{lesson.intro}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {lesson.body.map((item) => <div key={item} className="card p-6 font-bold text-slate-950">{item}</div>)}
        </div>
      </div>
    </main>
  )
}
