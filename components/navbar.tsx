"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { navLinks, siteConfig } from "@/content/site";
import { LogoMark } from "@/components/logo-mark";
import { trackCta } from "@/lib/analytics";

type NavbarProps = {
  minimal?: boolean;
  onBookCall?: () => void;
  onStartProject?: () => void;
};

function getActiveSectionHref(): string | null {
  const probe = window.innerHeight * 0.28;
  let current: string | null = null;

  for (const link of navLinks) {
    const id = link.href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) continue;
    // Once a section's top has crossed the probe line, it becomes active
    // until the next section does. Works with tall / pinned sections.
    if (el.getBoundingClientRect().top <= probe) {
      current = link.href;
    }
  }

  return current;
}

export function Navbar({
  minimal = false,
  onBookCall,
  onStartProject,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: which nav section owns the probe line
  useEffect(() => {
    if (minimal) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      setActiveHref(getActiveSectionHref());
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    // Sections may mount after navbar (pins, etc.)
    const boot = window.setTimeout(update, 200);

    return () => {
      window.clearTimeout(boot);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [minimal]);

  // Slide rectangle to the active link
  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const nav = navRef.current;
    if (!indicator || !nav || minimal) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const idx = navLinks.findIndex((l) => l.href === activeHref);
    const link = idx >= 0 ? linkRefs.current[idx] : null;

    if (!link || !activeHref) {
      gsap.to(indicator, {
        opacity: 0,
        duration: reduced ? 0 : 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
      return;
    }

    const x = link.offsetLeft;
    const width = link.offsetWidth;

    const props = {
      x,
      width,
      yPercent: -50,
      opacity: 1,
      overwrite: "auto" as const,
    };

    if (!readyRef.current || reduced) {
      gsap.set(indicator, props);
      readyRef.current = true;
      return;
    }

    gsap.to(indicator, {
      ...props,
      duration: 0.4,
      ease: "power3.out",
    });
  }, [activeHref, minimal, scrolled, open]);

  return (
    <header
      className={`nav-glass pointer-events-auto fixed inset-x-3 top-3 z-[100] mx-auto max-w-6xl rounded-2xl border border-white/20 md:inset-x-5 md:top-4 ${
        scrolled || open ? "nav-glass-scrolled" : ""
      } ${open ? "overflow-hidden" : ""}`}
      style={{
        // Inline keeps both standard + -webkit- past Lightning CSS,
        // which otherwise emits only -webkit- (Safari) and drops the
        // unprefixed property Chrome needs.
        backdropFilter: "blur(40px) saturate(1.5)",
        WebkitBackdropFilter: "blur(40px) saturate(1.5)",
      }}
    >
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:h-16 md:px-5 lg:h-[4.25rem]">
        <Link
          href="/"
          className="font-display flex shrink-0 items-center gap-2.5 text-[17px] font-semibold tracking-tight sm:gap-3 sm:text-lg md:text-xl lg:text-[1.35rem]"
          onClick={() => setActiveHref(null)}
        >
          <LogoMark
            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
            size={36}
          />
          <span>{siteConfig.shortName}</span>
        </Link>

        {!minimal ? (
          <>
            <nav
              ref={navRef}
              className="relative hidden items-center gap-1 md:flex"
              aria-label="Primary"
            >
              <span
                ref={indicatorRef}
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-0 z-0 h-8 rounded-md border border-[var(--line-strong)] bg-white/[0.1]"
                style={{ width: 48, opacity: 0 }}
              />
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  href={link.href}
                  className={`relative z-10 px-3 py-1.5 text-[13px] transition-colors md:text-sm ${
                    activeHref === link.href
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                  onClick={() => {
                    trackCta("nav_link", "navbar", { href: link.href });
                    setActiveHref(link.href);
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden shrink-0 md:block">
              <button
                type="button"
                className="btn-primary !px-4 !py-2 text-[13px] md:text-sm"
                data-cta="start_project"
                data-cta-location="navbar"
                onClick={() => {
                  trackCta("start_project", "navbar");
                  onStartProject?.();
                }}
              >
                Start a Project
              </button>
            </div>

            <button
              type="button"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => {
                trackCta("menu_toggle", "navbar", { open: !open });
                setOpen((v) => !v);
              }}
            >
              <div className="flex w-3.5 flex-col gap-1">
                <span
                  className={`h-px bg-foreground transition ${open ? "translate-y-[5px] rotate-45" : ""}`}
                />
                <span
                  className={`h-px bg-foreground transition ${open ? "opacity-0" : ""}`}
                />
                <span
                  className={`h-px bg-foreground transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
                />
              </div>
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn-primary !px-4 !py-2 text-[13px] md:text-sm"
            data-cta="start_project"
            data-cta-location="navbar_minimal"
            onClick={() => {
              trackCta("start_project", "navbar_minimal");
              (onStartProject ?? onBookCall)?.();
            }}
          >
            Start a Project
          </button>
        )}
      </div>

      {!minimal && open ? (
        <div className="border-t border-[var(--line)] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2.5 text-sm ${
                  activeHref === link.href
                    ? "bg-white/[0.08] text-foreground"
                    : "text-muted"
                }`}
                onClick={() => {
                  trackCta("nav_link", "navbar_mobile", { href: link.href });
                  setActiveHref(link.href);
                  setOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="btn-primary mt-3 w-full text-sm"
              data-cta="start_project"
              data-cta-location="navbar_mobile"
              onClick={() => {
                trackCta("start_project", "navbar_mobile");
                setOpen(false);
                onStartProject?.();
              }}
            >
              Start a Project
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
