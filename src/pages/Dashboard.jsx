import React from 'react'

function StatCard({title, value, children}){
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
      <div className="text-sm text-slate-600 dark:text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="mt-3 text-slate-600 dark:text-slate-400 text-sm">{children}</div>
    </div>
  )
}

export default function Dashboard(){
  const clients = JSON.parse(localStorage.getItem('cs:auth') ? '[]' : '[]') // placeholder
  const projects = []
  const totalClients = JSON.parse(localStorage.getItem('cs:clients') || '[]').length
  const totalProjects = JSON.parse(localStorage.getItem('cs:projects') || '[]').length
  const pending = JSON.parse(localStorage.getItem('cs:projects') || '[]').flatMap(p=>p.tasks || []).filter(t=>!t.done).length

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Welcome back</h1>

      <div className="grid grid-cols-3 gap-6">
        <StatCard title="Total Clients" value={totalClients}>All-time clients</StatCard>
        <StatCard title="Open Tasks" value={pending}>Tasks not yet complete</StatCard>
        <StatCard title="Total Projects" value={totalProjects}>Projects & todos</StatCard>
      </div>
    </div>
  )
}
