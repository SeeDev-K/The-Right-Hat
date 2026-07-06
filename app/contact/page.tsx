import { ContactForm } from '@/components/ContactForm'

export const metadata = { title: 'Contact' }

const routes = ['Security advisory', 'Training request', 'Media inquiry', 'Community partnership']

export default function ContactPage() {
  return (
    <main className="py-20">
      <div className="container grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div>
          <span className="badge">Contact</span>
          <h1 className="mt-5 text-5xl font-black text-slate-950 md:text-6xl">Start with context. We will help you choose the right next move.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">Use this form for advisory, security reviews, training programs, incident readiness, media partnerships or community opportunities.</p>
          <div className="mt-8 grid gap-3 text-slate-600"><p><strong className="text-slate-950">Email:</strong> me@trh.ma</p><p><strong className="text-slate-950">Base:</strong> Casablanca, Morocco</p><p><strong className="text-slate-950">Scope:</strong> Cybersecurity, Academy, Media, Community</p></div>
          <div className="mt-8 grid gap-3">{routes.map((r) => <div key={r} className="kpi-card p-4 font-black text-slate-950">{r}</div>)}</div>
        </div>
        <ContactForm />
      </div>
    </main>
  )
}
