import type { Metadata } from "next";
import { AdsLanding } from "@/components/ads-landing";
import { siteConfig } from "@/content/site";

type AdsPageProps = {
  params: Promise<{ campaign: string }>;
};

export async function generateMetadata({
  params,
}: AdsPageProps): Promise<Metadata> {
  const { campaign } = await params;
  return {
    title: `Let’s build — ${campaign}`,
    description: `Talk to ${siteConfig.name} about your project.`,
    robots: { index: false, follow: false },
  };
}

export default async function AdsCampaignPage({ params }: AdsPageProps) {
  const { campaign } = await params;
  return <AdsLanding campaign={campaign} />;
}
