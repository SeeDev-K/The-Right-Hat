const lessons: Record<string, { title: string; body: string[] }> = {
  'soc-analyst-track': {
    title: 'SOC Analyst Track',
    body: ['Alert triage and validation', 'SIEM investigation workflow', 'Escalation and reporting', 'Detection quality mindset'],
  },
  'red-team-foundations': {
    title: 'Red Team Foundations',
    body: ['Reconnaissance methodology', 'Attack path thinking', 'Privilege escalation basics', 'Professional reporting'],
  },
  'cloud-security-track': {
    title: 'Cloud Security Track',
    body: ['IAM review', 'Network boundaries', 'Deployment hardening', 'Cloud monitoring'],
  },
}

export default async function AcademyLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = lessons[slug] || { title: 'TRH Academy Track', body: ['This academy track is being prepared for publication.'] }

  return (
    <main className="py-20">
      <div className="container max-w-4xl">
        <span className="badge">Academy</span>
        <h1 className="mt-5 text-5xl font-black">{lesson.title}</h1>
        <div className="mt-10 grid gap-4">
          {lesson.body.map((item) => <div key={item} className="card p-6 font-bold text-slate-300">{item}</div>)}
        </div>
      </div>
    </main>
  )
}
