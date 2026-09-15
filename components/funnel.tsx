"use client";

import { FunnelPanel, type FunnelPanelProps } from "@/components/funnel-panel";
import { Reveal } from "@/components/motion";

/** Intake cell — FunnelPanel unchanged inside grid chrome. */
export function Funnel(props: FunnelPanelProps) {
  return (
    <section className="border-b border-[var(--line)]">
      <div className="border-b border-[var(--line)] px-4 py-8 sm:px-6 md:px-8">
        <Reveal>
          <p className="meta">Intake</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight uppercase sm:text-4xl">
            Start a project
          </h2>
        </Reveal>
      </div>
      <div className="mx-auto max-w-2xl border-[var(--line)] p-4 sm:border-x sm:p-8 md:p-10">
        <FunnelPanel {...props} />
      </div>
    </section>
  );
}

export function scrollToFunnel() {
  document
    .getElementById("funnel-bottom")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}
