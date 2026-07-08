import { AdminModuleGuard } from '@/components/admin/AdminModuleGuard'
import { SimpleCommunityModerationBoard } from '@/components/admin/SimpleCommunityModerationBoard'

export default function AdminCommunityPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] p-5 text-slate-950 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="text-sm font-black text-blue-600">← Control Center</a>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[.22em] text-blue-600">Community moderation</p>
            <h1 className="mt-3 text-5xl font-black tracking-[-.06em] text-slate-950">Community Control</h1>
            <p className="mt-3 max-w-2xl text-slate-500">Moderate member posts, replies and community visibility.</p>
          </div>
        </div>
        <div className="mt-8"><AdminModuleGuard module="community"><SimpleCommunityModerationBoard /></AdminModuleGuard></div>
      </div>
    </main>
  )
}
