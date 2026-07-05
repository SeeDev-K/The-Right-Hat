'use client'

import { FormEvent, useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      setStatus('success')
      setMessage('Request received. TRH will get back to you soon.')
      form.reset()
      return
    }

    setStatus('error')
    setMessage('Something went wrong. Please verify the fields and try again.')
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-5 p-6 md:p-8">
      <label>Name<input name="name" required minLength={2} placeholder="Your name" /></label>
      <label>Email<input name="email" type="email" required placeholder="you@company.com" /></label>
      <label>Company<input name="company" placeholder="Company / organization" /></label>
      <label>Message<textarea name="message" required minLength={10} rows={6} placeholder="Tell us what you need..." /></label>
      <button disabled={status === 'loading'} className="btn btn-primary" type="submit">
        {status === 'loading' ? 'Sending...' : 'Send request'}
      </button>
      {message && <p className={status === 'success' ? 'text-emerald-300' : 'text-red-300'}>{message}</p>}
    </form>
  )
}
