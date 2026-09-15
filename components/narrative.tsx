"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { narrative } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

/** Sticky scrub manifesto — type only, line-by-line reveal. */
export function Narrative() {
  const wrapRef = useRef<HTMLElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      if (leadRef.current) leadRef.current.style.opacity = "1";
      if (bodyRef.current) bodyRef.current.style.opacity = "1";
      return;
    }

    const ctx = gsap.context(() => {
      if (leadRef.current) gsap.set(leadRef.current, { autoAlpha: 0.25 });
      if (bodyRef.current) gsap.set(bodyRef.current, { autoAlpha: 0.2 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
        },
      });

      if (leadRef.current) {
        tl.to(leadRef.current, { autoAlpha: 1, duration: 0.4, ease: "none" }, 0);
      }
      if (bodyRef.current) {
        tl.to(bodyRef.current, { autoAlpha: 1, duration: 0.4, ease: "none" }, 0.25);
      }
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-[160vh] border-t border-[var(--line)] md:h-[180vh]"
      aria-label="Studio narrative"
    >
      <div className="sticky top-0 flex min-h-svh items-center">
        <div className="container-max section-pad w-full py-20 md:py-28">
          <p className="section-label">{narrative.label}</p>
          <h2 className="font-display mt-8 max-w-4xl text-4xl leading-[1.05] font-medium tracking-[-0.03em] md:text-6xl lg:text-7xl">
            {narrative.headlineLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-2 md:gap-16">
            <p
              ref={leadRef}
              className="text-[15px] leading-relaxed text-muted md:text-base"
            >
              {narrative.lead}
            </p>
            <p
              ref={bodyRef}
              className="text-[15px] leading-relaxed text-muted md:text-base"
            >
              {narrative.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
