"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export function Services() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const getScroll = () => Math.max(0, track.scrollWidth - pin.clientWidth);

      gsap.to(track, {
        x: () => -getScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () =>
            `+=${Math.max(
              getScroll() * (isMobile() ? 1.05 : 1.15),
              window.innerHeight * (isMobile() ? 1.35 : 1.8),
            )}`,
          pin: true,
          scrub: isMobile() ? 0.5 : 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    }, pin);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <section id="services" className="relative z-10 border-t border-[var(--line)]">
      <div
        ref={pinRef}
        className="relative h-svh overflow-hidden bg-[#0A0A0A]"
      >
        <div className="flex h-full flex-col justify-center py-20 sm:py-24 lg:py-28">
          <div className="container-max section-pad shrink-0">
            <p className="section-label">Capabilities</p>
            <h2 className="font-display mt-4 max-w-2xl text-3xl leading-[1.08] font-semibold tracking-tight sm:text-4xl xl:text-5xl 2xl:text-[3.25rem]">
              What we can help with
            </h2>
          </div>

          <div className="mt-8 sm:mt-10 xl:mt-12">
            <div
              ref={trackRef}
              className="flex will-change-transform gap-4 pl-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] pr-8 sm:gap-5 sm:pl-[max(1.25rem,calc((100vw-72rem)/2+2rem))] sm:pr-12 xl:gap-6 xl:pl-[max(1.25rem,calc((100vw-72rem)/2+3rem))] xl:pr-16"
            >
              {services.map((service, index) => (
                <article
                  key={service.title}
                  className="flex h-[min(300px,46svh)] w-[min(78vw,340px)] shrink-0 flex-col justify-between border border-[var(--line)] bg-[#111] p-6 sm:h-[min(340px,42svh)] sm:w-[min(68vw,400px)] sm:p-7 xl:h-[min(380px,44svh)] xl:w-[min(56vw,480px)] xl:p-9 2xl:w-[500px]"
                >
                  <p className="font-mono text-xs tracking-[0.18em] text-muted">
                    ({String(index + 1).padStart(2, "0")})
                  </p>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl xl:text-3xl 2xl:text-4xl">
                      {service.title}
                    </h3>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-muted sm:mt-4 sm:text-[15px]">
                      {service.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
