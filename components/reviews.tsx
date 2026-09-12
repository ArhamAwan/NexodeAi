"use client";

import { reviews } from "@/content/site";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export function Reviews() {
  return (
    <section id="reviews" className="section-pad border-t border-[var(--line)] py-20 md:py-28">
      <div className="container-max">
        <Reveal>
          <p className="section-label">Client stories</p>
          <h2 className="font-display mt-5 text-3xl leading-[1.08] font-semibold tracking-tight md:text-5xl">
            Real words
          </h2>
        </Reveal>

        <Stagger className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <article className="flex h-full flex-col border-t border-[var(--line)] pt-8">
                <blockquote className="font-display text-xl leading-snug tracking-tight md:text-2xl">
                  “{review.quote}”
                </blockquote>
                <div className="mt-auto pt-10">
                  <p className="text-sm font-medium">{review.name}</p>
                  <p className="mt-1 font-mono text-[11px] tracking-wider text-muted uppercase">
                    {review.role}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
