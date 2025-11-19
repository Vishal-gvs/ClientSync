import React from 'react';
import { useTheme } from '../theme/ThemeProvider.jsx';

const stylesByAppearance = {
  default:
    'border border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300',
  onDark:
    'border border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20 dark:border-slate-600/60 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-indigo-400 dark:hover:text-indigo-200',
};

export default function ThemeToggle({ className = '', appearance = 'default' }) {
  const { dark, setDark } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setDark((prev) => !prev)}
      className={`group relative inline-flex items-center rounded-full px-2 py-1 text-xs font-medium shadow-sm backdrop-blur transition ${stylesByAppearance[appearance] ?? stylesByAppearance.default} ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      <span className="relative flex h-6 w-11 items-center">
        {/* Track */}
        <span className="absolute inset-0 rounded-full bg-white/70 ring-1 ring-inset ring-slate-300 transition dark:bg-slate-900/70 dark:ring-slate-600" aria-hidden="true" />

        {/* Knob */}
        <span
          className={`absolute left-0 z-10 inline-flex h-6 w-6 translate-x-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-300 transition-transform duration-200 ease-out dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-600 ${dark ? 'translate-x-5' : 'translate-x-0'}`}
          aria-hidden="true"
        >
          {/* Icons inside knob */}
          <span className={`absolute inset-0 flex items-center justify-center transition ${dark ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
            {/* Sun */}
            <svg className="h-3.5 w-3.5 animate-icon-pop" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            </svg>
          </span>
          <span className={`absolute inset-0 flex items-center justify-center transition ${dark ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            {/* Moon */}
            <svg className="h-3.5 w-3.5 animate-icon-pop" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
            </svg>
          </span>
        </span>

        {/* Labels */}
        <span className={`ml-12 hidden sm:block transition ${dark ? 'text-white/70' : 'text-slate-700/80'}`}>{dark ? 'Light mode' : 'Dark mode'}</span>
      </span>
    </button>
  );
}
