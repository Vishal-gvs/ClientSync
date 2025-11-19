import React, { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const DEFAULT_FOLDERS = ['Sales','Marketing','Tech','Product']

function FolderChip({name, active, onClick}){
  return (
    <button
      onClick={()=>onClick(name)}
      className={'rounded-full px-3 py-1.5 text-sm font-medium transition-colors ' + (active ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10')}
    >
      {name}
    </button>
  )
}

export default function Projects(){
  const { auth } = useAuth()
  const userId = auth ? auth.id : null

  const [folders, setFolders] = useState(() => {
    const f = localStorage.getItem('cs:folders')
    if (!f) {
      localStorage.setItem('cs:folders', JSON.stringify(DEFAULT_FOLDERS))
      return DEFAULT_FOLDERS
    }
    try { return JSON.parse(f) } catch { return DEFAULT_FOLDERS }
  })

  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [selected, setSelected] = useState(() => {
    const f = localStorage.getItem('cs:folders')
    const parsed = f ? JSON.parse(f) : DEFAULT_FOLDERS
    return parsed[0]
  })

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [due, setDue] = useState('')
  const [clientId, setClientId] = useState('')
  const [newFolder, setNewFolder] = useState('')

  useEffect(()=>{
    if (!userId) return
    api.get(`/projects?userId=${userId}`).then(res=>setProjects(res.data)).catch(()=>{})
    api.get(`/clients?userId=${userId}`).then(res=>setClients(res.data)).catch(()=>{})
  },[userId])

  async function addFolder(e){
    e.preventDefault()
    if (!newFolder) return
    const nxt = [newFolder, ...folders]
    setFolders(nxt)
    localStorage.setItem('cs:folders', JSON.stringify(nxt))
    setNewFolder('')
    setSelected(newFolder)
  }

  async function addProject(e){
    e.preventDefault()
    if (!title) return
    const client = clients.find(c => String(c.id) === String(clientId))
    const payload = { userId, name: title, description: desc, due, folder: selected, done: false, clientId: client ? client.id : null, clientName: client ? client.name : null, tasks: [] }
    const res = await api.post('/projects', payload)
    setProjects(prev=>[res.data, ...prev])
    setTitle(''); setDesc(''); setDue(''); setClientId('')
  }

  async function toggle(id){
    const proj = projects.find(p=>p.id===id)
    if (!proj) return
    const res = await api.patch(`/projects/${id}`, { done: !proj.done })
    setProjects(prev=>prev.map(p=>p.id===id?res.data:p))
  }

  async function del(id){
    await api.delete(`/projects/${id}`)
    setProjects(prev=>prev.filter(p=>p.id!==id))
  }

  async function addTask(projectId, text){
    if (!text) return
    const proj = projects.find(p=>p.id===projectId)
    const t = { id: crypto.randomUUID(), text, done: false, due: null }
    const updated = { tasks: [t, ...(proj.tasks||[])] }
    const res = await api.patch(`/projects/${projectId}`, updated)
    setProjects(prev=>prev.map(p=>p.id===projectId?res.data:p))
  }

  async function toggleTask(projectId, taskId){
    const proj = projects.find(p=>p.id===projectId)
    const updatedTasks = proj.tasks.map(t=> t.id===taskId ? {...t, done: !t.done} : t)
    const res = await api.patch(`/projects/${projectId}`, { tasks: updatedTasks })
    setProjects(prev=>prev.map(p=>p.id===projectId?res.data:p))
  }

  const filteredProjects = projects.filter(p=>p.folder===selected)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Projects &amp; TODOs</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Organize workstreams, track due dates, and break projects into actionable tasks.</p>
      </div>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {folders.map(f=> <FolderChip key={f} name={f} active={f===selected} onClick={setSelected} />)}
        </div>

        <form onSubmit={addFolder} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input placeholder="New folder name" value={newFolder} onChange={e=>setNewFolder(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400 sm:max-w-xs" />
          <button className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600">
            Add folder
          </button>
        </form>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Add Project (folder: <span className="text-indigo-500 dark:text-indigo-300">{selected}</span>)</h2>
          <form onSubmit={addProject} className="space-y-3">
            <input placeholder="Project title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
            <select value={clientId} onChange={e=>setClientId(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="min-h-[92px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"></textarea>
            <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
            <button className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 sm:w-auto">
              Add project
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick tips</h2>
          <p className="mt-3">
            Create folders to separate different workstreams. Add due dates and break projects into tasks directly inside each project card to keep momentum high.
          </p>
          <p className="mt-2">Invite teammates to collaborate by sharing progress updates in task lists and marking items as complete in real time.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Projects in &ldquo;{selected}&rdquo;</h2>
        <div className="space-y-3">
          {filteredProjects.length===0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              No projects in this folder yet.
            </div>
          )}
          {filteredProjects.map(p=>(
            <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {p.name}{' '}
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      ({(clients.find(c=>c.id===Number(p.clientId))?.name) || p.clientName || 'No client'})
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.description || 'No description yet.'}</div>
                  <div className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Due: {p.due || '—'}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={()=>toggle(p.id)}
                    className={'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors ' + (p.done ? 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/30' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10')}
                  >
                    {p.done ? 'Completed' : 'Mark done'}
                  </button>
                  <button
                    onClick={()=>del(p.id)}
                    className="inline-flex items-center justify-center rounded-md bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/20 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <AddTaskForm projectId={p.id} onAdd={addTask} />
                <div className="space-y-2">
                  {(p.tasks||[]).map(t=>(
                    <div key={t.id} className="flex flex-col gap-2 rounded-md bg-slate-50 p-3 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                      <label className="flex flex-1 items-center gap-3">
                        <input type="checkbox" checked={t.done} onChange={()=>toggleTask(p.id, t.id)} className="h-4 w-4 text-indigo-500 focus:ring-indigo-500" />
                        <span className={'text-sm text-slate-700 dark:text-slate-300 ' + (t.done ? 'line-through text-slate-400 dark:text-slate-500' : '')}>{t.text}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function AddTaskForm({projectId, onAdd}){
  const [text, setText] = useState('')
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onAdd(projectId, text); setText('')}} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input placeholder="Add task" value={text} onChange={e=>setText(e.target.value)} className="w-full flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400" />
      <button className="inline-flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 sm:w-auto">
        Add
      </button>
    </form>
  )
}
