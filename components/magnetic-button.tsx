"use client";

import {
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { trackCta } from "@/lib/analytics";

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
  /** Meta / GA CTA id — fires pixel on click */
  cta?: string;
  /** Where the button lives (hero, navbar, mega, …) */
  ctaLocation?: string;
};

export function MagneticButton({
  children,
  className = "",
  variant = "primary",
  cta,
  ctaLocation = "unknown",
  onMouseMove,
  onMouseLeave,
  onClick,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: x * 0.12,
      y: y * 0.16,
      duration: 0.35,
      ease: "power3.out",
    });
    onMouseMove?.(e);
  };

  const handleLeave = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
    onMouseLeave?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (cta) trackCta(cta, ctaLocation);
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      data-cta={cta}
      data-cta-location={ctaLocation}
      {...props}
    >
      {children}
    </button>
  );
}
