const assets = [
  ['Ransomware visual', 'article-ransomware-attack.png', 'Used in Media'],
  ['Detection visual', 'article-detection-engineering.png', 'Used in Media'],
  ['Academy main', 'academy-main.png', 'Used in Academy'],
  ['Admin login background', 'admin-login-bg.png', 'Used in Admin'],
]

export default function AdminMediaPage() {
  return (
    <main className="min-h-screen bg-[#070b12] p-5 text-white lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-cyan-300">← Control Center</a>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Media CMS</h1>
        <p className="mt-3 text-slate-400">Track media files, alt text, usage and publication safety before deletion.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">{assets.map(([title, file, usage]) => <article key={file} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6"><h2 className="text-2xl font-black">{title}</h2><p className="mt-2 font-mono text-sm text-slate-500">{file}</p><p className="mt-4 text-slate-400">{usage}</p><span className="mt-5 inline-flex rounded-full bg-amber-400/10 px-3 py-1 text-xs font-black text-amber-200">Alt text required</span></article>)}</div>
      </div>
    </main>
  )
}
