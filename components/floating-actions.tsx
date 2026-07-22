"use client";

import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { ArrowUp, Phone } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";
import { toDialable } from "@/lib/utils";

/** Persistent WhatsApp / emergency / back-to-top rail. */
export function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => setVisible(latest > 600));

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {visible && (
          <motion.button
            key="top"
            type="button"
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="glass grid size-12 place-items-center rounded-full text-foreground transition-transform duration-300 hover:-translate-y-1"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={`tel:${toDialable(siteConfig.emergencyPhone)}`}
        aria-label={`Emergency call ${siteConfig.emergencyPhone}`}
        className="group relative grid size-14 place-items-center rounded-full bg-gradient-to-br from-danger-600 to-danger-500 text-white shadow-[0_18px_40px_-14px_rgba(239,68,68,0.9)] transition-transform duration-300 hover:-translate-y-1 md:hidden"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-danger-500/60" />
        <Phone className="relative size-6" />
      </a>

      <a
        href={`https://wa.me/${toDialable(siteConfig.whatsapp).replace("+", "")}?text=${encodeURIComponent(
          "Hello Aurora Health, I'd like to book an appointment.",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative grid size-14 place-items-center rounded-full bg-gradient-to-br from-accent-600 to-accent-500 text-white shadow-[0_18px_40px_-14px_rgba(16,185,129,0.9)] transition-transform duration-300 hover:-translate-y-1"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-accent-500/60" />
        <WhatsAppIcon className="relative size-7" />
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Chat with us
        </span>
      </a>
    </div>
  );
}
