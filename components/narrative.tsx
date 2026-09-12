"use client";

import { narrative } from "@/content/site";
import { Reveal } from "@/components/motion";

export function Narrative() {
  return (
    <section className="section-pad border-t border-[var(--line)] py-20 md:py-32">
      <div className="container-max">
        <Reveal>
          <p className="section-label">{narrative.label}</p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="font-display mt-8 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.03em] md:text-6xl lg:text-7xl">
            {narrative.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.1}>
            <p className="text-[15px] leading-relaxed text-muted md:text-base">
              {narrative.lead}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-[15px] leading-relaxed text-muted md:text-base">
              {narrative.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
