"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, ChevronDown, ShieldPlus, Star } from "lucide-react";

import { SmartImage } from "@/components/smart-image";
import { Button } from "@/components/ui/button";
import { accreditations, heroStats } from "@/lib/data";
import { heroVideoSources, images } from "@/lib/images";
import { siteConfig } from "@/lib/site-config";
import { cn, toDialable } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const toneStyles = {
  primary: "text-primary-300",
  accent: "text-accent-300",
  danger: "text-danger-400",
} as const;

/** Desktop anchor positions for the floating glass cards. */
const cardPositions = [
  "lg:left-[2%] lg:top-[24%]",
  "lg:right-[3%] lg:top-[18%]",
  "lg:left-[4%] lg:bottom-[20%]",
  "lg:right-[5%] lg:bottom-[26%]",
];

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 lg:pt-24">
      {/* ---------- Background ---------- */}
      <div className="absolute inset-0 -z-20">
        {/* Animated gradient base — also the fallback when no video is present */}
        <div className="absolute inset-0 bg-[linear-gradient(125deg,#04121f_0%,#062b45_35%,#065f5b_75%,#04121f_100%)]" />
        <motion.div
          aria-hidden
          animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.12, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 top-10 size-[38rem] rounded-full bg-primary-500/30 blur-[120px]"
        />
        <motion.div
          aria-hidden
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-24 bottom-0 size-[34rem] rounded-full bg-accent-500/25 blur-[120px]"
        />

        {/* Poster photograph sits above the gradient, video above that */}
        <div className="absolute inset-0 opacity-45">
          <SmartImage
            src={images.hero.poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={images.hero.poster}
          aria-hidden
          className="absolute inset-0 size-full object-cover"
        >
          {heroVideoSources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>

        {/* Readability overlays */}
        <div className="absolute inset-0 bg-slate-950/62" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,transparent_0%,rgba(2,8,18,0.65)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* ---------- Floating glass cards ---------- */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {heroStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.14, duration: 0.75, ease: EASE }}
            className={cn("absolute", cardPositions[index])}
          >
            <motion.div
              animate={{ y: [0, index % 2 === 0 ? -16 : 14, 0] }}
              transition={{ duration: 6.5 + index * 0.9, repeat: Infinity, ease: "easeInOut" }}
              className="glass-dark flex w-56 items-center gap-3.5 rounded-3xl p-4"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/10">
                <stat.icon className={cn("size-5", toneStyles[stat.tone])} />
              </span>
              <span className="flex flex-col">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/55">
                  {stat.label}
                </span>
                <span className="font-display text-xl font-bold text-white">{stat.value}</span>
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* ---------- Content ---------- */}
      <div className="container-page relative z-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-md"
          >
            <ShieldPlus className="size-4 text-accent-300" />
            JCI Accredited · 35 Years of Care
            <span className="mx-1 h-3 w-px bg-white/25" />
            <Star className="size-3.5 fill-amber-300 text-amber-300" />
            4.9 / 5 from 12,400+ patients
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.85, ease: EASE }}
            className="mt-7 font-display text-[2.6rem] font-bold leading-[1.05] tracking-tight text-balance text-white sm:text-6xl lg:text-7xl"
          >
            Compassion Meets{" "}
            <span className="bg-gradient-to-r from-primary-300 via-primary-200 to-accent-300 bg-clip-text text-transparent">
              Advanced Healthcare
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-base font-medium text-white/80 sm:text-lg"
          >
            <span>24/7 Emergency</span>
            <span className="size-1.5 rounded-full bg-accent-400" />
            <span>Expert Doctors</span>
            <span className="size-1.5 rounded-full bg-primary-400" />
            <span>Trusted Care</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
            className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Button asChild size="lg">
              <Link href="#booking">
                <CalendarDays className="size-5" />
                Book Appointment
              </Link>
            </Button>
            <Button asChild variant="emergency" size="lg">
              <a href={`tel:${toDialable(siteConfig.emergencyPhone)}`}>
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-white" />
                </span>
                Emergency Call
              </a>
            </Button>
          </motion.div>

          {/* Mobile / tablet stat strip */}
          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.8, ease: EASE }}
            className="mt-12 grid w-full grid-cols-2 gap-3 lg:hidden"
          >
            {heroStats.map((stat) => (
              <li key={stat.id} className="glass-dark flex items-center gap-3 rounded-2xl p-3.5 text-left">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10">
                  <stat.icon className={cn("size-4", toneStyles[stat.tone])} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/55">
                    {stat.label}
                  </span>
                  <span className="font-display text-base font-bold text-white">{stat.value}</span>
                </span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* ---------- Accreditation marquee ---------- */}
      <div className="absolute inset-x-0 bottom-0 z-10 hidden overflow-hidden border-t border-white/10 bg-slate-950/40 py-4 backdrop-blur-md lg:block">
        <div className="flex w-max animate-marquee gap-12 pr-12">
          {[...accreditations, ...accreditations].map((item, index) => (
            <span
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-white/45"
            >
              <item.icon className="size-4 text-primary-300" />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#dashboard"
        aria-label="Scroll to live hospital dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-24 left-1/2 z-10 hidden -translate-x-1/2 text-white/55 transition-colors hover:text-white lg:block"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="grid size-11 place-items-center rounded-full border border-white/20"
        >
          <ChevronDown className="size-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
