"use client";

import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";

import { StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { SmartImage } from "@/components/smart-image";
import { galleryImages } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Gallery() {
  return (
    <section id="gallery" className="relative section-padding overflow-hidden bg-surface-muted/60">
      <div aria-hidden className="halo left-1/2 top-10 size-[32rem] -translate-x-1/2 bg-primary-500/10" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Hospital Gallery"
          title={
            <>
              A look inside <span className="text-gradient">Aurora Health</span>
            </>
          }
          description="Real spaces, photographed as they are — no staging, no stock imagery."
        />

        <StaggerGroup
          stagger={0.07}
          className="mt-16 grid auto-rows-[13rem] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[15rem]"
        >
          {galleryImages.map((item) => (
            <StaggerItem key={item.id} className={cn("h-full", item.span)}>
              <motion.figure
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group relative h-full overflow-hidden rounded-4xl shadow-lift"
              >
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  fallbackLabel={item.title}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />

                <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-white/20 bg-white/12 text-white opacity-0 backdrop-blur-md transition-all duration-400 group-hover:opacity-100 group-hover:scale-105">
                  <Maximize2 className="size-4" />
                </span>

                <figcaption className="absolute inset-x-0 bottom-0 translate-y-1.5 p-5 transition-transform duration-500 group-hover:translate-y-0">
                  <span className="font-display text-lg font-bold text-white">{item.title}</span>
                  <span className="mt-1.5 block h-0.5 w-0 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-500 group-hover:w-14" />
                </figcaption>
              </motion.figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
