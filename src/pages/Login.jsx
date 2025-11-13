import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.get(`/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`);
      const users = res.data;
      if (!users || users.length === 0) {
        alert('Invalid credentials.');
        return;
      }
      const user = users[0];
      login(user);
      nav('/dashboard');
    } catch (err) {
      alert('Login failed.');
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="mb-6 flex items-center justify-between">
        <Logo orientation="horizontal" />
        <ThemeToggle />
      </div>
      <h1 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Login</h1>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          placeholder="Email"
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg text-white transition-colors">Login</button>
      </form>

      <div className="text-sm mt-3 text-slate-700 dark:text-slate-300">
        Don't have an account?{' '}
        <button className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700 dark:hover:text-indigo-300" onClick={() => nav('/register')}>Register</button>
      </div>
    </div>
  );
}
