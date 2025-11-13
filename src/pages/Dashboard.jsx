import React from 'react'

function StatCard({title, value, children}){
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</div>
      <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
      <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">{children}</div>
    </div>
  )
}

export default function Dashboard(){
  const totalClients = JSON.parse(localStorage.getItem('cs:clients') || '[]').length
  const totalProjects = JSON.parse(localStorage.getItem('cs:projects') || '[]').length
  const pending = JSON.parse(localStorage.getItem('cs:projects') || '[]').flatMap(p=>p.tasks || []).filter(t=>!t.done).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Here&apos;s how your workspace is tracking right now.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Clients" value={totalClients}>All-time clients</StatCard>
        <StatCard title="Open Tasks" value={pending}>Tasks not yet complete</StatCard>
        <StatCard title="Total Projects" value={totalProjects}>Projects &amp; todos</StatCard>
      </div>
    </div>
  )
}
