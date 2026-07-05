const posts: Record<string, { title: string; body: string }> = {
  'ransomware-readiness': {
    title: 'Ransomware Readiness',
    body: 'A practical executive guide for preparing people, backups, response workflows and communications before the first encrypted server.',
  },
  'threat-detection-basics': {
    title: 'Threat Detection Basics',
    body: 'Useful detections start with adversary behavior, reliable context and response playbooks, not noisy dashboards.',
  },
  'cyber-career-map': {
    title: 'Cyber Career Map',
    body: 'A practical roadmap for juniors and career switchers entering cybersecurity with discipline and clarity.',
  },
}

export default async function MediaPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = posts[slug] || { title: 'TRH Media', body: 'This media article is being prepared for publication.' }

  return (
    <main className="py-20">
      <div className="container max-w-4xl">
        <span className="badge">Media</span>
        <h1 className="mt-5 text-5xl font-black">{post.title}</h1>
        <article className="card mt-10 p-8 text-lg leading-8 text-slate-300">{post.body}</article>
      </div>
    </main>
  )
}
