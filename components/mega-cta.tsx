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

export function MegaCta({ onCta }: MegaCtaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lines = el.querySelectorAll<HTMLElement>("[data-mega-line]");
    const show = () => {
      lines.forEach((line) => {
        line.style.opacity = "1";
        line.style.transform = "none";
      });
    };

    const failsafe = window.setTimeout(show, 1800);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      show();
      window.clearTimeout(failsafe);
      return () => window.clearTimeout(failsafe);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            once: true,
            onEnter: () => window.clearTimeout(failsafe),
          },
          onComplete: () => window.clearTimeout(failsafe),
        },
      );
    }, el);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      show();
    };
  }, []);

  return (
    <section className="section-pad border-t border-[var(--line)] py-20 sm:py-24 md:py-36">
      <div ref={ref} className="container-max">
        <h2 className="font-display text-4xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-5xl md:text-7xl lg:text-8xl">
          {megaCta.lines.map((line) => (
            <span key={line} data-mega-line className="block">
              {line}
            </span>
          ))}
        </h2>

        <button
          type="button"
          data-mega-line
          className="group mt-10 inline-flex items-center gap-3 text-left sm:mt-12"
          onClick={() => {
            trackCta("start_project", "mega_cta");
            onCta();
          }}
        >
          <span className="font-display text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
            {megaCta.cta}
          </span>
          <span
            aria-hidden
            className="translate-x-0 transition-transform duration-300 group-hover:translate-x-2"
          >
            →
          </span>
        </button>
      </div>
    </section>
  );
}
