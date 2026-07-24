"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Award, CalendarDays, Clock, Languages, Star } from "lucide-react";

import { StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { SmartImage } from "@/components/smart-image";
import { Button } from "@/components/ui/button";
import { doctors } from "@/lib/data";

export function Doctors() {
  return (
    <section id="doctors" className="relative section-padding overflow-hidden bg-surface-muted/60">
      <div aria-hidden className="halo -left-32 top-24 size-[30rem] bg-accent-500/12" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Our Doctors"
          title={
            <>
              Consultants who <span className="text-gradient">know your name</span>
            </>
          }
          description="320+ specialists, each with a named care coordinator so you never repeat your history twice."
        />

        <StaggerGroup stagger={0.08} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <StaggerItem key={doctor.id}>
              <motion.article
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="group glass gradient-ring relative flex h-full flex-col overflow-hidden rounded-4xl"
              >
                {/* Portrait */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <SmartImage
                    src={doctor.image}
                    alt={`Portrait of ${doctor.name}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    fallbackLabel={doctor.department}
                    className="object-cover transition-transform duration-700 group-hover:scale-107"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/25 to-transparent" />

                  {/* Top badges */}
                  <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-3 py-1 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                      {doctor.department}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-1 text-[0.7rem] font-bold text-amber-950">
                      <Star className="size-3 fill-current" />
                      {doctor.rating}
                    </span>
                  </div>

                  {/* Identity + expanding detail panel */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-display text-xl font-bold text-white">{doctor.name}</h3>
                    <p className="mt-1 text-xs text-white/70">{doctor.qualification}</p>

                    <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <ul className="mt-3 flex flex-col gap-2 text-xs text-white/75">
                          <li className="flex items-center gap-2">
                            <Award className="size-3.5 shrink-0 text-primary-300" />
                            {doctor.experience} years experience · {doctor.reviews.toLocaleString()} reviews
                          </li>
                          <li className="flex items-center gap-2">
                            <Clock className="size-3.5 shrink-0 text-accent-300" />
                            {doctor.availability}
                          </li>
                          <li className="flex items-center gap-2">
                            <Languages className="size-3.5 shrink-0 text-primary-300" />
                            {doctor.languages.join(" · ")}
                          </li>
                        </ul>

                        <ul className="mt-3 flex flex-wrap gap-1.5">
                          {doctor.focus.map((item) => (
                            <li
                              key={item}
                              className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[0.64rem] font-medium text-white/80 backdrop-blur-sm"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 p-5">
                  <span className="flex flex-col">
                    <span className="text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Next available
                    </span>
                    <span className="text-sm font-bold text-accent-600 dark:text-accent-400">{doctor.nextSlot}</span>
                  </span>

                  <Button asChild size="sm">
                    <Link href="#booking" aria-label={`Book an appointment with ${doctor.name}`}>
                      <CalendarDays className="size-4" />
                      Book
                    </Link>
                  </Button>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
