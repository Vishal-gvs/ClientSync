import React from 'react';

export default function Logo({ orientation = 'horizontal', className = '', showTagline = false, tone = 'default' }) {
  const textClasses =
    tone === 'light'
      ? 'text-white drop-shadow-sm'
      : 'text-slate-900 dark:text-slate-100';
  const accentClasses =
    tone === 'light'
      ? 'from-white via-sky-100 to-emerald-100 text-white'
      : 'from-indigo-400 via-sky-400 to-emerald-400';
  const taglineClasses =
    tone === 'light'
      ? 'text-white/70'
      : 'text-slate-500 dark:text-slate-400';

  const wordmark = (
    <div className="flex flex-col">
      <span className={`text-lg font-semibold tracking-tight ${textClasses}`}>
        Client
        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentClasses}`}>
          Sync
        </span>
      </span>
      {showTagline && (
        <span className={`text-xs font-medium uppercase tracking-[0.2em] ${taglineClasses}`}>
          Freelancer CRM
        </span>
      )}
    </div>
  );

  return (
    <div
      className={`flex items-center gap-3 ${orientation === 'vertical' ? 'flex-col text-center' : 'flex-row'} ${className}`}
    >
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-indigo-500/30 ring-4 ring-white/60 dark:bg-white dark:text-slate-900 dark:ring-slate-900/20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 opacity-80 blur-sm"></div>
        <span className="relative font-black tracking-tight">CS</span>
      </div>
      {orientation !== 'icon' && wordmark}
    </div>
  );
}

