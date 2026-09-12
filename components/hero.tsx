"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { hero } from "@/content/site";
import { RotatingHeadlines } from "@/components/rotating-headlines";
import { MagneticButton } from "@/components/magnetic-button";
import { FunnelPanel } from "@/components/funnel-panel";
import { trackCta } from "@/lib/analytics";

const AtmosphereCanvas = dynamic(
  () =>
    import("@/components/scene/atmosphere-canvas").then(
      (m) => m.AtmosphereCanvas,
    ),
  {
    ssr: false,
    loading: () => <div aria-hidden className="absolute inset-0 bg-[#0A0A0A]" />,
  },
);

type HeroProps = {
  onPrimary: () => void;
  onSecondary: () => void;
  compact?: boolean;
};

function SceneFallback() {
  return <div aria-hidden className="absolute inset-0 bg-[#0A0A0A]" />;
}

export function Hero({ onPrimary, onSecondary, compact = false }: HeroProps) {
  const copyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const [showScene, setShowScene] = useState(false);

  // Load WebGL after first paint so mobile network isn't blocked by Three.js
  useEffect(() => {
    const boot = () => setShowScene(true);
    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback(boot, { timeout: 1200 })
        : null;
    const t = window.setTimeout(boot, 350);
    return () => {
      if (idle != null) window.cancelIdleCallback?.(idle);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const nodes = [copyRef.current, panelRef.current, trustRef.current].filter(
      Boolean,
    ) as HTMLElement[];

    const reveal = () => {
      nodes.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    };

    // Never leave hero blank if GSAP is delayed/interrupted on mobile
    const failsafe = window.setTimeout(reveal, 800);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      reveal();
      window.clearTimeout(failsafe);
      return () => window.clearTimeout(failsafe);
    }

    const ctx = gsap.context(() => {
      if (copyRef.current) {
        gsap.fromTo(
          copyRef.current,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            onComplete: () => window.clearTimeout(failsafe),
          },
        );
      }
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            delay: 0.12,
            ease: "power3.out",
          },
        );
      }
      if (trustRef.current) {
        gsap.fromTo(
          trustRef.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.8,
            delay: 0.35,
            ease: "power2.out",
          },
        );
      }
    });

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      reveal();
    };
  }, []);

  if (compact) {
    return (
      <section className="relative flex min-h-[70svh] flex-col justify-center overflow-hidden pt-20 pb-16">
        <div ref={copyRef} className="container-max section-pad relative z-10">
          <div className="max-w-4xl">
            <RotatingHeadlines
              headlines={[
                "Build software that finally matches what you've built.",
                "Ship the product your ambition already promised.",
                "Turn a strong idea into software people trust.",
              ]}
              className="font-display text-[1.85rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl"
            />
          </div>
          <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-muted md:text-base">
            {hero.subheadline}
          </p>
          <div className="mt-10">
            <MagneticButton onClick={onPrimary} cta="book_call" ctaLocation="hero_compact">
              Book a Call
            </MagneticButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      data-funnel-zone="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-16"
    >
      {showScene ? <AtmosphereCanvas /> : <SceneFallback />}

      <div className="container-max section-pad relative z-10 flex flex-1 flex-col justify-center py-6 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_min(380px,36vw)] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-14 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <div ref={copyRef} className="flex min-w-0 flex-col">
            <div className="relative max-w-3xl 2xl:max-w-4xl">
              <RotatingHeadlines
                headlines={hero.headlines}
                className="font-display text-[1.65rem] leading-[1.08] font-semibold tracking-[-0.03em] text-balance sm:text-4xl md:text-5xl lg:text-[clamp(2.4rem,3.2vw,3.35rem)]"
              />
            </div>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted sm:mt-6 md:text-base">
              {hero.subheadline}
            </p>

            <div className="mt-7 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center">
              <MagneticButton
                onClick={onPrimary}
                cta="start_project"
                ctaLocation="hero"
              >
                {hero.primaryCta}
              </MagneticButton>
              <button
                type="button"
                className="text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
                data-cta="book_call"
                data-cta-location="hero"
                onClick={() => {
                  trackCta("book_call", "hero");
                  onSecondary();
                }}
              >
                {hero.secondaryCta} →
              </button>
            </div>
          </div>

          <aside
            ref={panelRef}
            className="glass-panel hidden w-full justify-self-stretch border border-white/20 lg:block"
            style={{
              // Slightly stronger blur; denser fill lives on .glass-panel
              backdropFilter: "blur(28px) saturate(1.2)",
              WebkitBackdropFilter: "blur(28px) saturate(1.2)",
            }}
            aria-label="Project intake"
          >
            <div className="max-h-[min(640px,calc(100svh-11rem))] overflow-y-auto p-5 xl:p-6">
              <FunnelPanel
                variant="full"
                pagePath="/"
                compact
                rootId="funnel-landing"
                className="outline-none"
              />
            </div>
          </aside>
        </div>

        <div
          ref={trustRef}
          className="mt-10 flex flex-wrap gap-8 border-t border-[var(--line)] pt-7 sm:mt-12 sm:gap-10 sm:pt-8 md:gap-14 lg:mt-14"
        >
          {hero.trust.map((item) => (
            <div key={item.label}>
              <p className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                {item.value}
              </p>
              <p className="mt-2 max-w-[12rem] text-[13px] text-muted">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
