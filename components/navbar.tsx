"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    if (el.getBoundingClientRect().top <= probe) current = link.href;
  }
  return current;
}

/** Portal-style cell grid navigation — hamburger below lg, full bar at lg+. */
export function Navbar({
  minimal = false,
  onBookCall,
  onStartProject,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

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
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [minimal]);

  // Close mobile menu when crossing to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-[100] border-b border-[var(--line)] bg-black pt-[env(safe-area-inset-top)]">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-[var(--line)] lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="grid-rule-y flex min-w-0 items-center gap-2 px-3 py-3 sm:gap-2.5 sm:px-4 lg:px-5"
          onClick={() => setActiveHref(null)}
        >
          <LogoMark className="h-6 w-6 shrink-0" size={24} />
          <span className="font-display truncate text-sm font-semibold tracking-[0.04em] uppercase sm:text-[15px]">
            {siteConfig.shortName}
          </span>
        </Link>

        {!minimal ? (
          <>
            <nav
              className="hidden items-center justify-center gap-0 lg:flex"
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`meta border-l border-[var(--line)] px-4 py-3 transition-colors last:border-r xl:px-5 ${
                    activeHref === link.href
                      ? "bg-foreground text-background"
                      : "hover:bg-foreground hover:text-background"
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

            <div className="hidden items-stretch justify-end lg:flex">
              <button
                type="button"
                className="meta border-l border-[var(--line)] px-3 py-3 transition-colors hover:bg-foreground hover:text-background xl:px-4"
                data-cta="book_call"
                data-cta-location="navbar"
                onClick={() => {
                  trackCta("book_call", "navbar");
                  onBookCall?.();
                }}
              >
                Book a Call
              </button>
              <button
                type="button"
                className="meta bg-foreground px-3 py-3 text-background transition-colors hover:bg-transparent hover:text-foreground xl:px-4"
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

            <div className="flex items-stretch justify-end lg:hidden">
              <button
                type="button"
                className="meta border-l border-[var(--line)] bg-foreground px-3 py-3 text-background transition-colors hover:bg-transparent hover:text-foreground sm:px-4"
                data-cta="start_project"
                data-cta-location="navbar_mobile_bar"
                onClick={() => {
                  trackCta("start_project", "navbar_mobile_bar");
                  onStartProject?.();
                }}
              >
                Start
              </button>
              <button
                type="button"
                className="meta flex items-center justify-center border-l border-[var(--line)] px-4 py-3"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => {
                  trackCta("menu_toggle", "navbar", { open: !open });
                  setOpen((v) => !v);
                }}
              >
                {open ? "Close" : "Menu"}
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            className="meta justify-self-end bg-foreground px-3 py-3 text-background sm:px-4"
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
        <div className="border-b border-[var(--line)] lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`meta block border-b border-[var(--line)] px-4 py-3.5 ${
                activeHref === link.href ? "bg-foreground text-background" : ""
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
            className="meta block w-full border-b border-[var(--line)] px-4 py-3.5 text-left"
            data-cta="book_call"
            data-cta-location="navbar_mobile"
            onClick={() => {
              trackCta("book_call", "navbar_mobile");
              setOpen(false);
              onBookCall?.();
            }}
          >
            Book a Call
          </button>
          <button
            type="button"
            className="meta block w-full bg-foreground px-4 py-3.5 text-left text-background"
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
      ) : null}
    </header>
  );
}
