'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

type AdminTheme = 'dark' | 'light'

const navigation = [
  ['Dashboard', '/admin', '01'],
  ['Contacts CRM', '/admin/contacts', '02'],
  ['Academy CMS', '/admin/academy', '03'],
  ['Media CMS', '/admin/media', '04'],
  ['Community', '/admin/community', '05'],
  ['Members', '/admin/members', '06'],
  ['API Center', '/admin/apis', '07'],
  ['Team Access', '/admin/team', '08'],
  ['Library', '/admin/library', '09'],
  ['Activity', '/admin/activity', '10'],
  ['Security', '/admin/security', '11'],
  ['Settings', '/admin/settings', '12'],
] as const

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [theme, setTheme] = useState<AdminTheme>('dark')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('staff')
  const [mobileOpen, setMobileOpen] = useState(false)

  const isPrivateEntry = pathname?.startsWith('/admin/login')
  const initials = useMemo(() => (email || 'TRH').split('@')[0].split(/[._-]/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(), [email])

  useEffect(() => {
    const saved = window.localStorage.getItem('trh-admin-theme')
    if (saved === 'light' || saved === 'dark') setTheme(saved)

    async function loadIdentity() {
      const supabase = await createBrowserSupabaseClient()
      if (!supabase) return
      const { data } = await supabase.auth.getUser()
      setEmail(data.user?.email || '')
      const roleResult = await supabase.rpc('current_admin_role')
      if (roleResult.data) setRole(String(roleResult.data))
    }

    loadIdentity()
  }, [])

  function switchTheme() {
    const next: AdminTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    window.localStorage.setItem('trh-admin-theme', next)
  }

  async function signOut() {
    const supabase = await createBrowserSupabaseClient()
    if (supabase) await supabase.auth.signOut()
    router.replace('/trh-staff/access')
  }

  function isActive(href: string) {
    return href === '/admin' ? pathname === href : pathname?.startsWith(href)
  }

  if (isPrivateEntry) return <>{children}</>

  return (
    <div className="trh-admin" data-theme={theme}>
      <div className="trh-admin__ambient" aria-hidden="true" />
      <div className="trh-admin__layout">
        <aside className={mobileOpen ? 'trh-admin__sidebar is-open' : 'trh-admin__sidebar'}>
          <div className="trh-admin__brand">
            <div className="trh-admin__brand-mark">TRH</div>
            <div><p>THE RIGHT HAT</p><span>Control Center</span></div>
          </div>

          <nav className="trh-admin__nav" aria-label="Control Center navigation">
            {navigation.map(([label, href, index]) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)} className={isActive(href) ? 'trh-admin__nav-link is-active' : 'trh-admin__nav-link'}>
                <span className="trh-admin__nav-index">{index}</span>
                <span>{label}</span>
                <i aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div className="trh-admin__identity">
            <div className="trh-admin__avatar">{initials}</div>
            <div className="min-w-0 flex-1"><p>{email || 'Loading identity...'}</p><span>{role}</span></div>
          </div>

          <div className="trh-admin__sidebar-actions">
            <button type="button" onClick={switchTheme}>{theme === 'dark' ? 'Light interface' : 'Dark interface'}</button>
            <button type="button" onClick={signOut}>Sign out</button>
          </div>
        </aside>

        {mobileOpen && <button type="button" aria-label="Close navigation" className="trh-admin__backdrop" onClick={() => setMobileOpen(false)} />}

        <div className="trh-admin__workspace">
          <header className="trh-admin__topbar">
            <button type="button" className="trh-admin__menu" onClick={() => setMobileOpen((value) => !value)} aria-label="Toggle navigation">Menu</button>
            <div className="trh-admin__posture"><span /> Protected staff workspace</div>
            <div className="trh-admin__top-actions">
              <Link href="/">Public website</Link>
              <button type="button" onClick={switchTheme}>{theme === 'dark' ? 'Light' : 'Dark'}</button>
            </div>
          </header>
          <div className="trh-admin__content">{children}</div>
        </div>
      </div>
    </div>
  )
}
