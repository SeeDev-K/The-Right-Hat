import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'TRH — The Right Hat | Cybersecurity, Academy & Intelligence',
    template: '%s | TRH — The Right Hat',
  },
  description:
    'The Right Hat is a premium cybersecurity, academy, media and community platform for teams that need clarity before crisis.',
  icons: { icon: '/assets/trh/logos/favicon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f8fbff' }

const nav = [
  ['Services', '/services'],
  ['Academy', '/academy'],
  ['Media', '/media'],
  ['Community', '/community'],
  ['About', '/about'],
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-xl">
          <div className="container flex min-h-20 items-center justify-between gap-5 py-4">
            <Link href="/" className="inline-flex items-center" aria-label="TRH home">
              <Image src="/assets/trh/logos/trh-logo-header.png" alt="TRH — The Right Hat" width={210} height={78} priority className="h-12 w-auto object-contain" />
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-bold text-slate-600 lg:flex">
              {nav.map(([label, href]) => <Link key={href} href={href} className="hover:text-[var(--primary)]">{label}</Link>)}
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden px-4 py-2 text-sm font-black text-slate-800 md:inline-flex">Sign in</Link>
              <Link href="/signup" className="btn btn-ghost hidden md:inline-flex">Sign up</Link>
              <Link href="/contact" className="btn btn-primary">Book a consult</Link>
            </div>
          </div>
        </header>
        {children}
        <footer className="border-t border-[var(--border)] bg-white py-14 text-sm text-slate-600">
          <div className="container grid gap-10 md:grid-cols-[1.3fr_2fr]">
            <div>
              <Image src="/assets/trh/logos/trh-logo-footer.png" alt="TRH — The Right Hat" width={210} height={78} className="h-12 w-auto object-contain" />
              <p className="mt-5 max-w-sm leading-7">Elite cybersecurity, media, community, and academy — arming organizations and practitioners to wear the right hat.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <div><h3 className="font-mono text-xs uppercase tracking-widest text-slate-500">Platform</h3><div className="mt-4 grid gap-3"><Link href="/academy">Academy</Link><Link href="/media">Media</Link><Link href="/community">Community</Link></div></div>
              <div><h3 className="font-mono text-xs uppercase tracking-widest text-slate-500">Company</h3><div className="mt-4 grid gap-3"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/setup">Setup</Link></div></div>
              <div><h3 className="font-mono text-xs uppercase tracking-widest text-slate-500">Account</h3><div className="mt-4 grid gap-3"><Link href="/signup">Sign up</Link><Link href="/login">Sign in</Link><Link href="/account">Account</Link><Link href="/admin">Admin</Link></div></div>
            </div>
          </div>
        </footer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
