import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/ThemeProvider.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const NavItem = ({to, children}) => (
  <NavLink to={to} className={({isActive}) => 
    'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 ' + (isActive ? 'bg-indigo-100 dark:bg-indigo-600/20 border-l-4 border-indigo-500 dark:border-indigo-400 text-indigo-700 dark:text-indigo-300' : 'hover:bg-slate-100 dark:hover:bg-white/5')}>
    {children}
  </NavLink>
)

export default function Sidebar(){
  const {dark, setDark} = useTheme()
  const { auth, logout: logoutAuth } = useAuth()
  const nav = useNavigate()
  
  function logout(){
    logoutAuth()
    nav('/login')
  }

  return (
    <aside className="w-72 bg-white dark:bg-slate-800 min-h-screen p-4 flex flex-col gap-6 border-r border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-300 flex items-center justify-center text-slate-900 font-bold">CS</div>
        <div>
          <div className="font-bold text-lg text-slate-900 dark:text-slate-100">ClientSync</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Freelancer CRM</div>
        </div>
      </div>

      {auth ? (
        <>
          <nav className="flex-1 flex flex-col gap-1">
            <NavItem to="/"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="1.5"/></svg> Dashboard</NavItem>
            <NavItem to="/clients"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M6 20c0-3 4-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5"/></svg> Clients</NavItem>
            <NavItem to="/projects"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="14" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg> Projects</NavItem>
            <NavItem to="/about"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/><path d="M12 8v4" stroke="currentColor" strokeWidth="1.5"/></svg> About</NavItem>
          </nav>

          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700 dark:text-slate-400">Theme</div>
            <button 
              onClick={() => {
                setDark(prev => !prev);
              }} 
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              {dark ? 'Light' : 'Dark'}
            </button>
          </div>

          <div className="flex gap-2">
            <button onClick={logout} className="w-full px-3 py-2 rounded-md bg-red-50 dark:bg-red-600/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600/30">Logout</button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="text-slate-600 dark:text-slate-400">Please login to continue</div>
          <div className="flex gap-2">
            <NavLink to="/login" className="px-3 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600">Login</NavLink>
            <NavLink to="/register" className="px-3 py-2 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10">Register</NavLink>
          </div>
        </div>
      )}

      <div className="text-xs text-slate-600 dark:text-slate-400">Made for freelancing — manage clients, projects & invoices.</div>
    </aside>
)}