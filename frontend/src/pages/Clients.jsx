import React, { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { toast } from 'react-hot-toast'

function isEmail(v){
  if (!v) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Clients(){
  const { auth } = useAuth()
  const userId = auth ? auth.id : null

  const [clients, setClients] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [query, setQuery] = useState('')
  const [editingClientId, setEditingClientId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')

  useEffect(()=> {
    if (!userId) return
    api.get(`/clients?userId=${userId}`).then(res => setClients(res.data)).catch(()=>{
      toast.error('Failed to load clients')
    })
  },[userId])

  async function addClient(e){
    e.preventDefault()
    const nextErrors = {}
    if (!name.trim()) nextErrors.name = 'Client name is required.'
    if (!isEmail(email)) nextErrors.email = 'Please enter a valid email address.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    try{
      const payload = { userId, name: name.trim(), email: email.trim() }
      const res = await api.post('/clients', payload)
      setClients(prev=>[res.data, ...prev])
      setName(''); setEmail('')
      toast.success('Client added')
    } catch {
      toast.error('Could not add client')
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(c){
    setEditingClientId(c.id)
    setEditName(c.name || '')
    setEditEmail(c.email || '')
  }

  async function saveEdit(id){
    const nextErrors = {}
    if (!editName.trim()) nextErrors.editName = 'Client name is required.'
    if (!isEmail(editEmail)) nextErrors.editEmail = 'Please enter a valid email address.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try{
      const payload = { name: editName.trim(), email: editEmail.trim() }
      const res = await api.patch(`/clients/${id}`, payload)
      setClients(prev => prev.map(c => c.id === id ? res.data : c))
      setEditingClientId(null); setEditName(''); setEditEmail('')
      toast.success('Client updated')
    } catch {
      toast.error('Could not update client')
    }
  }

  async function del(id){
    try{
      await api.delete(`/clients/${id}`)
      setClients(prev=>prev.filter(c=>c.id!==id))
      toast.success('Client removed')
    } catch {
      toast.error('Failed to remove client')
    }
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
          <input placeholder="Client name" value={name} onChange={e=>setName(e.target.value)} className={`input ${errors.name ? 'ring-2 ring-red-500' : ''}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-err' : undefined} />
          {errors.name && <p id="name-err" className="error-text">{errors.name}</p>}
        </div>
        <div className="w-full sm:w-64">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email (optional)</label>
          <input placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} className={`input ${errors.email ? 'ring-2 ring-red-500' : ''}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
          {errors.email && <p id="email-err" className="error-text">{errors.email}</p>}
        </div>
        <button disabled={submitting} className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? 'Adding…' : 'Add client'}</button>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <input
            placeholder="Search clients (name or email)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 sm:max-w-sm"
          />
        </div>
        {clients.filter(c=>{
          const q = query.trim().toLowerCase();
          if (!q) return true;
          return (c.name||'').toLowerCase().includes(q) || (c.email||'').toLowerCase().includes(q);
        }).length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">No matching clients.</div>
        )}
        {clients.filter(c=>{
          const q = query.trim().toLowerCase();
          if (!q) return true;
          return (c.name||'').toLowerCase().includes(q) || (c.email||'').toLowerCase().includes(q);
        }).map(c => (
          <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {editingClientId === c.id ? (
                  <>
                    <div className="text-sm">
                      <input value={editName} onChange={e=>setEditName(e.target.value)} className={`input mt-1 ${errors.editName ? 'ring-2 ring-red-500' : ''}`} placeholder="Client name" />
                      {errors.editName && <p className="error-text">{errors.editName}</p>}
                    </div>
                    <div className="text-sm mt-2">
                      <input value={editEmail} onChange={e=>setEditEmail(e.target.value)} className={`input mt-1 ${errors.editEmail ? 'ring-2 ring-red-500' : ''}`} placeholder="Email" />
                      {errors.editEmail && <p className="error-text">{errors.editEmail}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{c.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{c.email || 'No email provided'}</div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                {editingClientId === c.id ? (
                  <>
                    <button onClick={()=> saveEdit(c.id)} className="inline-flex items-center justify-center rounded-md bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 transition hover:bg-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:hover:bg-emerald-500/25">Save</button>
                    <button onClick={()=> { setEditingClientId(null); setEditName(''); setEditEmail(''); }} className="inline-flex items-center justify-center rounded-md bg-slate-500/10 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-500/20 dark:bg-slate-500/15 dark:text-slate-300 dark:hover:bg-slate-500/25">Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={()=> startEdit(c)} className="inline-flex items-center justify-center rounded-md bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500/25">Edit</button>
                    <button onClick={()=> del(c.id)} className="inline-flex items-center justify-center rounded-md bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/20 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25">Delete</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
