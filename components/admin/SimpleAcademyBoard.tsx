'use client'

import { useState } from 'react'

const base = ['SOC Analyst Track', 'Security Assessment Track', 'Cloud Security Track', 'GRC Essentials']

export function SimpleAcademyBoard() {
  const [items, setItems] = useState(base)
  const [title, setTitle] = useState('')
  function add() {
    if (!title.trim()) return
    setItems([title.trim(), ...items])
    setTitle('')
  }
  return (
    <div className="mt-8 grid gap-4">
      <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-5"><div className="grid gap-3 md:grid-cols-[1fr_160px]"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Track title" className="border-white/10 bg-black/20 text-white placeholder:text-slate-500" /><button onClick={add} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950">Add</button></div></div>
      {items.map((item) => <article key={item} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6"><h2 className="text-2xl font-black">{item}</h2><p className="mt-3 text-slate-400">Content item ready for review.</p></article>)}
    </div>
  )
}
