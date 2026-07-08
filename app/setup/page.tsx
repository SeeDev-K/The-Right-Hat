import Link from 'next/link'

const checks = [
  ['1', 'Environment', 'Verify Supabase and Vercel variables are present in production.'],
  ['2', 'Member access', 'Create a normal public account and test login, account, community and sign out.'],
  ['3', 'TRH staff access', 'Approved owners and employees use the private staff access route shared internally only.'],
  ['4', 'Community', 'Create a member profile, publish a post and verify moderation from the staff console.'],
  ['5', 'CRM test', 'Submit the contact form and verify it appears in the staff control center.'],
  ['6', 'Review pages', 'Check services, academy, media, community and contact on desktop and mobile.'],
]

export default function SetupPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Setup</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">TRH launch checklist.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Use this operational checklist to validate the public platform before presenting it.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {checks.map(([step, title, text]) => <article key={step} className="card p-7"><span className="badge">Step {step}</span><h2 className="mt-5 text-2xl font-black text-slate-950">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}
        </div>
        <div className="mt-10 flex flex-wrap gap-3"><Link href="/signup" className="btn btn-primary">Create member account</Link><Link href="/login" className="btn btn-ghost">Member login</Link><Link href="/account" className="btn btn-ghost">Member account</Link><Link href="/community" className="btn btn-ghost">Community</Link></div>
      </div>
    </main>
  )
}
