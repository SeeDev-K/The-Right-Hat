'use client'

import { useState } from 'react'

const base = ['Hero visual', 'Article visual', 'Academy visual', 'Login visual']

export function SimpleAssetBoard() {
  const [items, setItems] = useState(base)
  const [name, setName] = useState('')
  function add() {
    if (!name.trim()) return
    setItems([name.trim(), ...items])
    setName('')
  }
  return (
    <div className="mt-8 grid gap-4">
      <div className="rounded-[28px] border border-white/10 bg-white/[.05] p-5"><div className="grid gap-3 md:grid-cols-[1fr_160px]"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Asset name" className="border-white/10 bg-black/20 text-white placeholder:text-slate-500" /><button onClick={add} className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950">Add</button></div></div>
      <div className="grid gap-4 md:grid-cols-2">{items.map((item) => <article key={item} className="rounded-[28px] border border-white/10 bg-white/[.05] p-6"><h2 className="text-xl font-black">{item}</h2><p className="mt-3 text-slate-400">Usage and accessibility review required.</p></article>)}</div>
    </div>
  )
}
