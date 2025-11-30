import React from "react";
import { Link } from "react-router-dom";

export default function Logo({
  orientation = "horizontal",
  className = "",
  showTagline = false,
  tone = "default",
  mark = "icon",
  size = 12,
}) {
  const textClasses =
    tone === "light"
      ? "text-white drop-shadow-sm"
      : "text-slate-900 dark:text-slate-100";

  const accentClasses =
    tone === "light"
      ? "from-white via-sky-100 to-emerald-100 text-white"
      : "from-indigo-400 via-sky-400 to-emerald-400";

  const taglineClasses =
    tone === "light"
      ? "text-white/70"
      : "text-slate-500 dark:text-slate-400";

  const wordmark = (
    <div className="flex flex-col">
      <span className={`text-lg font-semibold tracking-tight ${textClasses}`}>
        Client
        <span
          className={`text-transparent bg-clip-text bg-gradient-to-r ${accentClasses}`}
        >
          Sync
        </span>
      </span>

      {showTagline && (
        <span
          className={`text-xs font-medium uppercase tracking-[0.2em] ${taglineClasses}`}
        >
          Freelancer CRM
        </span>
      )}
    </div>
  );

  return (
    <Link
      to="/"
      className={`flex items-center gap-3 cursor-pointer select-none ${
        orientation === "vertical" ? "flex-col text-center" : "flex-row"
      } ${className}`}
    >
      <div
        className={`relative shrink-0 ${
          size === 10 ? "h-10 w-10" : size === 8 ? "h-8 w-8" : "h-12 w-12"
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 via-sky-400 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/20">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
            {mark === "monogram" ? (
              <span className="font-black tracking-tight">CS</span>
            ) : (
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10.5 13.5L13.5 10.5" />
                <path d="M7.5 9A3 3 0 0 1 12 9l1 1" />
                <path d="M16.5 15a3 3 0 0 1-4.5 0l-1-1" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {orientation !== "icon" && wordmark}
    </Link>
  );
}
