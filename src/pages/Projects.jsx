import React, { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const DEFAULT_FOLDERS = ['Sales','Marketing','Tech','Product']

function FolderChip({name, active, onClick}){
  return (
    <button onClick={()=>onClick(name)} className={'px-3 py-1 rounded-full text-sm transition-colors ' + (active ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10')}>
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
    try { return JSON.parse(f) } catch(e){ return DEFAULT_FOLDERS }
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

  function saveProjects(arr){
    setProjects(arr); localStorage.setItem('cs:projects', JSON.stringify(arr))
  }

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Projects & TODOs</h1>

      <section className="mb-6">
        <div className="flex gap-3 items-center mb-3">
          {folders.map(f=> <FolderChip key={f} name={f} active={f===selected} onClick={setSelected} />)}
        </div>

        <form onSubmit={addFolder} className="flex gap-2 mb-3">
          <input placeholder="New folder name" value={newFolder} onChange={e=>setNewFolder(e.target.value)} className="px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          <button className="px-3 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">Add Folder</button>
        </form>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Add Project (to folder: <span className="font-bold">{selected}</span>)</h2>
          <form onSubmit={addProject} className="space-y-2 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <input placeholder="Project title" value={title} onChange={e=>setTitle(e.target.value)} className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            <select value={clientId} onChange={e=>setClientId(e.target.value)} className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Select Client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="w-full px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"></textarea>
            <input type="date" value={due} onChange={e=>setDue(e.target.value)} className="px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">Add Project</button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Quick tips</h2>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-400">
            Create folders to separate different workstreams (Sales, Marketing, Tech...). Add due dates and break projects into tasks directly inside each project card.
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-100">Projects in "{selected}"</h2>
        <div className="space-y-3">
          {projects.filter(p=>p.folder===selected).length===0 && <div className="text-slate-600 dark:text-slate-400">No projects in this folder yet.</div>}
          {projects.filter(p=>p.folder===selected).map(p=>(
            <div key={p.id} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg text-slate-900 dark:text-slate-100">{p.name} <span className="text-sm text-slate-600 dark:text-slate-400">({(clients.find(c=>c.id===Number(p.clientId))?.name) || p.clientName || 'No client'})</span></div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{p.description}</div>
                  <div className="text-sm mt-2 text-slate-700 dark:text-slate-300">Due: {p.due || '—'}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={()=>toggle(p.id)} className={'px-3 py-1 rounded-md transition-colors ' + (p.done ? 'bg-green-100 dark:bg-green-600/30 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10')}>{p.done ? 'Completed' : 'Mark Done'}</button>
                  <button onClick={()=>del(p.id)} className="px-3 py-1 rounded-md bg-red-50 dark:bg-red-600/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600/30 transition-colors">Delete</button>
                </div>
              </div>

              <div className="mt-3">
                <AddTaskForm projectId={p.id} onAdd={addTask} />
                <div className="mt-3 space-y-2">
                  {(p.tasks||[]).map(t=>(
                    <div key={t.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-md">
                      <input type="checkbox" checked={t.done} onChange={()=>toggleTask(p.id, t.id)} className="text-indigo-500" />
                      <div className={'flex-1 text-slate-700 dark:text-slate-300 ' + (t.done ? 'line-through text-slate-400 dark:text-slate-500' : '')}>{t.text}</div>
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
    <form onSubmit={(e)=>{e.preventDefault(); onAdd(projectId, text); setText('')}} className="flex gap-2">
      <input placeholder="Add task" value={text} onChange={e=>setText(e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      <button className="px-3 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">Add</button>
    </form>
  )
}
