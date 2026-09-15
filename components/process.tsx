"use client";

import { processSteps } from "@/content/site";
import { Reveal } from "@/components/motion";

/** Process as horizontal grid strip. */
export function Process() {
  return (
    <section id="process" className="border-b border-[var(--line)]">
      <div className="border-b border-[var(--line)] px-4 py-8 sm:px-6 md:px-8">
        <Reveal>
          <p className="meta">Process</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight uppercase sm:text-4xl md:text-5xl">
            Brief to live
          </h2>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <div
            key={step.step}
            className={`border-b border-[var(--line)] p-5 sm:p-7 lg:border-b-0 ${
              index % 2 === 0 ? "sm:border-r sm:border-[var(--line)]" : ""
            } ${index < 3 ? "lg:border-r lg:border-[var(--line)]" : ""}`}
          >
            <p className="meta">{step.step}</p>
            <h3 className="font-display mt-6 text-xl font-semibold tracking-tight uppercase sm:mt-8 sm:text-2xl">
              {step.title}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-muted normal-case tracking-normal">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
