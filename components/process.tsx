"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export function Process() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const panels = panelsRef.current.filter(Boolean) as HTMLDivElement[];
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      gsap.set(panels, { opacity: 0, scale: 0.96, y: 18 });
      if (panels[0]) gsap.set(panels[0], { opacity: 1, scale: 1, y: 0 });

      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        scrub: isMobile() ? 0.45 : 0.6,
        pin: stage,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const n = processSteps.length;
          const idx = Math.min(n - 1, Math.floor(self.progress * n * 0.999));
          setActive(idx);

          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`;
          }

          panels.forEach((panel, i) => {
            const start = i / n;
            const end = (i + 1) / n;
            const mid = (start + end) / 2;
            const local = gsap.utils.clamp(
              0,
              1,
              1 - Math.abs(self.progress - mid) / (0.5 / n + 0.08),
            );
            gsap.set(panel, {
              opacity: local,
              scale: 0.96 + local * 0.04,
              y: (1 - local) * 16,
              zIndex: i === idx ? 2 : 1,
            });
          });
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, wrap);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section id="process" className="relative z-10 border-t border-[var(--line)]">
      <div
        ref={wrapRef}
        className="relative h-[200vh] sm:h-[220vh] lg:h-[240vh] xl:h-[260vh]"
      >
        <div
          ref={stageRef}
          className="flex h-svh flex-col justify-center bg-[#0A0A0A]"
        >
          <div className="container-max section-pad w-full pt-20 sm:pt-24 lg:pt-24">
            <p className="section-label">Project process</p>
            <h2 className="font-display mt-4 max-w-2xl text-3xl leading-[1.08] font-semibold tracking-tight sm:text-4xl xl:text-5xl 2xl:text-[3.25rem]">
              How we get there
            </h2>

            <div className="mt-5 h-px w-full overflow-hidden bg-[var(--line)] xl:mt-6">
              <div
                ref={progressRef}
                className="h-full bg-foreground"
                style={{ width: "0%" }}
              />
            </div>

            <div className="mt-10 grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-5 sm:mt-12 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-8 xl:mt-14 xl:grid-cols-[10rem_minmax(0,1fr)] xl:gap-12">
              <div>
                <p className="font-mono text-xs tracking-[0.18em] text-muted uppercase">
                  Step
                </p>
                <p className="font-display mt-3 text-4xl font-semibold tracking-tight sm:text-5xl xl:text-6xl">
                  {processSteps[active]?.step}
                </p>
              </div>

              <div className="relative min-h-[150px] sm:min-h-[160px] xl:min-h-[180px]">
                {processSteps.map((step, i) => (
                  <div
                    key={step.step}
                    ref={(el) => {
                      panelsRef.current[i] = el;
                    }}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
                    <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl xl:text-5xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted sm:mt-4 xl:mt-5 xl:text-lg">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
