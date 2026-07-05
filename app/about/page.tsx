export const metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <main className="py-20">
      <div className="container max-w-4xl">
        <span className="badge">About TRH</span>
        <h1 className="mt-5 text-5xl font-black">The Right Hat is a cybersecurity brand built for decisive people.</h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">TRH exists to help organizations understand risk, prepare for pressure and build security capabilities with a premium, practical and human approach.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="card p-7"><h2 className="text-2xl font-black">Mission</h2><p className="mt-3 text-slate-300">Turn complex cyber risk into clear priorities and measurable action.</p></div>
          <div className="card p-7"><h2 className="text-2xl font-black">Standard</h2><p className="mt-3 text-slate-300">Premium execution, honest communication and operator-grade thinking.</p></div>
        </div>
      </div>
    </main>
  )
}
