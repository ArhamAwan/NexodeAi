"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function reducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    // Failsafe: never stay invisible if ScrollTrigger misses on mobile
    const failsafe = window.setTimeout(show, 1600);

    if (reducedMotion()) {
      show();
      window.clearTimeout(failsafe);
      return () => window.clearTimeout(failsafe);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
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
  }, [delay, y]);

  // Visible by default — animation only enhances
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll<HTMLElement>("[data-stagger-item]");
    const show = () => {
      items.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
    };

    const failsafe = window.setTimeout(show, 1800);

    if (reducedMotion()) {
      show();
      window.clearTimeout(failsafe);
      return () => window.clearTimeout(failsafe);
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
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
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-stagger-item className={className}>
      {children}
    </div>
  );
}

export function SplitWords({
  text,
  className,
  as: Tag = "h1",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) return;

    const words = el.querySelectorAll(".split-word");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { y: "105%", opacity: 0 },
        {
          y: "0%",
          opacity: 1,
          duration: 0.95,
          stagger: 0.028,
          ease: "power4.out",
          delay: 0.12,
        },
      );
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    <Tag ref={ref as never} className={className}>
      {text.split(" ").map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-1 align-bottom"
        >
          <span className="split-word inline-block will-change-transform">
            {word}&nbsp;
          </span>
        </span>
      ))}
    </Tag>
  );
}
