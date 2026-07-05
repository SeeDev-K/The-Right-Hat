export const metadata = { title: 'Admin Preview' }

const modules = ['Contacts CRM', 'Academy CMS', 'Media CMS', 'Community Members', 'Security Settings', 'Analytics']

export default function AdminPage() {
  return (
    <main className="py-20">
      <div className="container">
        <span className="badge">Admin preview</span>
        <h1 className="mt-5 max-w-3xl text-5xl font-black">TRH control center foundation.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">This preview reserves the future operational modules. The next phase is to connect Supabase Auth, roles and real CRUD screens.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => <div key={module} className="card p-6 font-black">{module}</div>)}
        </div>
      </div>
    </main>
  )
}
