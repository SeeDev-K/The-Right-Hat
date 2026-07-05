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
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="container flex min-h-24 items-center justify-between gap-6 py-3">
            <Link href="/" className="inline-flex shrink-0 items-center" aria-label="TRH home">
              <span className="relative block h-16 w-[300px] overflow-hidden md:h-[76px] md:w-[360px] lg:h-20 lg:w-[390px]">
                <Image src="/assets/trh/logos/trh-logo-light-bg.png" alt="TRH — The Right Hat" width={666} height={375} priority className="absolute left-0 top-1/2 w-[300px] max-w-none -translate-y-1/2 object-contain md:w-[360px] lg:w-[390px]" />
              </span>
            </Link>
            <nav className="hidden items-center gap-8 text-[15px] font-semibold text-slate-600 xl:flex">
              {nav.map(([label, href]) => <Link key={href} href={href} className="transition hover:text-[var(--primary)]">{label}</Link>)}
            </nav>
            <div className="flex shrink-0 items-center gap-3">
              <Link href="/login" className="hidden px-4 py-2 text-[15px] font-extrabold text-slate-950 md:inline-flex">Sign in</Link>
              <Link href="/signup" className="btn btn-ghost hidden md:inline-flex">Sign up</Link>
              <Link href="/contact" className="btn btn-primary px-6 py-3 text-[15px] md:px-7">Book a consult</Link>
            </div>
          </div>
        </header>
        {children}
        <footer className="border-t border-slate-200 bg-slate-50 py-16 text-sm text-slate-600">
          <div className="container grid gap-12 md:grid-cols-[1.3fr_2fr]">
            <div>
              <span className="relative block h-20 w-[360px] max-w-full overflow-hidden md:h-24 md:w-[460px]">
                <Image src="/assets/trh/logos/trh-logo-light-bg.png" alt="TRH — The Right Hat" width={666} height={375} className="absolute left-0 top-1/2 w-[360px] max-w-none -translate-y-1/2 object-contain md:w-[460px]" />
              </span>
              <p className="mt-5 max-w-md text-[16px] leading-8 text-slate-600">Elite cybersecurity, media, community, and academy — arming organizations and practitioners to wear the right hat.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-3">
              <div><h3 className="text-xs font-black uppercase tracking-[.24em] text-slate-500">Platform</h3><div className="mt-5 grid gap-3 text-[16px]"><Link href="/academy">Academy</Link><Link href="/media">Media</Link><Link href="/community">Community</Link></div></div>
              <div><h3 className="text-xs font-black uppercase tracking-[.24em] text-slate-500">Company</h3><div className="mt-5 grid gap-3 text-[16px]"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/setup">Setup</Link></div></div>
              <div><h3 className="text-xs font-black uppercase tracking-[.24em] text-slate-500">Account</h3><div className="mt-5 grid gap-3 text-[16px]"><Link href="/signup">Sign up</Link><Link href="/login">Sign in</Link><Link href="/account">Account</Link><Link href="/admin">Admin</Link></div></div>
            </div>
          </div>
        </footer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
