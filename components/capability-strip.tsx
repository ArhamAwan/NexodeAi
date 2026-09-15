"use client";

import { capabilityStrip } from "@/content/site";

const bandA = [
  ...capabilityStrip,
  "Real businesses",
  "Real software",
  "Real impact",
];
const bandB = [
  "Ship the product",
  "Web · Mobile · AI",
  "Brief to production",
  "Nexode AI",
  "Custom builds",
];

/** Dual bordered marquee bands — Portal language. */
export function CapabilityStrip() {
  const rowA = [...bandA, ...bandA];
  const rowB = [...bandB, ...bandB];

  return (
    <div className="border-b border-[var(--line)]">
      <div className="overflow-hidden border-b border-[var(--line)] py-3">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap px-4">
          {rowA.map((item, i) => (
            <span key={`a-${item}-${i}`} className="meta text-foreground">
              {item}
              <span className="ml-8 text-muted">///</span>
            </span>
          ))}
        </div>
      </div>
      <div className="overflow-hidden py-3">
        <div className="marquee-track-reverse flex w-max gap-8 whitespace-nowrap px-4">
          {rowB.map((item, i) => (
            <span key={`b-${item}-${i}`} className="meta text-muted">
              {item}
              <span className="ml-8 text-foreground/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
