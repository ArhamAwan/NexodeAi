"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { capabilityStrip } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export function CapabilityStrip() {
  const rootRef = useRef<HTMLDivElement>(null);
  const row = [...capabilityStrip, ...capabilityStrip];

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: "-8%",
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-hidden border-y border-[var(--line)] py-5 will-change-transform">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap px-4">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-mono text-xs tracking-[0.22em] text-muted uppercase"
          >
            {item}
            <span className="ml-10 text-foreground/25">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
