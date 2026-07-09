import { AdminModuleGuard } from '@/components/admin/AdminModuleGuard'

export default function AdminLibraryPage() {
  return (
    <main className="min-h-screen bg-[#070b12] p-5 text-white lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-cyan-300">← Control Center</a>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Library</h1>
        <p className="mt-3 text-slate-400">Review items and usage notes.</p>
        <div className="mt-8"><AdminModuleGuard module="library"><div className="rounded-[32px] border border-white/10 bg-white/[.05] p-7"><h2 className="text-2xl font-black">Operational library</h2><p className="mt-3 text-slate-400">Internal documents, review notes and knowledge assets will be managed from this protected module.</p></div></AdminModuleGuard></div>
      </div>
    </main>
  )
}
