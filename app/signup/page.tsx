export const metadata = { title: 'Signup' }

export default function SignupPage() {
  return (
    <main className="py-20">
      <div className="container max-w-lg">
        <span className="badge">Signup</span>
        <h1 className="mt-5 text-4xl font-black">Request TRH access.</h1>
        <div className="card mt-8 grid gap-5 p-7">
          <label>Name<input placeholder="Full name" /></label>
          <label>Email<input type="email" placeholder="you@company.com" /></label>
          <label>Role<input placeholder="Founder, analyst, student..." /></label>
          <button className="btn btn-primary">Request access preview</button>
          <p className="text-sm text-slate-400">Access approval and roles will be powered by Supabase in the next phase.</p>
        </div>
      </div>
    </main>
  )
}
