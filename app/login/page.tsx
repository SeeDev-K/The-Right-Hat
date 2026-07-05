import Link from 'next/link'

export const metadata = { title: 'Login' }

export default function LoginPage() {
  return (
    <main className="py-20">
      <div className="container max-w-lg">
        <span className="badge">Login</span>
        <h1 className="mt-5 text-4xl font-black">Access TRH admin.</h1>
        <div className="card mt-8 grid gap-5 p-7">
          <label>Email<input type="email" placeholder="admin@trh.ma" /></label>
          <label>Password<input type="password" placeholder="••••••••" /></label>
          <button className="btn btn-primary">Login preview</button>
          <p className="text-sm text-slate-400">Supabase Auth will be connected in the next dev phase.</p>
          <Link href="/signup" className="text-[var(--gold-soft)]">Create an account</Link>
        </div>
      </div>
    </main>
  )
}
