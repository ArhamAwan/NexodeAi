"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { narrative } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * SahulatPay-style sticky zoom: card expands from inset to full-bleed on scroll.
 * Works on all viewports; reduced-motion gets a static full-bleed panel.
 */
export function ScrollZoom() {
  const wrapRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const card = cardRef.current;
    const copy = copyRef.current;
    if (!wrap || !card) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(card, {
        width: "100%",
        height: "100%",
        borderRadius: 0,
      });
      if (copy) gsap.set(copy, { opacity: 1 });
      return;
    }

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      gsap.set(card, {
        width: () =>
          isMobile()
            ? Math.min(window.innerWidth - 32, window.innerWidth * 0.88)
            : Math.min(window.innerWidth - 64, 920),
        height: () =>
          isMobile()
            ? Math.min(window.innerHeight * 0.48, 360)
            : Math.min(window.innerHeight * 0.58, 520),
        borderRadius: () => (isMobile() ? 20 : 28),
      });
      if (copy) gsap.set(copy, { opacity: 0.35 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: isMobile() ? 0.45 : 0.65,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        card,
        {
          width: () => window.innerWidth,
          height: () => window.innerHeight,
          borderRadius: 0,
          ease: "none",
          duration: 0.65,
        },
        0,
      );

      if (copy) {
        tl.to(copy, { opacity: 1, ease: "none", duration: 0.35 }, 0.2);
      }
    }, wrap);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-[180vh] w-full md:h-[220vh]"
      aria-label="Studio manifesto"
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden">
        <div
          ref={cardRef}
          className="relative overflow-hidden border border-[var(--line)] bg-[#111] will-change-[width,height,border-radius]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 60% 40%, rgba(244,241,236,0.08), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(244,241,236,0.04), transparent 45%)",
            }}
            aria-hidden
          />
          <div
            ref={copyRef}
            className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center sm:px-8"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
              {narrative.label}
            </p>
            <h2 className="font-display mt-5 max-w-4xl text-3xl leading-[1.05] font-semibold tracking-[-0.03em] sm:mt-6 sm:text-4xl md:text-6xl lg:text-7xl xl:text-[clamp(3.5rem,5vw,5rem)]">
              {narrative.headlineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted sm:mt-8 md:text-base">
              Ambition deserves software that finally shows what you&apos;ve built.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
