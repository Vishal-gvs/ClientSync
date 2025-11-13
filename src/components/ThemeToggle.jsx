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
      className={`group inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm backdrop-blur transition ${stylesByAppearance[appearance] ?? stylesByAppearance.default} ${className}`}
    >
      <span className="sr-only">Toggle theme</span>
      {dark ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
            />
          </svg>
          <span>Light mode</span>
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
          </svg>
          <span>Dark mode</span>
        </>
      )}
    </button>
  );
}
