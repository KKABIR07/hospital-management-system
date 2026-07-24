import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Phone, Siren } from "lucide-react";

import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { toDialable } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div aria-hidden className="halo -left-32 top-10 size-[30rem] bg-primary-500/15" />
      <div aria-hidden className="halo -right-32 bottom-10 size-[26rem] bg-accent-500/15" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <Logo />

        <p className="font-display text-[6rem] font-bold leading-none tracking-tight text-gradient sm:text-[8rem]">
          404
        </p>

        <h1 className="max-w-md font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          We couldn&apos;t find that page
        </h1>
        <p className="max-w-md text-muted-foreground">
          The link may be outdated or the page may have moved. Let&apos;s get you back to care.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="size-5" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="emergency" size="lg">
            <a href={`tel:${toDialable(siteConfig.emergencyPhone)}`}>
              <Siren className="size-5" />
              Emergency Call
            </a>
          </Button>
        </div>

        <a
          href={`tel:${toDialable(siteConfig.frontDeskPhone)}`}
          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary-600 dark:hover:text-primary-300"
        >
          <Phone className="size-4" />
          Front desk · {siteConfig.frontDeskPhone}
        </a>
      </div>
    </main>
  );
}
