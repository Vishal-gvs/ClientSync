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
    <div>
      <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Clients</h1>

      <form onSubmit={addClient} className="flex gap-2 mb-4">
        <input placeholder="Client name" value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent flex-1" />
        <input placeholder="Email (optional)" value={email} onChange={e=>setEmail(e.target.value)} className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64" />
        <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">Add</button>
      </form>

      <div className="space-y-3">
        {clients.length === 0 && <div className="text-slate-600 dark:text-slate-400">No clients yet — add one.</div>}
        {clients.map(c => (
          <div key={c.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{c.email}</div>
              </div>

              <button onClick={()=> del(c.id)} className="text-sm px-3 py-1 rounded-md bg-red-50 dark:bg-red-600/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600/30 transition-colors">Delete</button>
            </div>

            <div className="mt-2 text-sm">
              {/* project status */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
