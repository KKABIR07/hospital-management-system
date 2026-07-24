"use client";

import { motion } from "framer-motion";
import { Ambulance, Phone, Siren } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { toDialable } from "@/lib/utils";

export function EmergencyBanner() {
  return (
    <section aria-labelledby="emergency-heading" className="relative overflow-hidden">
      <div className="relative bg-gradient-to-r from-danger-700 via-danger-600 to-danger-500">
        {/* Pulsing light sweep */}
        <motion.div
          aria-hidden
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.35),transparent_55%)]"
        />
        <motion.div
          aria-hidden
          animate={{ x: ["-30%", "130%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent"
        />

        <div className="container-page relative z-10 flex flex-col items-center gap-7 py-12 text-center lg:flex-row lg:justify-between lg:py-14 lg:text-left">
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:gap-6">
            {/* Floating ambulance */}
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              className="relative grid size-20 shrink-0 place-items-center rounded-3xl border border-white/25 bg-white/12 text-white backdrop-blur-md"
            >
              <span className="absolute inset-0 animate-pulse-ring rounded-3xl bg-white/30" />
              <Ambulance className="relative size-10" />
            </motion.span>

            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                <Siren className="size-3.5" />
                Emergency Response
              </span>
              <h2
                id="emergency-heading"
                className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
              >
                Need Emergency Care?
              </h2>
              <p className="mt-2 text-base font-medium text-white/85 sm:text-lg">
                Call Now — Available 24 × 7 · Ambulance dispatched in under 4 minutes
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="glass"
              className="border-white/30 bg-white text-danger-600 hover:bg-white"
            >
              <a href={`tel:${toDialable(siteConfig.emergencyPhone)}`}>
                <Phone className="size-5" />
                {siteConfig.emergencyPhone}
              </a>
            </Button>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
              Toll free · Always answered
            </span>
          </div>
        </div>

        {/* Heartbeat line */}
        <svg
          aria-hidden
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-8 w-full text-white/25"
        >
          <motion.path
            d="M0 20 H240 l14 -14 l16 28 l14 -14 H520 l14 -14 l16 28 l14 -14 H800 l14 -14 l16 28 l14 -14 H1200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </section>
  );
}
