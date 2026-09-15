"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { siteConfig } from "@/content/site";

type CalendlyEmbedProps = {
  prefill?: {
    name?: string;
    email?: string;
  };
  onEventScheduled?: (payload: {
    startTime?: string;
    endTime?: string;
  }) => void;
  className?: string;
};

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string };
      }) => void;
    };
  }
}

export function CalendlyEmbed({
  prefill,
  onEventScheduled,
  className,
}: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (
        typeof e.data === "object" &&
        e.data?.event === "calendly.event_scheduled"
      ) {
        const invitee = e.data?.payload?.invitee;
        const event = e.data?.payload?.event;
        onEventScheduled?.({
          startTime: event?.start_time ?? invitee?.start_time,
          endTime: event?.end_time ?? invitee?.end_time,
        });
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onEventScheduled]);

  const init = () => {
    if (!containerRef.current || !window.Calendly || initialized.current) return;
    containerRef.current.innerHTML = "";
    window.Calendly.initInlineWidget({
      url: siteConfig.calendlyUrl,
      parentElement: containerRef.current,
      prefill: {
        name: prefill?.name,
        email: prefill?.email,
      },
    });
    initialized.current = true;
  };

  useEffect(() => {
    initialized.current = false;
    if (window.Calendly) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill?.name, prefill?.email, siteConfig.calendlyUrl]);

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={init}
      />
      <div
        ref={containerRef}
        className={className ?? "calendly-inline-widget min-h-[650px] w-full"}
        data-url={siteConfig.calendlyUrl}
      />
    </>
  );
}

type CalendlyModalProps = {
  open: boolean;
  onClose: () => void;
  prefill?: { name?: string; email?: string };
  onEventScheduled?: CalendlyEmbedProps["onEventScheduled"];
};

export function CalendlyModal({
  open,
  onClose,
  prefill,
  onEventScheduled,
}: CalendlyModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/70 p-3 pb-[env(safe-area-inset-bottom)] sm:items-center sm:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Book a call"
        className="surface max-h-[min(90vh,90dvh)] w-full max-w-2xl overflow-y-auto rounded-none border border-[var(--line)] bg-black p-4 md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight">Book a Call</h2>
          <button
            type="button"
            className="border border-[var(--line)] px-3 py-1 text-sm text-muted hover:text-foreground"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <CalendlyEmbed
          prefill={prefill}
          onEventScheduled={(payload) => {
            onEventScheduled?.(payload);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
