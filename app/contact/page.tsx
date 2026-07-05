import { ContactForm } from '@/components/ContactForm'

export const metadata = { title: 'Contact' }

export default function ContactPage() {
  return (
    <main className="py-20">
      <div className="container grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
        <div>
          <span className="badge">Contact</span>
          <h1 className="mt-5 text-5xl font-black">Let TRH wear the right hat for your next move.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">Use this form for consulting, training, incident readiness, media partnerships or community opportunities.</p>
          <div className="mt-8 grid gap-3 text-slate-300">
            <p><strong className="text-white">Email:</strong> me@trh.ma</p>
            <p><strong className="text-white">Base:</strong> Casablanca, Morocco</p>
            <p><strong className="text-white">Scope:</strong> Cybersecurity, Academy, Media, Community</p>
          </div>
        </div>
        <ContactForm />
      </div>
    </main>
  )
}
