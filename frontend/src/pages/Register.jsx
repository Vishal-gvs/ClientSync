import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { toast } from 'react-hot-toast';

function isEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Please enter your name.';
    if (!isEmail(email)) nextErrors.email = 'Please enter a valid email address.';
    if (!pass || pass.length < 6) nextErrors.pass = 'Password must be at least 6 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const exists = await api.get(`/users?email=${encodeURIComponent(email)}`);
      if (exists.data && exists.data.length > 0) {
        toast.error('An account with this email already exists.');
        return;
      }
      const payload = { email, password: pass, name };
      const res = await api.post('/users', payload);
      toast.success('Registered successfully!');
      login(res.data);
      nav('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</label>
            <input
              placeholder="Your name"
              className={`input ${errors.name ? 'ring-2 ring-red-500' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && <p id="name-error" className="error-text">{errors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</label>
            <input
              placeholder="you@example.com"
              className={`input ${errors.email ? 'ring-2 ring-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" className="error-text">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className={`input ${errors.pass ? 'ring-2 ring-red-500' : ''}`}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              aria-invalid={!!errors.pass}
              aria-describedby={errors.pass ? 'pass-error' : undefined}
            />
            {errors.pass && <p id="pass-error" className="error-text">{errors.pass}</p>}
          </div>

          <button disabled={loading} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="text-sm text-slate-700 dark:text-slate-300">
          Already have an account?{' '}
          <button className="font-semibold text-indigo-600 underline transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300" onClick={() => nav('/login')}>Log in</button>
        </div>
      </div>
    </div>
  );
}
