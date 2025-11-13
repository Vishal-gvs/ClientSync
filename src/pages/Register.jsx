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
    } catch (err) {
      alert('Registration failed.');
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="mb-6 flex items-center justify-between">
        <Logo orientation="horizontal" />
        <ThemeToggle />
      </div>
      <h1 className="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">Register</h1>

      <form onSubmit={handleRegister} className="space-y-3">
        <input
          placeholder="Name"
          className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

        <button className="w-full bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg text-white transition-colors">Create Account</button>
      </form>
    </div>
  );
}
