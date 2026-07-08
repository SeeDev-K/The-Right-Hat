import Link from 'next/link'

export const metadata = {
  title: 'Access restricted',
  robots: { index: false, follow: false },
}

export default function AccessRestrictedPage() {
  return (
    <main className="min-h-screen bg-[#070b12] px-5 py-20 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center">
        <section className="rounded-[36px] border border-white/10 bg-white/[.06] p-8 shadow-2xl shadow-blue-950/30 backdrop-blur-xl md:p-12">
          <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.22em] text-cyan-200">Restricted access</span>
          <h1 className="mt-7 text-5xl font-black tracking-[-.06em] text-white md:text-6xl">This area is private.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">The TRH Control Center is reserved for approved The Right Hat owners and employees. Public members, clients and community users should use the member account area.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950">Member sign in</Link>
            <Link href="/" className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-black text-slate-200 hover:bg-white/5">Return to website</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
