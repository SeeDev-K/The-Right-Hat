import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'TRH — The Right Hat | Cybersecurity, Academy & Intelligence',
    template: '%s | TRH — The Right Hat',
  },
  description:
    'The Right Hat is a premium cybersecurity, academy, media and community platform for teams that need clarity before crisis.',
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = { colorScheme: 'dark', themeColor: '#050816' }

const nav = [
  ['Services', '/services'],
  ['Academy', '/academy'],
  ['Media', '/media'],
  ['Community', '/community'],
  ['Contact', '/contact'],
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[#050816]/90 backdrop-blur-xl">
          <div className="container flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
              <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[var(--border)] bg-white/5 text-[var(--gold-soft)]">TRH</span>
              <span className="leading-tight"><span className="block text-lg">The Right Hat</span><span className="block text-xs font-bold uppercase tracking-[.22em] text-slate-400">Cyber · Academy · Intel</span></span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-bold text-slate-300 md:flex">
              {nav.map(([label, href]) => <Link key={href} href={href} className="hover:text-[var(--gold-soft)]">{label}</Link>)}
            </nav>
            <Link href="/contact" className="btn btn-primary hidden md:inline-flex">Book consult</Link>
          </div>
        </header>
        {children}
        <footer className="border-t border-[var(--border)] py-10 text-sm text-slate-400">
          <div className="container grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div><strong className="block text-base text-white">TRH — The Right Hat</strong><span>Premium cybersecurity, training, intelligence and community operations.</span></div>
            <div className="flex flex-wrap gap-4"><Link href="/privacy">Privacy</Link><Link href="/tos">Legal</Link><Link href="/security">Security</Link><Link href="/admin">Admin</Link></div>
          </div>
        </footer>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
