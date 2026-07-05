import Image from 'next/image'
import Link from 'next/link'

const articles = [
  ['Ransomware readiness', 'ransomware-readiness', '/assets/trh/articles/article-ransomware-attack.png', 'How leaders can prepare before the first encrypted server.'],
  ['Threat detection basics', 'threat-detection-basics', '/assets/trh/articles/article-detection-engineering.png', 'Why useful detections start with behavior, not noise.'],
  ['Cloud identity perimeter', 'cloud-identity-perimeter', '/assets/trh/articles/article-cloud-identity.png', 'Why identity is now the most important cloud security boundary.'],
  ['SOC modernization', 'soc-modernization', '/assets/trh/articles/article-soc-modernization.png', 'Modernize detection, response, reporting and continuous improvement.'],
  ['Red team lessons', 'red-team-lessons', '/assets/trh/articles/article-red-team-lessons.png', 'What practical adversary simulation teaches security teams.'],
  ['Cyber career map', 'cyber-career-map', '/assets/trh/articles/article-cyber-career.png', 'A practical roadmap for juniors entering cybersecurity.'],
]

export const metadata = { title: 'Media' }

export default function MediaPage() {
  return (
    <main className="py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div>
            <span className="badge">TRH Media</span>
            <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">Cybersecurity media with signal, not noise.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Research notes, explainers, field lessons and awareness content for founders, teams and practitioners.</p>
          </div>
          <div className="card overflow-hidden p-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[20px] bg-blue-50">
              <Image src="/assets/trh/sections/media-main.png" alt="TRH Media" fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(([title, slug, image, text]) => (
            <article key={title} className="card overflow-hidden">
              <div className="relative h-52 bg-blue-50">
                <Image src={image} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-7">
                <h2 className="text-2xl font-black text-slate-950">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
                <Link href={`/media/${slug}`} className="mt-6 inline-flex text-sm font-black uppercase tracking-[.18em] text-[var(--primary)]">Read article</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
