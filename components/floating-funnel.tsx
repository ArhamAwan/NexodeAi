"use client";

/**
 * Registers funnel open/focus for nav + CTAs.
 * Desktop: focuses hero form or scrolls to bottom form.
 * Mobile: opens a sheet (no fixed floating chip — CTAs open it).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { FunnelPanel } from "@/components/funnel-panel";

type FloatingFunnelProps = {
  register: (api: { open: () => void; focus: () => void }) => void;
};

function heroInView() {
  const hero = document.querySelector('[data-funnel-zone="hero"]');
  if (!hero) return false;
  const rect = hero.getBoundingClientRect();
  return rect.bottom > 120;
}

export function FloatingFunnel({ register }: FloatingFunnelProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const focusLanding = useCallback(() => {
    document.getElementById("funnel-landing")?.focus({ preventScroll: true });
  }, []);

  const scrollToBottom = useCallback(() => {
    document
      .getElementById("funnel-bottom")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const open = useCallback(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop) {
      if (heroInView()) focusLanding();
      else scrollToBottom();
      return;
    }

    if (heroInView()) setSheetOpen(true);
    else scrollToBottom();
  }, [focusLanding, scrollToBottom]);

  useEffect(() => {
    register({ open, focus: focusLanding });
  }, [register, open, focusLanding]);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  if (!sheetOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end bg-black/70 lg:hidden"
      role="presentation"
      onClick={() => setSheetOpen(false)}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Start a project"
        tabIndex={-1}
        className="flex max-h-[92vh] w-full flex-col border-t border-[var(--line)] bg-[#111] outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
          <p className="font-display text-sm font-semibold">Start a project</p>
          <button
            type="button"
            className="border border-[var(--line)] px-3 py-1 text-xs text-muted"
            onClick={() => setSheetOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <FunnelPanel
            variant="full"
            pagePath="/"
            compact
            rootId="funnel-landing-sheet"
            className="outline-none"
          />
        </div>
      </div>
    </div>
  );
}
