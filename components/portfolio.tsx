"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolio, type CaseStudy } from "@/content/site";
import { Reveal } from "@/components/motion";
import { CaseStudyModal } from "@/components/case-study-modal";

gsap.registerPlugin(ScrollTrigger);

type PortfolioProps = {
  onBookCall: () => void;
};

export function Portfolio({ onBookCall }: PortfolioProps) {
  const [active, setActive] = useState<CaseStudy | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const rows = root.querySelectorAll<HTMLElement>("[data-work-row]");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { scale: 1, opacity: 1 },
          {
            scale: isMobile ? 0.98 : 0.97,
            opacity: isMobile ? 0.65 : 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: row,
              start: isMobile ? "top 28%" : "top 18%",
              end: isMobile ? "top -5%" : "top -10%",
              scrub: true,
            },
            transformOrigin: "center top",
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="section-pad border-t border-[var(--line)] py-16 sm:py-20 md:py-28">
      <div className="container-max">
        <Reveal>
          <p className="section-label">Success stories</p>
          <h2 className="font-display mt-5 text-3xl leading-[1.08] font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Selected work
          </h2>
        </Reveal>

        <div ref={listRef} className="mt-10 sm:mt-14">
          {portfolio.map((item) => (
            <div key={item.id} data-work-row className="origin-top will-change-transform">
              {item.shipped ? (
                <button
                  type="button"
                  className="group grid w-full gap-3 border-t border-[var(--line)] py-8 text-left transition-colors hover:bg-white/[0.015] sm:gap-4 sm:py-10 md:grid-cols-[6rem_1fr_auto] md:items-end md:gap-8 md:py-12"
                  onClick={() => setActive(item)}
                >
                  <CardBody item={item} />
                </button>
              ) : (
                <div className="grid gap-3 border-t border-[var(--line)] py-8 opacity-40 sm:gap-4 sm:py-10 md:grid-cols-[6rem_1fr_auto] md:items-end md:gap-8 md:py-12">
                  <CardBody item={item} />
                </div>
              )}
            </div>
          ))}
          <div className="border-t border-[var(--line)]" />
        </div>
      </div>

      <CaseStudyModal
        study={active}
        onClose={() => setActive(null)}
        onBookCall={onBookCall}
      />
    </section>
  );
}

function CardBody({ item }: { item: CaseStudy }) {
  return (
    <>
      <p className="font-mono text-xs tracking-wider text-muted">{item.index}</p>
      <div className="min-w-0">
        <h3 className="font-display text-2xl font-semibold tracking-tight transition-all duration-300 group-hover:tracking-wide sm:text-3xl md:text-4xl">
          {item.title}
        </h3>
        <p className="mt-3 max-w-xl text-[15px] text-muted">{item.summary}</p>
        <p className="mt-4 font-mono text-xs tracking-wider text-foreground/70 uppercase">
          {item.metric}
        </p>
      </div>
      {item.shipped ? (
        <p className="font-mono text-xs tracking-wider text-muted uppercase transition-colors group-hover:text-foreground">
          View story →
        </p>
      ) : (
        <p className="font-mono text-xs tracking-wider text-muted uppercase">
          Soon
        </p>
      )}
    </>
  );
}
