"use client";

import { useEffect, useId, useRef } from "react";
import type { CaseStudy } from "@/content/site";
import { trackCta } from "@/lib/analytics";

type CaseStudyModalProps = {
  study: CaseStudy | null;
  onClose: () => void;
  onBookCall: () => void;
};

export function CaseStudyModal({
  study,
  onClose,
  onBookCall,
}: CaseStudyModalProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!study) return;
    trackCta("view_case_study", "portfolio", {
      content_name: study.title,
      content_ids: study.id,
    });
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [study, onClose]);

  if (!study) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-3 sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="surface max-h-[min(90vh,90dvh)] w-full max-w-lg overflow-y-auto rounded-none border border-[var(--line)] bg-black p-5 sm:p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="font-display text-2xl font-semibold tracking-tight">
              {study.title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] tracking-wider text-muted uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="border border-[var(--line)] px-3 py-1 text-xs text-muted hover:text-foreground"
            onClick={onClose}
            aria-label="Close case study"
          >
            Esc
          </button>
        </div>

        <div className="mt-8 space-y-6 text-[15px] leading-relaxed">
          <div>
            <p className="font-mono text-[11px] tracking-wider text-muted uppercase">
              Problem
            </p>
            <p className="mt-2 text-muted">{study.problem}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wider text-muted uppercase">
              Solution
            </p>
            <p className="mt-2 text-muted">{study.solution}</p>
          </div>
          <div>
            <p className="font-mono text-[11px] tracking-wider text-muted uppercase">
              Outcome
            </p>
            <p className="mt-2 text-muted">{study.outcome}</p>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary mt-8 w-full"
          onClick={() => {
            trackCta("book_call", "case_study", {
              content_name: study.title,
            });
            onClose();
            onBookCall();
          }}
        >
          Book a Call
        </button>
      </div>
    </div>
  );
}
