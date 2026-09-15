"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { about } from "@/content/site";
import { Reveal } from "@/components/motion";

gsap.registerPlugin(ScrollTrigger);

const team = about.team;

function isDesktopMq() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function About() {
  const [active, setActive] = useState(0);
  const [outgoing, setOutgoing] = useState(0);
  const [incoming, setIncoming] = useState(0);
  const [incomingOpacity, setIncomingOpacity] = useState(1);
  const [reduced, setReduced] = useState(false);
  const dossierRefs = useRef<(HTMLElement | null)[]>([]);
  const mobilePageRefs = useRef<(HTMLElement | null)[]>([]);
  const mobileInnerRefs = useRef<(HTMLElement | null)[]>([]);
  const incomingRef = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    incomingRef.current = incoming;
  }, [incoming]);

  // Desktop: ScrollTrigger when each dossier center crosses ~45% viewport
  useEffect(() => {
    if (reduced) return;

    let triggers: ScrollTrigger[] = [];

    const setup = () => {
      triggers.forEach((t) => t.kill());
      triggers = [];

      if (!isDesktopMq()) {
        ScrollTrigger.refresh();
        return;
      }

      dossierRefs.current.forEach((el, i) => {
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 45%",
            end: "bottom 45%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          }),
        );
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    setup();

    const onResize = () => setup();
    window.addEventListener("resize", onResize);
    const mq = window.matchMedia("(min-width: 1024px)");
    mq.addEventListener("change", setup);

    return () => {
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", setup);
      triggers.forEach((t) => t.kill());
    };
  }, [reduced]);

  // Portrait crossfade ~0.35s; name/role/email update with `active` immediately
  useEffect(() => {
    if (reduced) {
      setOutgoing(active);
      setIncoming(active);
      setIncomingOpacity(1);
      return;
    }
    if (active === incomingRef.current) return;

    setOutgoing(incomingRef.current);
    setIncoming(active);
    setIncomingOpacity(0);

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIncomingOpacity(1));
    });

    const settle = window.setTimeout(() => {
      setOutgoing(active);
    }, 350);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(settle);
    };
  }, [active, reduced]);

  // Mobile: sticky pages scrub away (except last)
  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const build = () => {
      ctx?.revert();
      ctx = null;

      if (isDesktopMq()) {
        ScrollTrigger.refresh();
        return;
      }

      // Reduced motion: sticky pages only, no scrub
      if (reduced) {
        mobileInnerRefs.current.forEach((inner) => {
          if (inner) gsap.set(inner, { clearProps: "all" });
        });
        ScrollTrigger.refresh();
        return;
      }

      const pages = mobilePageRefs.current;
      const inners = mobileInnerRefs.current;

      ctx = gsap.context(() => {
        inners.forEach((inner, i) => {
          if (!inner || !pages[i]) return;
          gsap.set(inner, {
            y: 0,
            scale: 1,
            opacity: 1,
            transformOrigin: "50% 40%",
          });

          // Last page holds — no exit scrub
          if (i === team.length - 1) return;

          gsap.to(inner, {
            y: -80,
            scale: 0.92,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: pages[i],
              start: "top top",
              end: () => `+=${window.innerHeight}`,
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });
        });
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    build();

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const mq = window.matchMedia("(min-width: 1024px)");
    mq.addEventListener("change", build);

    return () => {
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", build);
      ctx?.revert();
    };
  }, [reduced]);

  const stageOut = team[outgoing] ?? team[0];
  const stageIn = team[incoming] ?? team[0];
  const label = team[active] ?? team[0];

  return (
    <section id="about" className="border-b border-[var(--line)]">
      <div className="border-b border-[var(--line)] px-4 py-8 sm:px-6 md:px-8">
        <Reveal>
          <div>
            <p className="meta">About</p>
            <h2 className="font-display mt-3 max-w-3xl text-3xl font-semibold tracking-tight uppercase sm:text-4xl md:text-5xl">
              Meet the people behind Nexode
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted normal-case tracking-normal md:text-base">
              {about.studio}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Mobile / tablet — sticky pages that flow away */}
      <div className="relative lg:hidden">
        {team.map((person, i) => (
          <div
            key={person.name}
            ref={(el) => {
              mobilePageRefs.current[i] = el;
            }}
            className="sticky top-[calc(3.25rem+env(safe-area-inset-top))] flex h-[calc(100svh-3.25rem-env(safe-area-inset-top))] max-h-[100dvh] items-center overflow-hidden bg-black"
            style={{ zIndex: i + 1 }}
          >
            <div
              ref={(el) => {
                mobileInnerRefs.current[i] = el;
              }}
              className="container-max w-full px-4 py-6 sm:px-6 sm:py-8"
            >
              <div className="relative mx-auto aspect-square w-full max-w-[min(22rem,42svh)] overflow-hidden border border-[var(--line)] bg-black sm:max-w-[min(24rem,48svh)]">
                <Image
                  src={person.image}
                  alt={person.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover object-top"
                  priority={i === 0}
                />
              </div>
              <p className="mt-4 font-mono text-xs tracking-[0.18em] text-muted">
                ({String(i + 1).padStart(2, "0")}/
                {String(team.length).padStart(2, "0")})
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                {person.name}
              </h3>
              <p className="mt-1.5 font-mono text-[11px] tracking-wider text-muted uppercase">
                {person.role}
              </p>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-muted sm:text-[15px]">
                {person.bio}
              </p>
              <a
                href={`mailto:${person.email}`}
                className="mt-3 inline-block text-[13px] text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {person.email}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop — sticky portrait stage + scrolling dossiers */}
      <div className="px-4 sm:px-6 md:px-8">
        <div className="relative mt-0 hidden grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-0 pb-0 lg:grid">
          <div className="sticky top-24 self-start border-r border-[var(--line)] py-10 pr-6 xl:py-14 xl:pr-10">
            <div className="relative aspect-square w-full overflow-hidden border border-[var(--line)] bg-black">
              <Image
                src={stageOut.image}
                alt={stageOut.name}
                fill
                sizes="40vw"
                priority
                className="object-cover object-top"
              />
              <Image
                src={stageIn.image}
                alt={stageIn.name}
                fill
                sizes="40vw"
                className="object-cover object-top transition-opacity duration-[350ms] ease-out"
                style={{ opacity: incomingOpacity }}
              />
            </div>
            <div className="mt-7">
              <p className="font-mono text-xs tracking-[0.18em] text-muted">
                ({String(active + 1).padStart(2, "0")}/
                {String(team.length).padStart(2, "0")})
              </p>
              <h3 className="font-display mt-3 text-3xl font-semibold tracking-tight xl:text-4xl">
                {label.name}
              </h3>
              <p className="mt-2 font-mono text-[11px] tracking-wider text-muted uppercase">
                {label.role}
              </p>
              <a
                href={`mailto:${label.email}`}
                className="mt-5 inline-block text-[13px] text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {label.email}
              </a>
            </div>
          </div>

          <div className="flex flex-col pl-10 pt-4">
            {team.map((person, i) => {
              const isActive = reduced || active === i;
              return (
                <article
                  key={person.name}
                  ref={(el) => {
                    dossierRefs.current[i] = el;
                  }}
                  className="border-t border-[var(--line)] py-14 transition-opacity duration-300 last:border-b xl:py-16"
                  style={{ opacity: isActive ? 1 : 0.35 }}
                >
                  <p className="font-mono text-xs tracking-[0.18em] text-muted">
                    ({String(i + 1).padStart(2, "0")})
                  </p>
                  <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight xl:text-3xl">
                    {person.name}
                  </h3>
                  <p className="mt-2 font-mono text-[11px] tracking-wider text-muted uppercase">
                    {person.role}
                  </p>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted xl:text-base">
                    {person.bio}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
