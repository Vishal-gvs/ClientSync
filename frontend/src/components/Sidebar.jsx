import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Logo from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'

const NavItem = ({to, children, onNavigate}) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({isActive}) =>
      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium tracking-tight text-slate-700 transition-colors dark:text-slate-300 ' +
      (isActive
        ? 'border-l-4 border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-600/20 dark:text-indigo-300'
        : 'hover:bg-slate-100 dark:hover:bg-white/5')}
  >
    {children}
  </NavLink>
)

export default function Sidebar({ className = '', onClose }) {
  const { auth, logout: logoutAuth } = useAuth()
  const nav = useNavigate()

  function logout() {
    logoutAuth()
    nav('/login')
    onClose?.()
  }

  return (
    <aside
      className={`flex h-full w-72 flex-col gap-6 border-r border-slate-200 bg-white/95 p-4 text-sm shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Logo className="px-1" showTagline />
          <ThemeToggle className="px-2 py-1.5 text-xs" />
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
          >
            <span className="sr-only">Close navigation</span>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        )}
      </div>

      {auth ? (
        <>
          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
            <NavItem to="/dashboard" onNavigate={onClose}>
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M3 12 12 3l9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Dashboard
            </NavItem>
            <NavItem to="/clients" onNavigate={onClose}>
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 20c0-3 4-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Clients
            </NavItem>
            <NavItem to="/projects" onNavigate={onClose}>
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="3" y="14" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              Projects
            </NavItem>
            <NavItem to="/about" onNavigate={onClose}>
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              About
            </NavItem>
            <NavItem to="/settings" onNavigate={onClose}>
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M19 12a7 7 0 0 0-.12-1.3l1.69-1.3-1.5-2.6-2 .8a7 7 0 0 0-2.25-1.3l-.3-2.1h-3l-.3 2.1a7 7 0 0 0-2.25 1.3l-2-.8-1.5 2.6 1.69 1.3A7 7 0 0 0 5 12c0 .43.04.86.12 1.3l-1.69 1.3 1.5 2.6 2-.8c.67.56 1.43.98 2.25 1.3l.3 2.1h3l.3-2.1c.82-.32 1.58-.74 2.25-1.3l2 .8 1.5-2.6-1.69-1.3c.08-.44.12-.87.12-1.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Settings
            </NavItem>
          </nav>

          <div className="flex flex-col gap-3">
            <button
              onClick={logout}
              className="w-full rounded-md bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/20 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Please login to continue
          </div>
          <div className="flex flex-col gap-2">
            <NavLink
              to="/login"
              onClick={onClose}
              className="rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              onClick={onClose}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
            >
              Register
            </NavLink>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Made for freelancing - manage clients, projects & invoices.
      </div>
    </aside>
  )
}