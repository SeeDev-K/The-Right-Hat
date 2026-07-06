import Link from 'next/link'

const checks = [
  ['1', 'Environment', 'Verify Supabase and Vercel variables are present in production.'],
  ['2', 'User access', 'Create a normal account and test login, account and sign out.'],
  ['3', 'Admin role', 'Add the approved UUID to admin_profiles with the owner or admin role.'],
  ['4', 'Staff login', 'Use /admin/login for staff authentication and /admin for the console.'],
  ['5', 'CRM test', 'Submit the contact form and verify it appears in the admin area.'],
  ['6', 'Review pages', 'Check services, academy, media, community and contact on desktop and mobile.'],
]

export default function SetupPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Setup</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black text-slate-950">TRH launch checklist.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Use this operational checklist to validate the platform before presenting it publicly.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {checks.map(([step, title, text]) => <article key={step} className="card p-7"><span className="badge">Step {step}</span><h2 className="mt-5 text-2xl font-black text-slate-950">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></article>)}
        </div>
        <div className="mt-10 flex flex-wrap gap-3"><Link href="/signup" className="btn btn-primary">Create account</Link><Link href="/login" className="btn btn-ghost">Login</Link><Link href="/account" className="btn btn-ghost">Account</Link><Link href="/admin/login" className="btn btn-ghost">Admin login</Link></div>
      </div>
    </main>
  )
}
