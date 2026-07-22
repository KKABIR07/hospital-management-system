"use client";

import { motion } from "framer-motion";

import { StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { features } from "@/lib/data";
import { cn } from "@/lib/utils";

export function WhyChooseUs() {
  return (
    <section id="why-us" className="relative section-padding overflow-hidden bg-surface-muted/60">
      <div aria-hidden className="halo -left-40 top-1/3 size-[28rem] bg-accent-500/12" />
      <div aria-hidden className="halo -right-40 bottom-1/4 size-[28rem] bg-primary-500/12" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={
            <>
              Six reasons families keep <span className="text-gradient">coming back</span>
            </>
          }
          description="Clinical excellence is the baseline. What patients remember is how quickly they were seen and how clearly things were explained."
        />

        <StaggerGroup stagger={0.08} className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature.id}>
              <motion.article
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="glass gradient-ring group relative flex h-full gap-5 overflow-hidden rounded-4xl p-7"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-[0.07]",
                    feature.gradient,
                  )}
                />

                <span className="relative shrink-0">
                  <motion.span
                    whileHover={{ scale: 1.08, rotate: -6 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18 }}
                    className={cn(
                      "grid size-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                      feature.gradient,
                    )}
                  >
                    <feature.icon className="size-7" />
                  </motion.span>
                  {/* Ripple on hover */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-all duration-700 group-hover:scale-150 group-hover:opacity-0 group-hover:blur-xl",
                      feature.gradient,
                    )}
                  />
                </span>

                <div className="relative">
                  <h3 className="font-display text-lg font-bold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
