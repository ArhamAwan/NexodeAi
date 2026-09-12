"use client";

import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CapabilityStrip } from "@/components/capability-strip";
import { Narrative } from "@/components/narrative";
import { ScrollZoom } from "@/components/scroll-zoom";
import { Portfolio } from "@/components/portfolio";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { About } from "@/components/about";
import { Reviews } from "@/components/reviews";
import { MegaCta } from "@/components/mega-cta";
import { Funnel } from "@/components/funnel";
import { Footer } from "@/components/footer";
import { CalendlyModal } from "@/components/calendly-embed";
import { SmoothScroll } from "@/components/smooth-scroll";
import { FloatingFunnel } from "@/components/floating-funnel";
import {
  FunnelProvider,
  useFunnelControllerRef,
} from "@/components/funnel-context";

export function HomePage() {
  const [calendlyOpen, setCalendlyOpen] = useState(false);
  const { controller, register } = useFunnelControllerRef();

  const openFunnel = useCallback(() => {
    controller.open();
  }, [controller]);

  const openCalendly = useCallback(() => setCalendlyOpen(true), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("funnel") === "1" || window.location.hash === "#funnel") {
      const t = window.setTimeout(() => controller.open(), 400);
      return () => window.clearTimeout(t);
    }
  }, [controller]);

  return (
    <FunnelProvider controller={controller}>
      <SmoothScroll>
        <Navbar onBookCall={openCalendly} onStartProject={openFunnel} />
        <main>
          <Hero onPrimary={openFunnel} onSecondary={openCalendly} />
          <CapabilityStrip />
          <Narrative />
          <ScrollZoom />
          <Portfolio onBookCall={openCalendly} />
          <Services />
          <Process />
          <About />
          <Reviews />
          <MegaCta onCta={openFunnel} />
          <Funnel variant="full" pagePath="/" rootId="funnel-bottom" />
          <Footer onCta={openFunnel} />
        </main>
        <FloatingFunnel register={register} />
        <CalendlyModal
          open={calendlyOpen}
          onClose={() => setCalendlyOpen(false)}
        />
      </SmoothScroll>
    </FunnelProvider>
  );
}
