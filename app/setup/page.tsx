import Link from 'next/link'

const checks = [
  ['1', 'Create account', 'Open /signup and create your first TRH user with email and password.'],
  ['2', 'Confirm user', 'If Supabase email confirmation is enabled, confirm the account from your inbox.'],
  ['3', 'Make admin', 'Copy the user UUID from Supabase Auth and insert it into admin_profiles as owner.'],
  ['4', 'Login', 'Open /login and authenticate with the same email and password.'],
  ['5', 'Open account', 'Open /account to confirm the session is active.'],
  ['6', 'Open admin', 'Open /admin and verify the contact CRM loads.'],
]

export default function SetupPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Setup</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">TRH launch checklist.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Use this page after connecting Supabase, Vercel and GitHub to verify the authentication and admin flow.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {checks.map(([step, title, text]) => (
            <article key={step} className="card p-7">
              <span className="badge">Step {step}</span>
              <h2 className="mt-5 text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-300">{text}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/signup" className="btn btn-primary">Create account</Link>
          <Link href="/login" className="btn btn-ghost">Login</Link>
          <Link href="/account" className="btn btn-ghost">Account</Link>
          <Link href="/admin" className="btn btn-ghost">Admin</Link>
        </div>
      </div>
    </main>
  )
}
