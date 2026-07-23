"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { services } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="relative section-padding overflow-hidden">
      <div aria-hidden className="halo left-1/2 top-0 size-[34rem] -translate-x-1/2 bg-primary-500/10" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Hospital Services"
          title={
            <>
              Every specialty under <span className="text-gradient">one roof</span>
            </>
          }
          description="From a midnight emergency to a planned procedure, the same team, the same records, the same standard of care."
        />

        <StaggerGroup stagger={0.07} className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <motion.article
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="glass gradient-ring group relative flex h-full flex-col overflow-hidden rounded-4xl p-7"
              >
                <Link
                  href={`/services/${service.id}`}
                  className="absolute inset-0 z-20"
                  aria-label={`${service.title} — view details`}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-[0.07]",
                    service.gradient,
                  )}
                />

                {/* 3D icon block */}
                <div className="relative mb-6" style={{ perspective: "600px" }}>
                  <motion.span
                    whileHover={{ rotateX: -14, rotateY: 16 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className={cn(
                      "relative grid size-16 place-items-center rounded-3xl bg-gradient-to-br text-white",
                      "shadow-[0_18px_36px_-14px_rgba(21,101,192,0.75)] transition-shadow duration-500 group-hover:shadow-[0_28px_50px_-16px_rgba(21,101,192,0.95)]",
                      service.gradient,
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Top gloss + inner depth give the tile its 3D read */}
                    <span className="absolute inset-x-2 top-1.5 h-1/3 rounded-full bg-white/30 blur-[6px]" />
                    <span className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/25" />
                    <service.icon className="relative size-8 drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]" />
                  </motion.span>

                  {/* Cast shadow */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-2 left-2 h-6 w-12 rounded-full bg-gradient-to-r opacity-40 blur-lg transition-all duration-500 group-hover:w-16 group-hover:opacity-60",
                      service.gradient,
                    )}
                  />
                </div>

                <h3 className="relative font-display text-lg font-bold tracking-tight">{service.title}</h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 opacity-0 transition-all duration-400 group-hover:opacity-100 dark:text-primary-300">
                  Learn more
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
