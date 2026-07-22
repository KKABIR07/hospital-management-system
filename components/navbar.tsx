"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { CalendarDays, Menu, Phone, X } from "lucide-react";

import { Logo } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useActiveSection, useScrolled } from "@/hooks/use-scroll-state";
import { navLinks, siteConfig } from "@/lib/site-config";
import { cn, toDialable } from "@/lib/utils";

const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(24);
  const active = useActiveSection(sectionIds);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-all duration-500",
            scrolled ? "glass border-b border-border/60 py-2.5" : "border-b border-transparent py-4",
          )}
        >
          <nav className="container-page flex items-center justify-between gap-6" aria-label="Primary">
            <Link href="#top" className="shrink-0" aria-label={`${siteConfig.name} — home`}>
              <Logo />
            </Link>

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const id = link.href.replace("#", "");
                const isActive = active === id;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                        isActive ? "text-primary-600 dark:text-primary-300" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-primary-500/10"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${toDialable(siteConfig.emergencyPhone)}`}
                className="hidden items-center gap-2 rounded-full border border-danger-500/30 bg-danger-500/10 px-4 py-2.5 text-sm font-semibold text-danger-600 transition-all duration-300 hover:bg-danger-500 hover:text-white xl:inline-flex dark:text-danger-400 dark:hover:text-white"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-current" />
                </span>
                {siteConfig.emergencyPhone}
              </a>

              <ThemeToggle />

              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="#booking">
                  <CalendarDays className="size-4" />
                  Book Appointment
                </Link>
              </Button>

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="grid size-11 place-items-center rounded-full border border-border bg-surface/70 backdrop-blur-md lg:hidden"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </nav>
        </div>

        {/* Reading progress */}
        <motion.div
          style={{ scaleX: progress }}
          className="h-0.5 origin-left bg-gradient-to-r from-primary-500 via-primary-400 to-accent-500"
        />
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col gap-8 bg-surface p-7 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-full border border-border"
                >
                  <X className="size-5" />
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3.5 font-display text-lg font-semibold transition-colors hover:bg-primary-500/10 hover:text-primary-600 dark:hover:text-primary-300"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="#booking" onClick={() => setOpen(false)}>
                    <CalendarDays className="size-5" />
                    Book Appointment
                  </Link>
                </Button>
                <Button asChild variant="emergency" size="lg" className="w-full">
                  <a href={`tel:${toDialable(siteConfig.emergencyPhone)}`}>
                    <Phone className="size-5" />
                    Emergency Call
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
