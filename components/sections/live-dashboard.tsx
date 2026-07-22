"use client";

import { motion } from "framer-motion";
import { Radio } from "lucide-react";

import { AnimatedCounter } from "@/components/animated-counter";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { dashboardMetrics } from "@/lib/data";
import { cn } from "@/lib/utils";

export function LiveDashboard() {
  return (
    <section id="dashboard" className="relative section-padding overflow-hidden">
      <div aria-hidden className="halo -left-40 top-20 size-[30rem] bg-primary-500/12" />
      <div aria-hidden className="halo -right-40 bottom-10 size-[26rem] bg-accent-500/12" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Live Hospital Dashboard"
          title={
            <>
              Real capacity, <span className="text-gradient">updated every minute</span>
            </>
          }
          description="We publish what most hospitals hide. Check bed availability, emergency load and waiting times before you leave home."
        />

        <Reveal delay={0.1} className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-4 py-1.5 text-xs font-semibold text-accent-600 dark:text-accent-300">
            <Radio className="size-3.5 animate-pulse" />
            Synced live · last update just now
          </span>
        </Reveal>

        <StaggerGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.map((metric, index) => (
            <StaggerItem
              key={metric.id}
              className={cn(
                // First tile spans wide on large screens for visual rhythm
                index === 0 && "lg:col-span-2",
                index === 6 && "sm:col-span-2 lg:col-span-2",
              )}
            >
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="glass gradient-ring group relative h-full overflow-hidden rounded-4xl p-6"
              >
                {/* Hover wash */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-[0.08]",
                    metric.gradient,
                  )}
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-500 group-hover:scale-110",
                      metric.gradient,
                    )}
                  >
                    <metric.icon className="size-6" />
                  </span>

                  {metric.live && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/12 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-accent-600 dark:text-accent-300">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
                      </span>
                      Live
                    </span>
                  )}
                </div>

                <p className="relative mt-6 font-display text-4xl font-bold tracking-tight tabular-nums">
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                    decimals={metric.decimals}
                    duration={1600 + index * 120}
                  />
                </p>

                <p className="relative mt-1.5 text-sm font-semibold">{metric.label}</p>
                {metric.hint && (
                  <p className="relative mt-1 text-xs text-muted-foreground">{metric.hint}</p>
                )}

                {/* Capacity bar for percentage tiles */}
                {metric.suffix === "%" && (
                  <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/8">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      className={cn("block h-full rounded-full bg-gradient-to-r", metric.gradient)}
                    />
                  </div>
                )}
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
