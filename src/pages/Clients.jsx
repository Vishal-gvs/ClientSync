import React, { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Clients(){
  const { auth } = useAuth()
  const userId = auth ? auth.id : null

  const [clients, setClients] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(()=> {
    if (!userId) return
    api.get(`/clients?userId=${userId}`).then(res => setClients(res.data)).catch(()=>{})
  },[userId])

  async function addClient(e){
    e.preventDefault()
    if (!name) return
    const payload = { userId, name, email }
    const res = await api.post('/clients', payload)
    setClients(prev=>[res.data, ...prev])
    setName(''); setEmail('')
  }

  async function del(id){
    await api.delete(`/clients/${id}`)
    setClients(prev=>prev.filter(c=>c.id!==id))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Clients</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Create new client records and keep their details within reach.</p>
      </div>

      <form onSubmit={addClient} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:gap-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Client name</label>
          <input placeholder="Client name" value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
        </div>
        <div className="w-full sm:w-64">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email (optional)</label>
          <input placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
        </div>
        <button className="w-full rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600 sm:w-auto">Add client</button>
      </form>

      <div className="space-y-3">
        {clients.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">No clients yet — add one above.</div>}
        {clients.map(c => (
          <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{c.email || 'No email provided'}</div>
              </div>

              <button onClick={()=> del(c.id)} className="inline-flex items-center justify-center rounded-md bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/20 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
