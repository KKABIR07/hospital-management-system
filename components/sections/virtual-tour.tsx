"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Play, Video } from "lucide-react";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { SmartImage } from "@/components/smart-image";
import { tourStops } from "@/lib/data";
import { cn } from "@/lib/utils";

export function VirtualTour() {
  const [activeId, setActiveId] = useState(tourStops[0].id);
  const active = tourStops.find((stop) => stop.id === activeId) ?? tourStops[0];

  return (
    <section id="tour" className="relative section-padding overflow-hidden">
      <div aria-hidden className="halo -right-32 top-20 size-[30rem] bg-primary-500/12" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Virtual Hospital Tour"
          title={
            <>
              Walk through before <span className="text-gradient">you walk in</span>
            </>
          }
          description="Knowing the space lowers the anxiety. Explore our theatres, wards and imaging suites in full 360°."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* ---------- Large preview ---------- */}
          <Reveal variant="scale" className="lg:sticky lg:top-28 lg:self-start">
            <div className="group relative aspect-[16/11] overflow-hidden rounded-5xl shadow-lift">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <SmartImage
                    src={active.image}
                    alt={active.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    fallbackLabel={active.title}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

              {/* Play control */}
              <button
                type="button"
                aria-label={`Play the ${active.title} virtual tour`}
                className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/25"
              >
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/40" />
                <Play className="relative size-7 fill-current" />
              </button>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                    <Video className="size-3.5" />
                    360° Tour
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">{active.title}</h3>
                  <p className="mt-1.5 max-w-md text-sm text-white/75">{active.description}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/12 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                  <Clock className="size-3.5" />
                  {active.duration}
                </span>
              </div>
            </div>
          </Reveal>

          {/* ---------- Tour list ---------- */}
          <StaggerGroup stagger={0.06} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {tourStops.map((stop) => {
              const isActive = stop.id === active.id;

              return (
                <StaggerItem key={stop.id}>
                  <motion.button
                    type="button"
                    onClick={() => setActiveId(stop.id)}
                    onMouseEnter={() => setActiveId(stop.id)}
                    whileHover={{ x: 4 }}
                    aria-pressed={isActive}
                    className={cn(
                      "glass gradient-ring group flex w-full items-center gap-4 rounded-3xl p-3.5 text-left transition-all duration-400",
                      isActive && "shadow-[0_24px_50px_-24px_rgba(21,101,192,0.7)]",
                    )}
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                      <SmartImage
                        src={stop.image}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <span
                        className={cn(
                          "absolute inset-0 grid place-items-center bg-slate-950/45 text-white transition-opacity duration-300",
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                        )}
                      >
                        <Play className="size-4 fill-current" />
                      </span>
                    </span>

                    <span className="flex min-w-0 flex-1 flex-col">
                      <span
                        className={cn(
                          "truncate font-display text-sm font-bold tracking-tight transition-colors",
                          isActive && "text-primary-600 dark:text-primary-300",
                        )}
                      >
                        {stop.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">{stop.description}</span>
                    </span>

                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">{stop.duration}</span>
                  </motion.button>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
