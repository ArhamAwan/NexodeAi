"use client";

import { useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Funnel } from "@/components/funnel";
import { Footer } from "@/components/footer";
import { SmoothScroll } from "@/components/smooth-scroll";

type AdsLandingProps = {
  campaign: string;
};

export function AdsLanding({ campaign }: AdsLandingProps) {
  const openFunnel = useCallback(() => {
    document
      .getElementById("funnel-bottom")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <SmoothScroll>
      <div className="min-h-screen overflow-x-clip border-x border-[var(--line)] sm:mx-2 md:mx-3 lg:mx-5">
        <Navbar minimal onBookCall={openFunnel} onStartProject={openFunnel} />
        <main>
          <Hero onPrimary={openFunnel} onSecondary={openFunnel} compact />
          <Funnel
            variant="ads"
            adCampaign={campaign}
            pagePath={`/ads/${campaign}`}
            rootId="funnel-bottom"
          />
        </main>
        <Footer onCta={openFunnel} />
      </div>
    </SmoothScroll>
  );
}
