import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useTheme } from "../theme/ThemeProvider.jsx";
import TiltedCard from "../components/Tiltedcard.jsx";

const features = [
  {
    title: "Unified Client Hub",
    description:
      "All interactions, documents, and notes in one place so you can nurture relationships without digging through inboxes.",
  },
  {
    title: "Project Pulse",
    description:
      "Visual timelines and progress indicators keep every deliverable on track and every stakeholder aligned.",
  },
  {
    title: "Automated Rituals",
    description:
      "Intelligent reminders, follow-up nudges, and scheduled summaries free you to focus on impactful work.",
  },
];

const highlights = [
  "Built for boutique agencies and solo consultants",
  "Privacy-first architecture with secure client portals",
  "Seamless handoff from prospecting to delivery",
];

export default function Home() {
  const { dark } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 dark:opacity-100"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent dark:from-slate-950/80 dark:via-slate-950/75 dark:to-slate-950/95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo
            showTagline
            tone={dark ? "light" : "default"}
            mark="monogram"
            className="justify-center sm:justify-start"
          />
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ThemeToggle appearance={dark ? "onDark" : "default"} />
            <NavLink
              to="/login"
              className="rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-800 transition hover:border-indigo-400 hover:bg-slate-100 sm:text-left dark:border-white/20 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/10"
            >
              Log in
            </NavLink>
            <NavLink
              to="/register"
              className="rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 px-4 py-2 text-center text-sm font-semibold text-slate-900 shadow-lg shadow-indigo-500/30 transition hover:brightness-110 sm:text-left"
            >
              Get started
            </NavLink>
          </div>
        </header>

        {/* Main */}
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-16 pt-16 text-white sm:pt-20">
          {/* Hero */}
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.5em] text-sky-200/90">
              CLIENTSYNC
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
              Orchestrate every client relationship with clarity and calm.
            </h1>
            <p className="mt-6 text-base text-slate-700 dark:text-slate-200/90 sm:text-lg">
              ClientSync wraps your entire client lifecycle — onboarding,
              project delivery, follow-ups, and billing — into a single,
              intuitive workspace. Stay proactive, win trust, and grow
              sustainably.
            </p>

            {/* Highlight Pills */}
            <div className="mt-8 flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-200/90 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/60 px-4 py-2 dark:bg-white/10">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
                <span>Live dashboards for every client</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100/60 px-4 py-2 dark:bg-white/10">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-300"></span>
                <span>Team-ready collaboration</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <TiltedCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                rotateAmplitude={14}
                scaleOnHover={1.08}
                height="150px"       
                width="100%"         
                padding="24px"       
              />
            ))}
          </div>

          {/* Why Section */}
          <section className="mt-16 grid gap-10 rounded-3xl border border-slate-300/40 bg-slate-100/60 p-6 backdrop-blur sm:p-8 dark:border-white/10 dark:bg-white/5">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Why ClientSync works for modern teams
              </h2>
              <p className="mt-3 max-w-2xl text-slate-700 dark:text-slate-200/80">
                From the first discovery call to your final invoice, ClientSync
                keeps every detail visible and every client impressed. Powerful
                automations and insights make consistency your competitive
                advantage.
              </p>
            </div>

            <ul className="grid gap-4 text-sm text-slate-700 dark:text-slate-200/90 sm:grid-cols-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.4em] text-slate-700/70 dark:text-white/60">
              <span>Realtime updates</span>
              <span>Granular permissions</span>
              <span>Client happiness</span>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="mx-auto w-full max-w-6xl px-6 pb-10 text-xs text-slate-600 dark:text-white/60">
          Copyright {new Date().getFullYear()} ClientSync. Crafted for Full
          Stack Development - I course SEM-5.
        </footer>
      </div>
    </div>
  );
}
