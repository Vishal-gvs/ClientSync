import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Logo from './components/Logo.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Clients from './pages/Clients.jsx';
import Projects from './pages/Projects.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import Settings from './pages/Settings.jsx';
import { ThemeProvider } from './theme/ThemeProvider.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const hideSidebar = ['/login', '/register', '/'].includes(location.pathname);
  const fullBleed = location.pathname === '/';
  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/clients': 'Clients',
    '/projects': 'Projects',
    '/about': 'About',
    '/settings': 'Settings',
  };
  const pageTitle = pageTitles[location.pathname] ?? 'ClientSync';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="flex min-h-screen">
        {!hideSidebar && (
          <>
            <Sidebar className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen" />
            <div
              className={`fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden ${
                sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <Sidebar
              className={`fixed inset-y-0 left-0 z-50 h-screen w-72 transform border-r border-transparent bg-white shadow-2xl transition-transform duration-200 ease-out lg:hidden dark:bg-slate-900 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              onClose={() => setSidebarOpen(false)}
            />
          </>
        )}

        <main
          className={`flex min-h-screen flex-1 flex-col bg-slate-50 dark:bg-slate-900 ${
            fullBleed ? '' : 'px-4 py-6 sm:px-6 lg:px-8'
          }`}
        >
          {!hideSidebar && (
            <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-slate-50/95 px-2 py-3 shadow-sm backdrop-blur lg:hidden dark:border-slate-700 dark:bg-slate-900/95">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:text-indigo-200"
                aria-label="Toggle navigation"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>

              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <Logo orientation="icon" mark="monogram" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pageTitle}</span>
              </div>

              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-transparent" aria-hidden="true" />
            </div>
          )}

          <div className={`flex-1 ${fullBleed ? '' : 'mx-auto w-full max-w-6xl'}`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <Clients />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#111827', color: '#fff' },
          success: { iconTheme: { primary: '#34d399', secondary: '#1f2937' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1f2937' } },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
