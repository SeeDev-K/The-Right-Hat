import type { Metadata, Viewport } from 'next'
import { SiteChrome } from '../components/layout/SiteChrome'
import './globals.css'

export const metadata: Metadata = {
  title: 'TRH — The Right Hat',
  description: 'Premium cybersecurity platform.',
  icons: { icon: '/assets/trh/logos/favicon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f8fbff' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><SiteChrome>{children}</SiteChrome></body></html>
}
