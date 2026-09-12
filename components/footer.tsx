"use client";

import { siteConfig } from "@/content/site";
import { trackCta } from "@/lib/analytics";

type FooterProps = {
  onCta?: () => void;
};

/** Slim site footer — intake lives in the floating funnel, not here. */
export function Footer({ onCta }: FooterProps) {
  const social = [
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "X", href: siteConfig.social.x },
    { label: "GitHub", href: siteConfig.social.github },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="section-pad border-t border-[var(--line)] py-10 md:py-12">
      <div className="container-max flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <p className="font-display text-sm font-semibold tracking-tight">
            {siteConfig.name}
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-sm text-muted transition-colors hover:text-foreground"
            onClick={() => trackCta("contact_email", "footer")}
          >
            {siteConfig.contactEmail}
          </a>
          {onCta ? (
            <button
              type="button"
              className="text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
              data-cta="start_project"
              data-cta-location="footer"
              onClick={() => {
                trackCta("start_project", "footer");
                onCta();
              }}
            >
              Start a Project
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm text-muted">
          {social.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
          <p className="font-mono text-[11px] tracking-wider uppercase">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
