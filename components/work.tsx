"use client";

import { useState } from "react";
import { portfolio, type CaseStudy } from "@/content/site";
import { Reveal } from "@/components/motion";
import { CaseStudyModal } from "@/components/case-study-modal";

type WorkProps = {
  onBookCall: () => void;
};

/** Works as bordered grid index — no image tiles. */
export function Work({ onBookCall }: WorkProps) {
  const [active, setActive] = useState<CaseStudy | null>(null);
  const shipped = portfolio.filter((item) => item.shipped);
  const upcoming = portfolio.filter((item) => !item.shipped);

  return (
    <section id="work" className="border-b border-[var(--line)]">
      <div className="grid-rule-x px-4 py-8 sm:px-6 md:px-8">
        <Reveal>
          <p className="meta">Works</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight uppercase sm:text-4xl md:text-5xl">
            Products in the wild
          </h2>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-2">
        {shipped.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`group grid-rule-x p-5 text-left transition-colors hover:bg-foreground hover:text-background sm:p-8 ${
              i % 2 === 0 ? "md:grid-rule-y" : ""
            }`}
            onClick={() => setActive(item)}
          >
            <p className="meta group-hover:text-background/60">
              {item.index} · {item.metric}
            </p>
            <h3 className="font-display mt-5 text-2xl font-semibold tracking-tight uppercase sm:mt-6 sm:text-3xl md:text-4xl">
              {item.title}
            </h3>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted normal-case tracking-normal group-hover:text-background/70">
              {item.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {item.tags.map((tag) => (
                <span key={tag} className="meta group-hover:text-background/55">
                  [{tag}]
                </span>
              ))}
            </div>
            <p className="meta mt-8 group-hover:text-background">View story →</p>
          </button>
        ))}
      </div>

      {upcoming.length > 0 ? (
        <p className="meta grid-rule-x px-4 py-5 sm:px-6">More shipping soon</p>
      ) : null}

      <CaseStudyModal
        study={active}
        onClose={() => setActive(null)}
        onBookCall={onBookCall}
      />
    </section>
  );
}
