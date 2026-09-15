import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Thank you",
  description: "We received your project brief.",
  robots: { index: false, follow: false },
};

type ThankYouProps = {
  searchParams: Promise<{ booked?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const params = await searchParams;
  const booked = params.booked === "1";

  return (
    <main className="flex min-h-[100svh] items-center justify-center overflow-x-clip border-x border-[var(--line)] px-4 py-20 sm:mx-2 sm:py-24 md:mx-3 lg:mx-5">
      <div className="w-full max-w-lg border border-[var(--line)] p-5 text-center sm:p-8 md:p-10">
        <p className="meta">{siteConfig.name}</p>
        <h1 className="font-display mt-4 text-[clamp(1.5rem,5vw,1.875rem)] font-semibold tracking-tight uppercase">
          {booked ? "Your call is booked" : "You're in — check your email"}
        </h1>
        <p className="mt-4 text-[14px] leading-relaxed text-muted normal-case tracking-normal sm:text-[15px]">
          {booked
            ? "Calendly sent your calendar invite and will remind you before the call. We'll also review your brief ahead of time."
            : "We saved your brief and emailed a confirmation. Book a call anytime if you haven't already — it's the fastest way to get started."}
        </p>
        <div className="mt-8 flex w-full flex-col gap-0 sm:flex-row sm:justify-center">
          <Link href="/?funnel=1" className="btn-primary btn-stack-mobile">
            {booked ? "Back home" : "Start a project"}
          </Link>
          <Link href="/" className="btn-secondary btn-stack-mobile">
            Return to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
