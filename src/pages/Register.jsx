import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    try {
      // check exists
      const exists = await api.get(`/users?email=${encodeURIComponent(email)}`);
      if (exists.data && exists.data.length > 0) {
        alert('User already exists.');
        return;
      }
      const payload = { email, password: pass, name };
      const res = await api.post('/users', payload);
      alert('Registered successfully!');
      login(res.data);
      nav('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed.');
    }
  }

  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center px-4 py-12 sm:py-20">
      <div className="flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-700 dark:bg-slate-800/95 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <Logo orientation="horizontal" />
          <ThemeToggle className="px-3 py-1.5 text-xs" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Create your account</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Set up ClientSync to manage your clients and projects with ease.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</label>
            <input
              placeholder="Your name"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</label>
            <input
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>

          <button className="w-full rounded-xl bg-indigo-500 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600">Create account</button>
        </form>

        <div className="text-sm text-slate-700 dark:text-slate-300">
          Already have an account?{' '}
          <button className="font-semibold text-indigo-600 underline transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300" onClick={() => nav('/login')}>Log in</button>
        </div>
      </div>
    </div>
  );
}
