import { AdminModuleGuard } from '@/components/admin/AdminModuleGuard'
import { SimpleMediaBoard } from '@/components/admin/SimpleMediaBoard'

export default function AdminMediaPage() {
  return (
    <main className="min-h-screen bg-[#070b12] p-5 text-white lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-cyan-300">← Control Center</a>
        <h1 className="mt-4 text-5xl font-black tracking-[-.06em]">Media CMS</h1>
        <p className="mt-3 text-slate-400">Create, review and publish media items for the public TRH Media page.</p>
        <div className="mt-8"><AdminModuleGuard module="media"><SimpleMediaBoard /></AdminModuleGuard></div>
      </div>
    </main>
  )
}
