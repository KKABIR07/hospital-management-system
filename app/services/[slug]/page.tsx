import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/floating-actions";
import { ServicePageView } from "@/components/service-page-view";
import { services } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";

type Params = { slug: string };

/** Pre-render all eight service pages at build time. */
export function generateStaticParams(): Params[] {
  return services.map((service) => ({ slug: service.id }));
}

/** Only the known service slugs are valid — everything else is a 404. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.id === slug);

  if (!service) return {};

  const title = `${service.title} — ${service.tagline ?? "Hospital Services"}`;
  const description = service.intent ?? service.description;

  return {
    title,
    description,
    alternates: { canonical: `/services/${service.id}` },
    openGraph: {
      type: "article",
      url: `${siteConfig.url}/services/${service.id}`,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.id === slug);

  if (!service) notFound();

  return (
    <>
      <ServicePageView slug={service.id} />
      <Footer />
      <FloatingActions />
    </>
  );
}
