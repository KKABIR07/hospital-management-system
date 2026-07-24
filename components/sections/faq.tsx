"use client";

import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";

import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { toDialable } from "@/lib/utils";

export function Faq() {
  return (
    <section id="faq" className="relative section-padding overflow-hidden">
      <div aria-hidden className="halo -left-40 top-1/3 size-[28rem] bg-accent-500/12" />

      <div className="container-page relative z-10">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left column */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Frequently Asked"
              title={
                <>
                  Answers before <span className="text-gradient">you ask</span>
                </>
              }
              description="Can't find what you need? Our patient support team replies within minutes, day or night."
            />

            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="outline" size="md">
                <a href={`tel:${toDialable(siteConfig.frontDeskPhone)}`}>
                  <Phone className="size-4" />
                  Call front desk
                </a>
              </Button>
              <Button asChild variant="soft" size="md">
                <Link href="#contact">
                  <MessageCircle className="size-4" />
                  Message us
                </Link>
              </Button>
            </Reveal>
          </div>

          {/* Accordion */}
          <Reveal delay={0.1}>
            <Accordion type="single" collapsible defaultValue={faqs[0].id} className="flex flex-col gap-3">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>
                    <span className="flex flex-col gap-1.5">
                      <span className="text-[0.64rem] font-bold uppercase tracking-[0.16em] text-primary-500">
                        {faq.category}
                      </span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
