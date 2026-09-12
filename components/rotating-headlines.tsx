"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

type RotatingHeadlinesProps = {
  headlines: readonly string[];
  className?: string;
  intervalMs?: number;
};

export function RotatingHeadlines({
  headlines,
  className,
  intervalMs = 5200,
}: RotatingHeadlinesProps) {
  const [index, setIndex] = useState(0);
  const slotRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLHeadingElement>(null);
  const [slotHeight, setSlotHeight] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const slot = slotRef.current;
      const root = measureRef.current;
      if (!slot || !root) return;

      const width = slot.clientWidth;
      if (width <= 0) return;

      root.style.width = `${width}px`;

      let tallest = 0;
      root.querySelectorAll<HTMLElement>("[data-measure-line]").forEach((el) => {
        tallest = Math.max(tallest, el.getBoundingClientRect().height);
      });

      // Word wrappers add a little padding — match live markup
      if (tallest > 0) setSlotHeight(Math.ceil(tallest) + 4);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (slotRef.current) ro.observe(slotRef.current);
    window.addEventListener("resize", measure);
    // fonts can change line wraps
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [headlines, className]);

  useEffect(() => {
    if (headlines.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % headlines.length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [headlines.length, intervalMs]);

  useEffect(() => {
    const el = activeRef.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>(".rh-word");
    const show = () => {
      words.forEach((w) => {
        w.style.opacity = "1";
        w.style.transform = "none";
      });
    };

    const failsafe = window.setTimeout(show, 1000);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      show();
      window.clearTimeout(failsafe);
      return () => window.clearTimeout(failsafe);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: "110%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.85,
          stagger: 0.03,
          ease: "power3.out",
          onComplete: () => window.clearTimeout(failsafe),
        },
      );
    }, el);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      show();
    };
  }, [index]);

  const text = headlines[index] ?? headlines[0] ?? "";

  return (
    <div
      ref={slotRef}
      className="relative w-full"
      style={slotHeight > 0 ? { height: slotHeight } : undefined}
    >
      {/* Off-screen measure at the same width as the live slot */}
      <div
        ref={measureRef}
        aria-hidden
        className="pointer-events-none invisible absolute top-0 left-0"
      >
        {headlines.map((line) => (
          <p key={line} data-measure-line className={className}>
            {line.split(" ").map((word, i) => (
              <span
                key={`${line}-${word}-${i}`}
                className="inline-block overflow-hidden pb-1 align-bottom"
              >
                <span className="inline-block">
                  {word}&nbsp;
                </span>
              </span>
            ))}
          </p>
        ))}
      </div>

      <h1
        ref={activeRef}
        className={`absolute inset-x-0 top-0 ${className ?? ""}`}
        aria-live="polite"
      >
        {text.split(" ").map((word, i) => (
          <span
            key={`${index}-${word}-${i}`}
            className="inline-block overflow-hidden pb-1 align-bottom"
          >
            <span className="rh-word inline-block will-change-transform">
              {word}&nbsp;
            </span>
          </span>
        ))}
      </h1>
    </div>
  );
}
