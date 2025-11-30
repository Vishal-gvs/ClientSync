import React from "react";
import Logo from "../components/Logo.jsx";
import TiltedCard from "../components/TiltedCard.jsx";

const features = [
  {
    title: "360° Client View",
    description:
      "Centralize contact info, notes, files, and timelines so every touchpoint is only a click away.",
  },
  {
    title: "Project Rhythm",
    description:
      "Plan milestones, assign tasks, and monitor progress with a visual pulse of everything in motion.",
  },
  {
    title: "Smart Automations",
    description:
      "Schedule reminders, automate follow ups, and keep recurring work humming in the background.",
  },
  {
    title: "Collaboration Ready",
    description:
      "Invite partners or contractors with role based permissions that protect sensitive conversations.",
  },
  {
    title: "Client Portal",
    description:
      "Share status updates, deliverables, and invoices in a branded portal clients actually want to use.",
  },
  {
    title: "Insights & Reporting",
    description:
      "Spot bottlenecks, forecast revenue, and celebrate wins with dashboards tuned for small teams.",
  },
];

export default function About() {
  return (
    <div className="space-y-10">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold mb-4 text-slate-900 dark:text-slate-100">
          About ClientSync
        </h1>

        <p className="text-slate-700 dark:text-slate-400 mb-4">
          ClientSync was born from a simple idea: independent consultants and
          boutique agencies deserve the same operational polish as enterprise
          teams without the complexity. The platform streamlines the entire
          client lifecycle—from the first hello to the final invoice—inside a
          single, guided workspace.
        </p>

        <p className="text-slate-700 dark:text-slate-400">
          Every interaction is designed to keep teams proactive and clients
          informed. Fast onboarding, transparent progress, and accountable
          handoffs become the norm instead of the exception.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
          What makes ClientSync different
        </h2>

        {/* Cards Grid using TiltedCard */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <TiltedCard
              key={feature.title}
              title={
                <div className="flex items-center gap-3">
                  <Logo orientation="icon" size={10} className="shrink-0" />
                  <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </span>
                </div>
              }
              description={
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              }
              height="200px"
              width="100%"
              padding="20px"
              rotateAmplitude={12}
              scaleOnHover={1.06}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
