import { AdminModuleGuard } from '@/components/admin/AdminModuleGuard'
import { AdminContactsClient } from '@/components/auth/AdminContactsClient'

export default function AdminContactsPage() {
  return (
    <AdminModuleGuard module="crm">
      <AdminContactsClient />
    </AdminModuleGuard>
  )
}
