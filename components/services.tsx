"use client";

import { services } from "@/content/site";
import { Reveal } from "@/components/motion";

/** Services as grid cells — type only. */
export function Services() {
  return (
    <section id="services" className="border-b border-[var(--line)]">
      <div className="grid-rule-x px-4 py-8 sm:px-6 md:px-8">
        <Reveal>
          <p className="meta">Services</p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight uppercase sm:text-4xl md:text-5xl">
            What we build
          </h2>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2">
        {services.map((service, index) => (
          <div
            key={service.title}
            className={`grid-rule-x p-6 sm:p-8 ${
              index % 2 === 0 ? "sm:grid-rule-y" : ""
            }`}
          >
            <p className="meta">({String(index + 1).padStart(2, "0")})</p>
            <h3 className="font-display mt-6 text-xl font-semibold tracking-tight uppercase sm:text-2xl">
              {service.title}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-muted normal-case tracking-normal">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
