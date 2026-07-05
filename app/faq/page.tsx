const faqs = [
  ['Can I create an account?', 'Yes. Use /signup to create a Supabase Auth user, then /login to authenticate.'],
  ['Why can I login but not open admin?', 'Admin access requires your Supabase user ID to be added to admin_profiles with role owner or admin.'],
  ['Where do contact requests go?', 'The contact form stores requests in the Supabase contact_requests table.'],
  ['Is this production ready?', 'The foundation is deployable. The next phase should add CMS CRUD, email notifications, rate limiting and audit logs.'],
]

export default function FAQPage() {
  return (
    <main className="py-20">
      <div className="container max-w-4xl">
        <span className="badge">FAQ</span>
        <h1 className="mt-5 text-5xl font-black">Frequently asked questions.</h1>
        <div className="mt-10 grid gap-5">
          {faqs.map(([question, answer]) => (
            <article key={question} className="card p-7">
              <h2 className="text-2xl font-black">{question}</h2>
              <p className="mt-3 leading-7 text-slate-300">{answer}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
