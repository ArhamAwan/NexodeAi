"use client";

import { siteConfig } from "@/content/site";
import { trackCta } from "@/lib/analytics";

type FooterProps = {
  onCta?: () => void;
};

export function Footer({ onCta }: FooterProps) {
  const social = [
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "X", href: siteConfig.social.x },
    { label: "GitHub", href: siteConfig.social.github },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="border-t border-[var(--line)]">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3">
        <div className="border-b border-[var(--line)] p-6 sm:border-r sm:border-[var(--line)] lg:border-b-0">
          <p className="font-display text-sm font-semibold tracking-[0.06em] uppercase">
            {siteConfig.name}
          </p>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="meta mt-4 block normal-case tracking-normal text-muted hover:text-foreground"
            onClick={() => trackCta("contact_email", "footer")}
          >
            {siteConfig.contactEmail}
          </a>
        </div>

        <div className="border-b border-[var(--line)] p-6 lg:border-r lg:border-b-0 lg:border-[var(--line)]">
          {onCta ? (
            <button
              type="button"
              className="meta hover:text-foreground"
              data-cta="start_project"
              data-cta-location="footer"
              onClick={() => {
                trackCta("start_project", "footer");
                onCta();
              }}
            >
              Start a Project →
            </button>
          ) : (
            <p className="meta">Nexode AI</p>
          )}
          <div className="mt-6 flex flex-wrap gap-5">
            {social.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="meta hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="p-6 sm:col-span-2 lg:col-span-1">
          <p className="meta">© {new Date().getFullYear()}</p>
          <p className="meta mt-4 normal-case tracking-normal">
            Custom web, mobile, and AI products.
          </p>
        </div>
      </div>
    </footer>
  );
}
