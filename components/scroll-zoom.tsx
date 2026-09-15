"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const RINGS = [
  { w: 22, z: -180 },
  { w: 34, z: -120 },
  { w: 46, z: -60 },
  { w: 58, z: 0 },
  { w: 72, z: 60 },
  { w: 88, z: 120 },
];

/**
 * Tunnel zoom — pins only when this section hits the top of the viewport,
 * then scrubs the ring zoom. Does nothing while you're still on the hero.
 */
export function ScrollZoom() {
  const wrapRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    const stage = stageRef.current;
    const copy = copyRef.current;
    if (!wrap || !pin || !stage) return;

    const rings = stage.querySelectorAll<HTMLElement>(".tunnel-ring");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Always start at the "before scroll" pose
    const setStartPose = () => {
      rings.forEach((el, i) => {
        const z = RINGS[i]?.z ?? 0;
        gsap.set(el, {
          z,
          scale: 0.55 + i * 0.08,
          opacity: 0.25 + i * 0.1,
          force3D: true,
        });
      });
      if (copy) gsap.set(copy, { autoAlpha: 1, scale: 1 });
    };

    setStartPose();

    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap,
          // Only when this section reaches the top of the viewport
          start: "top top",
          end: () =>
            `+=${Math.round(
              window.innerHeight * (window.matchMedia("(max-width: 767px)").matches ? 1.1 : 1.4),
            )}`,
          pin: pin,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            if (self.progress === 0) setStartPose();
          },
        },
      });

      rings.forEach((el, i) => {
        tl.to(
          el,
          {
            z: (RINGS[i]?.z ?? 0) + 220,
            scale: 1.35 + i * 0.12,
            opacity: i < 2 ? 0 : 0.85,
            duration: 1,
          },
          0,
        );
      });

      if (copy) {
        tl.to(
          copy,
          {
            autoAlpha: 0,
            scale: 1.12,
            duration: 0.5,
          },
          0.15,
        );
      }
    }, wrap);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    // Layout / font settle
    const t1 = window.setTimeout(refresh, 100);
    const t2 = window.setTimeout(refresh, 400);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative border-b border-[var(--line)]"
      aria-label="Portal zoom"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100svh] max-h-[100dvh] items-center justify-center overflow-hidden bg-black"
      >
        <div
          ref={stageRef}
          className="tunnel relative h-full w-full"
          style={{ perspective: "1000px" }}
        >
          {RINGS.map((ring) => (
            <div
              key={ring.w}
              className="tunnel-ring will-change-transform"
              style={
                {
                  "--ring-w": `${ring.w}%`,
                } as CSSProperties
              }
            />
          ))}
        </div>
        <div
          ref={copyRef}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-5 text-center will-change-[opacity,transform] sm:gap-3 sm:px-6"
        >
          <p className="meta">Enter the build</p>
          <p className="font-display max-w-2xl text-[clamp(1.2rem,5vw,3rem)] font-semibold tracking-tight uppercase sm:text-3xl md:text-4xl lg:text-5xl">
            From brief to live product
          </p>
        </div>
      </div>
    </section>
  );
}
