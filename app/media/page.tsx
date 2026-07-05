import Link from 'next/link'

const articles = [
  ['Ransomware readiness', 'ransomware-readiness', 'How leaders can prepare before the first encrypted server.'],
  ['Threat detection basics', 'threat-detection-basics', 'Why useful detections start with behavior, not noise.'],
  ['Cyber career map', 'cyber-career-map', 'A practical roadmap for juniors entering cybersecurity.'],
]

export const metadata = { title: 'Media' }

export default function MediaPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">TRH Media</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">Cybersecurity media with signal, not noise.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Research notes, explainers, field lessons and awareness content for founders, teams and practitioners.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {articles.map(([title, slug, text]) => (
            <article key={title} className="card p-7">
              <div className="mb-6 h-36 rounded-3xl border border-[var(--border)] bg-[linear-gradient(135deg,rgba(214,177,95,.22),rgba(56,189,248,.12))]" />
              <h2 className="text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{text}</p>
              <Link href={`/media/${slug}`} className="mt-6 inline-flex text-sm font-black uppercase tracking-[.18em] text-[var(--gold-soft)]">Read article</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
