import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

function isEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export default function Settings(){
  const nav = useNavigate();
  const { auth, login, logout } = useAuth();
  const me = auth || {};

  const [name, setName] = useState(me.name || '');
  const [email, setEmail] = useState(me.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState('');

  const userId = useMemo(() => me.id, [me.id]);

  if (!auth) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-slate-600 dark:text-slate-300">You must be logged in to view settings.</p>
      </div>
    );
  }

  async function handleSaveProfile(e){
    e?.preventDefault?.();
    const errs = {};
    if (!name.trim()) errs.name = 'Please enter your name.';
    if (!isEmail(email)) errs.email = 'Please enter a valid email address.';
    setProfileErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingProfile(true);
    try {
      // Ensure email is unique (except for current user)
      const res = await api.get(`/users?email=${encodeURIComponent(email)}`);
      const matches = Array.isArray(res.data) ? res.data : [];
      const duplicate = matches.find(u => String(u.id) !== String(userId));
      if (duplicate) {
        setProfileErrors(prev => ({ ...prev, email: 'This email is already in use.' }));
        toast.error('This email is already in use.');
        return;
      }

      const payload = { name: name.trim(), email: email.trim() };
      const updated = await api.patch(`/users/${encodeURIComponent(userId)}`, payload);

      // Update local auth state to reflect changes
      login(updated.data);
      toast.success('Profile updated');
    } catch (err) {
      console.error('Failed to update profile', err);
      toast.error('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e){
    e?.preventDefault?.();
    const errs = {};
    if (!currentPass) errs.currentPass = 'Enter your current password.';
    if (!newPass || newPass.length < 6) errs.newPass = 'New password must be at least 6 characters.';
    if (newPass !== confirmPass) errs.confirmPass = 'Passwords do not match.';

    // Validate current password matches what we have stored in auth
    if (me.password && currentPass && currentPass !== me.password) {
      errs.currentPass = 'Current password is incorrect.';
    }

    setPasswordErrors(errs);
    if (Object.keys(errs).length) return;

    setSavingPassword(true);
    try {
      const payload = { password: newPass };
      const updated = await api.patch(`/users/${encodeURIComponent(userId)}`, payload);
      // Update local auth state with the new password as well
      login(updated.data);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      toast.success('Password updated');
    } catch (err) {
      console.error('Failed to update password', err);
      toast.error('Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleDeleteAccount(e){
    e?.preventDefault?.();
    if (!String(confirmDelete).toLowerCase().includes('delete')){
      toast.error("Please type 'delete' to confirm.");
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/users/${encodeURIComponent(userId)}`);
      toast.success('Your account has been deleted');
      logout();
      nav('/');
    } catch (err) {
      console.error('Failed to delete account', err);
      toast.error('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Profile</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update your name and email address.</p>

        <form onSubmit={handleSaveProfile} className="mt-4 grid gap-4 sm:max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</label>
            <input
              className={`input ${profileErrors.name ? 'ring-2 ring-red-500' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!profileErrors.name}
              aria-describedby={profileErrors.name ? 'name-error' : undefined}
            />
            {profileErrors.name && <p id="name-error" className="error-text">{profileErrors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</label>
            <input
              type="email"
              className={`input ${profileErrors.email ? 'ring-2 ring-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!profileErrors.email}
              aria-describedby={profileErrors.email ? 'email-error' : undefined}
            />
            {profileErrors.email && <p id="email-error" className="error-text">{profileErrors.email}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={savingProfile} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
              {savingProfile ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Change password</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter your current password and choose a new one.</p>

        <form onSubmit={handleChangePassword} className="mt-4 grid gap-4 sm:max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Current password</label>
            <input
              type="password"
              className={`input ${passwordErrors.currentPass ? 'ring-2 ring-red-500' : ''}`}
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              aria-invalid={!!passwordErrors.currentPass}
              aria-describedby={passwordErrors.currentPass ? 'curpass-error' : undefined}
            />
            {passwordErrors.currentPass && <p id="curpass-error" className="error-text">{passwordErrors.currentPass}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">New password</label>
            <input
              type="password"
              className={`input ${passwordErrors.newPass ? 'ring-2 ring-red-500' : ''}`}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              aria-invalid={!!passwordErrors.newPass}
              aria-describedby={passwordErrors.newPass ? 'newpass-error' : undefined}
            />
            {passwordErrors.newPass && <p id="newpass-error" className="error-text">{passwordErrors.newPass}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Confirm new password</label>
            <input
              type="password"
              className={`input ${passwordErrors.confirmPass ? 'ring-2 ring-red-500' : ''}`}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              aria-invalid={!!passwordErrors.confirmPass}
              aria-describedby={passwordErrors.confirmPass ? 'confirmpass-error' : undefined}
            />
            {passwordErrors.confirmPass && <p id="confirmpass-error" className="error-text">{passwordErrors.confirmPass}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={savingPassword} className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
              {savingPassword ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900/60 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Delete your account and all associated data (clients and projects). This action cannot be undone.</p>

        <form onSubmit={handleDeleteAccount} className="mt-4 grid gap-4 sm:max-w-xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Type 'delete' to confirm</label>
            <input
              className="input"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              placeholder="delete"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={deleting} className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-red-500/40 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
              {deleting ? 'Deleting…' : 'Delete account'}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-slate-600 dark:text-slate-300">Note: This demo stores users in JSON Server without hashing. Do not use real credentials.</p>
      </section>
    </div>
  );
}
