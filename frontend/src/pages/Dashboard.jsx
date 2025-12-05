import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { FiRefreshCw } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Custom tooltip component for dark mode support
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="font-medium text-slate-900 dark:text-slate-100">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

export default function Statistics() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    projectsStatus: [],
    tasksByStatus: [],
    totalClients: 0,
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completedProjects: [],
  });

  const loadStats = async () => {
    if (!auth?.id) return;

    try {
      setLoading(true);

      // Fetch real data from json-server
      const [clientsRes, projectsRes] = await Promise.all([
        api.get(`/clients?userId=${auth.id}`),
        api.get(`/projects?userId=${auth.id}`)
      ]);

      const clients = clientsRes.data || [];
      const projects = projectsRes.data || [];

      // Extract all tasks from nested project.tasks
      const allTasks = projects.flatMap((p) => p.tasks || []);

          // ========================
      //   PROJECT STATUS (using done)
      // ========================
      const projectsStatusCount = {
        Completed: 0,
        "In Progress": 0
      };

      projects.forEach((p) => {
        if (p.done) projectsStatusCount["Completed"]++;
        else projectsStatusCount["In Progress"]++;
      });

      const projectsStatus = Object.keys(projectsStatusCount).map((k) => ({
        name: k,
        value: projectsStatusCount[k]
      }));

      // ========================
      //   TASKS
      // ========================
      const tasksStatusCount = {
        Completed: allTasks.filter((t) => t.done).length,
        Pending: allTasks.filter((t) => !t.done).length,
      };

      const tasksByStatus = Object.entries(tasksStatusCount).map(([name, value]) => ({
        name,
        value,
      }));

      // ========================
      //   COMPLETED PROJECTS
      // ========================
      const completedProjects = projects.filter(p => p.done).map(project => {
        const completedTasks = project.tasks?.filter(t => t.done).length || 0;
        const totalTasks = project.tasks?.length || 0;
        
        return {
          id: project.id,
          name: project.name,
          clientName: project.clientName,
          clientId: project.clientId,
          completedTasks,
          totalTasks,
          due: project.due,
          folder: project.folder
        };
      });

      setStats({
        projectsStatus,
        tasksByStatus,
        totalClients: clients.length,
        totalProjects: projects.length,
        totalTasks: allTasks.length,
        completedTasks: tasksStatusCount.Completed,
        pendingTasks: tasksStatusCount.Pending,
        completedProjects
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [auth?.id]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Project Statistics</h1>
        <button
          onClick={loadStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Clients" 
          value={stats.totalClients} 
          icon={() => (
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          color="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
        />

        <StatCard 
          title="Total Projects" 
          value={stats.totalProjects}
          icon={() => (
            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="current://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )}
          color="text-green-600 bg-green-100 dark:bg-green-900/30"
        />

        <StatCard 
          title="Completed Tasks" 
          value={stats.completedTasks}
          icon={() => (
            <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          color="text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
        />

        <StatCard 
          title="Pending Tasks" 
          value={stats.pendingTasks}
          icon={() => (
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          color="text-amber-600 bg-amber-100 dark:bg-amber-900/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Projects by Status */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Projects by Status</h2>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Total: {stats.totalProjects}
            </div>
          </div>
          
          <div className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.projectsStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.projectsStatus.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Tasks Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Tasks Overview</h2>
          <div className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Completed', value: stats.completedTasks },
                  { name: 'Pending', value: stats.pendingTasks }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Tasks" radius={[4, 4, 0, 0]} activeBar={false}>
                    <Cell fill="#4ade80" />
                    <Cell fill="#f59e0b" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Completed Projects Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
        <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Completed Projects ({stats.completedProjects.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : stats.completedProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 dark:text-slate-500 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-500 dark:text-slate-400">No completed projects yet</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Tasks Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {stats.completedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {project.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {project.clientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {project.folder}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm text-slate-600 dark:text-slate-300 mr-2">
                          {project.completedTasks}/{project.totalTasks}
                        </div>
                        <div className="w-16 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${project.totalTasks > 0 ? (project.completedTasks / project.totalTasks) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {project.due ? new Date(project.due).toLocaleDateString() : 'No due date'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
