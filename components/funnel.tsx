"use client";

import { FunnelPanel, type FunnelPanelProps } from "@/components/funnel-panel";
import { Reveal } from "@/components/motion";

/** Inline funnel for ads landing and any non-floating placement. */
export function Funnel(props: FunnelPanelProps) {
  return (
    <section className="section-pad border-t border-[var(--line)] py-16 md:py-24">
      <div className="container-max">
        <Reveal>
          <div className="surface mx-auto max-w-2xl p-6 md:p-8">
            <FunnelPanel {...props} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function scrollToFunnel() {
  document
    .getElementById("funnel-bottom")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
}
