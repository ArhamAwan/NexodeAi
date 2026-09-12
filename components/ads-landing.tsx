"use client";

import { useCallback, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Funnel } from "@/components/funnel";
import { Footer } from "@/components/footer";
import { CalendlyModal } from "@/components/calendly-embed";
import { SmoothScroll } from "@/components/smooth-scroll";

type AdsLandingProps = {
  campaign: string;
};

export function AdsLanding({ campaign }: AdsLandingProps) {
  const [calendlyOpen, setCalendlyOpen] = useState(false);

  const openFunnel = useCallback(() => {
    document.getElementById("funnel")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <SmoothScroll>
      <Navbar minimal onBookCall={openFunnel} onStartProject={openFunnel} />
      <main>
        <Hero onPrimary={openFunnel} onSecondary={openFunnel} compact />
        <Funnel
          variant="ads"
          adCampaign={campaign}
          pagePath={`/ads/${campaign}`}
        />
      </main>
      <Footer onCta={openFunnel} />
      <CalendlyModal open={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </SmoothScroll>
  );
}
