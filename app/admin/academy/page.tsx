import { AdminModuleGuard } from '@/components/admin/AdminModuleGuard'
import { SimpleAcademyBoard } from '@/components/admin/SimpleAcademyBoard'

export default function AdminAcademyPage() {
  return (
    <main className="min-h-screen bg-[#070b12] p-5 text-white lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-cyan-300">← Control Center</a>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Academy CMS</h1>
        <p className="mt-3 text-slate-400">Manage learning tracks, status and publication readiness.</p>
        <div className="mt-8"><AdminModuleGuard module="academy"><SimpleAcademyBoard /></AdminModuleGuard></div>
      </div>
    </main>
  )
}
