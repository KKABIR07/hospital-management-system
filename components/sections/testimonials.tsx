"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Quote, Star } from "lucide-react";

import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { SmartImage } from "@/components/smart-image";
import { testimonials } from "@/lib/data";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7000;

export function Testimonials() {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((step: number) => {
    setSlide(([current]) => [(current + step + testimonials.length) % testimonials.length, step]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, paginate]);

  const active = testimonials[index];

  return (
    <section id="testimonials" className="relative section-padding overflow-hidden">
      <div aria-hidden className="halo -right-40 top-1/4 size-[30rem] bg-primary-500/12" />
      <div aria-hidden className="halo -left-40 bottom-1/4 size-[26rem] bg-accent-500/12" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Patient Stories"
          title={
            <>
              12,400 reviews. <span className="text-gradient">Here are four.</span>
            </>
          }
          description="Unedited accounts from patients who let us share their treatment and their names."
        />

        <div
          className="relative mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Reveal variant="scale">
            <div className="glass gradient-ring relative overflow-hidden rounded-5xl p-2 sm:p-3">
              <div className="relative min-h-[30rem] sm:min-h-[24rem]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={active.id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction >= 0 ? 60 : -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction >= 0 ? -60 : 60 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="grid gap-6 sm:grid-cols-[minmax(0,17rem)_1fr]"
                  >
                    {/* Portrait / video still */}
                    <div className="relative aspect-4/5 overflow-hidden rounded-4xl sm:aspect-auto">
                      <SmartImage
                        src={active.image}
                        alt={`${active.name}, patient`}
                        fill
                        sizes="(max-width: 640px) 100vw, 17rem"
                        fallbackLabel={active.name}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />

                      {active.hasVideo && (
                        <button
                          type="button"
                          aria-label={`Play ${active.name}'s video testimonial`}
                          className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/18 text-white backdrop-blur-md transition-transform duration-300 hover:scale-110"
                        >
                          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-white/40" />
                          <Play className="relative size-6 fill-current" />
                        </button>
                      )}

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="font-display text-lg font-bold text-white">{active.name}</p>
                        <p className="text-xs text-white/70">{active.location}</p>
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="flex flex-col justify-center gap-5 p-5 sm:p-8">
                      <Quote className="size-10 text-primary-500/30" />

                      <blockquote className="font-display text-lg leading-relaxed text-balance sm:text-xl md:text-2xl">
                        &ldquo;{active.quote}&rdquo;
                      </blockquote>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        <span className="flex gap-0.5" aria-label={`${active.rating} out of 5 stars`}>
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={cn(
                                "size-4",
                                starIndex < active.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30",
                              )}
                            />
                          ))}
                        </span>
                        <span className="rounded-full bg-primary-500/10 px-3.5 py-1.5 text-xs font-semibold text-primary-600 dark:text-primary-300">
                          {active.treatment}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="glass grid size-12 place-items-center rounded-full transition-transform duration-300 hover:-translate-x-0.5 hover:text-primary-600 dark:hover:text-primary-300"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose testimonial">
              {testimonials.map((item, dotIndex) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={dotIndex === index}
                  aria-label={`Testimonial from ${item.name}`}
                  onClick={() => setSlide([dotIndex, dotIndex > index ? 1 : -1])}
                  className={cn(
                    "h-2 rounded-full transition-all duration-400",
                    dotIndex === index
                      ? "w-9 bg-gradient-to-r from-primary-500 to-accent-500"
                      : "w-2 bg-foreground/15 hover:bg-foreground/30",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="glass grid size-12 place-items-center rounded-full transition-transform duration-300 hover:translate-x-0.5 hover:text-primary-600 dark:hover:text-primary-300"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
