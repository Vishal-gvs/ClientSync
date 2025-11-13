import React, { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

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
  const { auth } = useAuth()
  const userId = auth?.id
  const [stats, setStats] = useState({ clients: 0, projects: 0, openTasks: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    let cancelled = false

    async function loadStats(){
      try {
        const [clientsRes, projectsRes] = await Promise.all([
          api.get(`/clients?userId=${userId}`),
          api.get(`/projects?userId=${userId}`)
        ])

        if (cancelled) return

        const projectList = projectsRes.data ?? []
        const openTasks = projectList.flatMap(project => project.tasks || []).filter(task => !task.done).length

        setStats({
          clients: clientsRes.data?.length ?? 0,
          projects: projectList.length,
          openTasks
        })
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load dashboard stats:', error)
          setStats({ clients: 0, projects: 0, openTasks: 0 })
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    setLoading(true)
    loadStats()

    return () => {
      cancelled = true
    }
  }, [userId])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Here&apos;s how your workspace is tracking right now.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Clients" value={loading ? '…' : stats.clients}>All-time clients</StatCard>
        <StatCard title="Open Tasks" value={loading ? '…' : stats.openTasks}>Tasks not yet complete</StatCard>
        <StatCard title="Total Projects" value={loading ? '…' : stats.projects}>Projects &amp; todos</StatCard>
      </div>
    </div>
  )
}
