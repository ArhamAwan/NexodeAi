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
    <main className="section-pad flex min-h-screen items-center justify-center py-24">
      <div className="surface max-w-lg p-8 text-center md:p-10">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
          {siteConfig.name}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight">
          {booked ? "Your call is booked" : "You’re in — check your email"}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          {booked
            ? "Calendly sent your calendar invite and will remind you before the call. We’ll also review your brief ahead of time."
            : "We saved your brief and emailed a confirmation. Book a call anytime if you haven’t already — it’s the fastest way to get started."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/?funnel=1" className="btn-primary">
            {booked ? "Back home" : "Start a project"}
          </Link>
          <Link href="/" className="btn-secondary">
            Return to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
