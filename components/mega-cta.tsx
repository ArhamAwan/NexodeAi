"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { megaCta } from "@/content/site";
import { trackCta } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

type MegaCtaProps = {
  onCta: () => void;
};

/** Massive all-caps display lockup — Portal signature type. */
export function MegaCta({ onCta }: MegaCtaProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>("[data-lockup]");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      lines.forEach((l) => {
        l.style.opacity = "1";
        l.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: 48, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="border-b border-[var(--line)] px-4 py-14 sm:px-6 sm:py-20 md:py-28"
    >
      <h2 className="font-display mx-auto max-w-full text-center text-[clamp(2.5rem,14vw,9rem)] leading-[0.88] font-semibold tracking-[-0.04em] break-words uppercase">
        {megaCta.lines.map((line) => (
          <span key={line} data-lockup className="block">
            {line}
          </span>
        ))}
      </h2>
      <div className="mt-8 flex justify-center px-2 sm:mt-12">
        <button
          type="button"
          data-lockup
          className="btn-primary btn-stack-mobile max-w-xs sm:max-w-none"
          onClick={() => {
            trackCta("start_project", "mega_cta");
            onCta();
          }}
        >
          {megaCta.cta}
        </button>
      </div>
    </section>
  );
}
