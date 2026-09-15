"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { hero } from "@/content/site";
import { FunnelPanel } from "@/components/funnel-panel";
import { RotatingHeadlines } from "@/components/rotating-headlines";
import { trackCta } from "@/lib/analytics";

type HeroProps = {
  onPrimary: () => void;
  onSecondary: () => void;
  compact?: boolean;
};

function TunnelPreview({
  className = "",
  strong = false,
}: {
  className?: string;
  strong?: boolean;
}) {
  const rings = strong
    ? [18, 32, 46, 60, 76, 94]
    : [28, 42, 56, 70, 84];
  return (
    <div className={`tunnel ${className}`} aria-hidden>
      {rings.map((w, i) => (
        <div
          key={w}
          className={`tunnel-ring ${strong ? "tunnel-ring-strong" : ""}`}
          style={
            {
              "--ring-w": `${w}%`,
              "--ring-z": `${(i - 2) * -40}px`,
              "--ring-s": 1,
              opacity: strong ? 0.45 + i * 0.09 : 0.35 + i * 0.12,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function PortalBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
    >
      <svg
        className="portal-tunnel h-[185%] w-[185%] max-w-none opacity-90 sm:h-[150%] sm:w-[150%] lg:h-[125%] lg:w-[125%] lg:opacity-100"
        viewBox="0 0 480 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[40, 80, 125, 175, 230, 295, 360].map((r, i) => (
          <rect
            key={r}
            className="portal-ring"
            style={{ animationDelay: `${i * 0.45}s` }}
            x={240 - r * 0.7}
            y={280 - r}
            width={r * 1.4}
            height={r * 2}
            rx={r}
            stroke="rgba(232,232,232,0.5)"
            strokeWidth="1.2"
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * Portal split hero.
 * Mobile: same copy column as desktop (rings behind); form via sheet.
 * Desktop: copy left | intake form + rings right.
 */
export function Hero({ onPrimary, onSecondary, compact = false }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodes = root.querySelectorAll<HTMLElement>("[data-hero-in]");
    const reveal = () => {
      nodes.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    };

    const failsafe = window.setTimeout(reveal, 900);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      reveal();
      window.clearTimeout(failsafe);
      return () => window.clearTimeout(failsafe);
    }

    const ctx = gsap.context(() => {
      gsap.from(nodes, {
        y: 16,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
        onComplete: () => window.clearTimeout(failsafe),
      });
      gsap.from(root.querySelectorAll(".portal-ring, .tunnel-ring"), {
        scale: 0.72,
        opacity: 0,
        duration: 1.1,
        stagger: 0.06,
        ease: "power3.out",
        delay: 0.1,
        clearProps: "opacity,transform",
      });
    }, root);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      reveal();
    };
  }, []);

  const headlineLines = compact ? hero.adsHeadlines : hero.headlines;

  return (
    <section
      ref={rootRef}
      data-funnel-zone="hero"
      className={`border-b border-[var(--line)] ${
        compact ? "min-h-[auto] sm:min-h-[70svh]" : "lg:min-h-[88svh]"
      }`}
    >
      <div
        className={`grid min-h-[inherit] grid-cols-1 ${
          compact ? "" : "lg:grid-cols-2 lg:min-h-[88svh]"
        }`}
      >
        <div
          className={`relative flex min-w-0 flex-col justify-between overflow-x-clip border-b border-[var(--line)] p-4 sm:p-8 lg:border-r lg:border-b-0 lg:min-h-[88svh] lg:p-10 ${
            compact
              ? "sm:min-h-[70svh]"
              : "min-h-[calc(100svh-3.5rem)] lg:min-h-[88svh]"
          }`}
        >
          {/* Mobile — rings behind the copy fold */}
          {!compact ? <PortalBackdrop className="lg:hidden" /> : null}

          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-[25%] -left-[40%] hidden h-[75vmin] w-[75vmin] rounded-full bg-foreground opacity-20 lg:block"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-[22%] right-[18%] hidden text-muted lg:block"
          >
            +
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-[48%] right-[8%] hidden text-muted lg:block"
          >
            +
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute top-[68%] right-[28%] hidden text-muted lg:block"
          >
            +
          </span>

          <p data-hero-in className="meta relative z-10">
            Studio · Web · Mobile · AI
          </p>

          <div data-hero-in className="relative z-10 mt-10 w-full max-w-xl lg:mt-0">
            <RotatingHeadlines
              headlines={headlineLines}
              intervalMs={4800}
              className="font-display w-full text-[clamp(1.65rem,6.5vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.03em] uppercase lg:text-[clamp(1.85rem,4.2vw,3.25rem)]"
            />
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted normal-case tracking-normal">
              {hero.subheadline}
            </p>
            <div className="mt-8 flex w-full flex-col gap-0 sm:w-auto sm:flex-row sm:flex-wrap">
              <button
                type="button"
                className="btn-primary btn-stack-mobile"
                data-cta="start_project"
                data-cta-location={compact ? "hero_compact" : "hero"}
                onClick={() => {
                  trackCta("start_project", compact ? "hero_compact" : "hero");
                  onPrimary();
                }}
              >
                Start a Project
              </button>
              {!compact ? (
                <button
                  type="button"
                  className="btn-secondary btn-stack-mobile"
                  data-cta="book_call"
                  data-cta-location="hero"
                  onClick={() => {
                    trackCta("book_call", "hero");
                    onSecondary();
                  }}
                >
                  Book a Call
                </button>
              ) : null}
            </div>
          </div>

          {!compact ? (
            <div
              data-hero-in
              className="relative z-10 mt-12 flex gap-8 border-t border-[var(--line)] pt-6 sm:gap-10 lg:mt-0"
            >
              {hero.trust.map((item) => (
                <div key={item.label}>
                  <p className="font-display text-2xl font-semibold tracking-tight uppercase md:text-3xl">
                    {item.value}
                  </p>
                  <p className="meta mt-2 max-w-[11rem] normal-case tracking-normal">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative z-10 mt-10" />
          )}
        </div>

        {compact ? (
          <div className="relative min-h-[32svh] overflow-hidden bg-black sm:min-h-[36svh]">
            <TunnelPreview />
            <p className="meta absolute right-4 bottom-4 z-10">NX-01</p>
          </div>
        ) : (
          <aside
            data-hero-in
            className="relative hidden min-h-[88svh] flex-col items-center justify-center overflow-hidden bg-black p-5 lg:flex xl:p-8"
            aria-label="Project intake"
          >
            <PortalBackdrop />

            <div className="relative z-10 w-full max-w-[min(400px,100%)] max-h-[min(640px,calc(100svh-7rem))] overflow-y-auto border border-[var(--line)] bg-black/90 p-4 xl:p-6">
              <FunnelPanel
                variant="full"
                pagePath="/"
                compact
                rootId="funnel-landing"
                className="outline-none"
              />
            </div>
            <p className="meta absolute right-4 bottom-4 z-10">NX-01</p>
          </aside>
        )}
      </div>
    </section>
  );
}
