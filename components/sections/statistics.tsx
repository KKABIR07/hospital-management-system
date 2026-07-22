"use client";

import { motion } from "framer-motion";

import { AnimatedCounter } from "@/components/animated-counter";
import { StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { statistics } from "@/lib/data";

export function Statistics() {
  return (
    <section id="impact" className="relative overflow-hidden bg-slate-950 py-20 md:py-28">
      <div aria-hidden className="halo -left-32 top-0 size-[30rem] bg-primary-500/25" />
      <div aria-hidden className="halo -right-32 bottom-0 size-[30rem] bg-accent-500/20" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Our Impact"
          title={
            <>
              Thirty-five years, <span className="text-gradient">measured honestly</span>
            </>
          }
          description="Audited annually and published in our public quality report."
          onDark
        />

        <StaggerGroup stagger={0.09} className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {statistics.map((stat) => (
            <StaggerItem key={stat.id}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="glass-dark group relative flex h-full flex-col items-center gap-3 overflow-hidden rounded-4xl p-7 text-center"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-primary-300 transition-all duration-500 group-hover:scale-110 group-hover:bg-white/15">
                  <stat.icon className="size-6" />
                </span>

                <p className="font-display text-3xl font-bold tracking-tight text-white tabular-nums lg:text-4xl">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    compact={stat.value >= 10000}
                    duration={2200}
                  />
                </p>

                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{stat.label}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
