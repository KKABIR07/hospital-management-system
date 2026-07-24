"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  Layers,
  MessageCircle,
  Plug,
  Server,
} from "lucide-react";

import { Logo } from "@/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion-primitives";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/data";
import { siteConfig } from "@/lib/site-config";
import { cn, toDialable } from "@/lib/utils";
import type { Service } from "@/types";

const accentMap = {
  primary: {
    badge: "default" as const,
    text: "text-primary-600 dark:text-primary-300",
    dot: "bg-primary-500",
    chip: "border-primary-500/20 bg-primary-500/10 text-primary-700 dark:text-primary-300",
    softBtn: "text-primary-600 dark:text-primary-300",
  },
  accent: {
    badge: "accent" as const,
    text: "text-accent-600 dark:text-accent-300",
    dot: "bg-accent-500",
    chip: "border-accent-500/20 bg-accent-500/10 text-accent-700 dark:text-accent-300",
    softBtn: "text-accent-600 dark:text-accent-300",
  },
  danger: {
    badge: "danger" as const,
    text: "text-danger-600 dark:text-danger-400",
    dot: "bg-danger-500",
    chip: "border-danger-500/20 bg-danger-500/10 text-danger-700 dark:text-danger-400",
    softBtn: "text-danger-600 dark:text-danger-400",
  },
};

const layerCards = [
  { key: "frontend" as const, label: "Frontend", icon: Layers },
  { key: "backend" as const, label: "Backend", icon: Server },
  { key: "integrations" as const, label: "Integrations", icon: Plug },
];

function BulletList({ items, dot }: { items: string[]; dot: string }) {
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white", dot)}>
            <Check className="size-3" strokeWidth={3} />
          </span>
          <span className="text-sm leading-relaxed text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ServicePageView({ slug }: { slug: string }) {
  const index = services.findIndex((item) => item.id === slug);
  const service = services[index] as Service | undefined;
  if (!service) return null;

  const accent = accentMap[service.accent ?? "primary"];
  const Icon = service.icon;
  const emergencyTel = `tel:${toDialable(siteConfig.emergencyPhone)}`;
  const whatsappHref = `https://wa.me/${toDialable(siteConfig.whatsapp).replace("+", "")}?text=${encodeURIComponent(
    `Hello Aurora Health, I have a question about ${service.title}.`,
  )}`;
  const speedFirst = service.emphasis === "speed";
  const related = services.filter((item) => item.id !== service.id).slice(0, 4);

  return (
    <>
      {/* ---------- Focused page header ---------- */}
      <header className="fixed inset-x-0 top-0 z-50 glass border-b border-border/60">
        <nav className="container-page flex items-center justify-between gap-4 py-3" aria-label="Primary">
          <Link href="/" aria-label={`${siteConfig.name} — home`}>
            <Logo />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/#services"
              className="hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              <ArrowLeft className="size-4" />
              All Services
            </Link>
            <a
              href={emergencyTel}
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
              <Link href="/#booking">
                <CalendarDays className="size-4" />
                Book Appointment
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className={cn("halo left-1/2 top-[-8rem] size-[42rem] -translate-x-1/2 opacity-70", accent.dot, "opacity-[0.14]")} />
          </div>

          <div className="container-page">
            {/* Breadcrumb */}
            <Reveal>
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Link href="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
                <ChevronRight className="size-3.5" />
                <Link href="/#services" className="transition-colors hover:text-foreground">
                  Services
                </Link>
                <ChevronRight className="size-3.5" />
                <span className="text-foreground">{service.title}</span>
              </nav>
            </Reveal>

            <div className="mt-8 grid items-start gap-10 lg:grid-cols-[1.35fr_1fr]">
              <div>
                <Reveal delay={0.05}>
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "relative grid size-16 shrink-0 place-items-center rounded-3xl bg-gradient-to-br text-white",
                        "shadow-[0_18px_36px_-14px_rgba(21,101,192,0.6)]",
                        service.gradient,
                      )}
                    >
                      <span className="absolute inset-x-2 top-1.5 h-1/3 rounded-full bg-white/30 blur-[6px]" />
                      <span className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/25" />
                      <Icon className="relative size-8 drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]" />
                    </span>
                    <Badge variant={accent.badge}>
                      <span className="size-1.5 rounded-full bg-current" />
                      Service {index + 1} of {services.length}
                    </Badge>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-balance sm:text-5xl">
                    {service.title}
                  </h1>
                </Reveal>

                {service.tagline && (
                  <Reveal delay={0.14}>
                    <p className={cn("mt-3 font-display text-lg font-semibold sm:text-xl", accent.text)}>
                      {service.tagline}
                    </p>
                  </Reveal>
                )}

                {service.intent && (
                  <Reveal delay={0.18}>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
                      {service.intent}
                    </p>
                  </Reveal>
                )}

                {service.highlights && service.highlights.length > 0 && (
                  <Reveal delay={0.22}>
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {service.highlights.map((chip) => (
                        <li
                          key={chip}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-xs font-semibold",
                            accent.chip,
                          )}
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                )}

                <Reveal delay={0.26}>
                  <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                    {speedFirst ? (
                      <>
                        <Button asChild variant="emergency" size="lg">
                          <a href={emergencyTel}>
                            <span className="relative flex size-2.5">
                              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                              <span className="relative inline-flex size-2.5 rounded-full bg-white" />
                            </span>
                            Emergency Call
                          </a>
                        </Button>
                        <Button asChild variant="glass" size="lg">
                          <Link href="/#booking">
                            <CalendarDays className="size-5" />
                            Book Appointment
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild size="lg">
                          <Link href="/#booking">
                            <CalendarDays className="size-5" />
                            Book Appointment
                          </Link>
                        </Button>
                        <Button asChild variant="glass" size="lg">
                          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="size-5" />
                            Ask a question
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </Reveal>
              </div>

              {/* Summary card */}
              <Reveal delay={0.2} variant="scale">
                <aside className="glass gradient-ring rounded-4xl p-7">
                  <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    At a glance
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/90">{service.description}</p>
                  <dl className="mt-6 flex flex-col gap-4 border-t border-border pt-6 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Page content points</dt>
                      <dd className="font-display font-bold">{service.content?.length ?? 0}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Key features</dt>
                      <dd className="font-display font-bold">{service.features?.length ?? 0}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-muted-foreground">Availability</dt>
                      <dd className={cn("font-display font-bold", accent.text)}>
                        {speedFirst ? "24 × 7" : "By appointment"}
                      </dd>
                    </div>
                  </dl>
                </aside>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Page content + Key features ---------- */}
        <section className="section-padding pt-4">
          <div className="container-page grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="glass h-full rounded-4xl p-8">
                <div className="flex items-center gap-2.5">
                  <span className={cn("size-2 rounded-full", accent.dot)} />
                  <h2 className="font-display text-xl font-bold tracking-tight">On this page</h2>
                </div>
                <div className="mt-6">
                  <BulletList items={service.content ?? []} dot={accent.dot} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="glass h-full rounded-4xl p-8">
                <div className="flex items-center gap-2.5">
                  <span className={cn("size-2 rounded-full", accent.dot)} />
                  <h2 className="font-display text-xl font-bold tracking-tight">Key features</h2>
                </div>
                <div className="mt-6">
                  <BulletList items={service.features ?? []} dot={accent.dot} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- How we build it ---------- */}
        {service.layers && (
          <section className="section-padding pt-0">
            <div className="container-page">
              <Reveal>
                <div className="flex flex-col gap-3">
                  <Badge variant={accent.badge} className="self-start">
                    <span className="size-1.5 rounded-full bg-current" />
                    How we build it
                  </Badge>
                  <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    From page to platform
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Every service shares a common booking engine and notification layer — so this page plugs into the
                    same infrastructure the rest of the hospital already runs on.
                  </p>
                </div>
              </Reveal>

              <StaggerGroup stagger={0.08} className="mt-10 grid gap-5 md:grid-cols-3">
                {layerCards.map(({ key, label, icon: LayerIcon }) => (
                  <StaggerItem key={key}>
                    <div className="glass gradient-ring h-full rounded-3xl p-6">
                      <span className={cn("grid size-11 place-items-center rounded-2xl", accent.chip)}>
                        <LayerIcon className="size-5" />
                      </span>
                      <h3 className="mt-5 font-display text-base font-bold tracking-tight">{label}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                        {service.layers![key]}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </section>
        )}

        {/* ---------- CTA ---------- */}
        <section className="section-padding pt-0">
          <div className="container-page">
            <Reveal variant="scale">
              <div className="relative overflow-hidden rounded-5xl bg-[linear-gradient(120deg,#04121f_0%,#062b45_45%,#065f5b_100%)] p-10 text-center md:p-16">
                <div aria-hidden className={cn("halo left-1/4 top-0 size-[24rem]", accent.dot, "opacity-30")} />
                <div aria-hidden className="halo right-0 bottom-0 size-[22rem] bg-accent-500/20" />
                <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {speedFirst ? "Need help right now?" : `Ready to book ${service.title.toLowerCase()}?`}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white/75">
                    {speedFirst
                      ? "Our line is answered 24 × 7 and an advanced life-support ambulance is dispatched in under 4 minutes on average."
                      : "Our assistant checks live consultant availability while you choose — every slot you see is one you can actually get."}
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" variant={speedFirst ? "emergency" : "primary"}>
                      {speedFirst ? (
                        <a href={emergencyTel}>
                          <span className="relative flex size-2.5">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                            <span className="relative inline-flex size-2.5 rounded-full bg-white" />
                          </span>
                          Emergency Call
                        </a>
                      ) : (
                        <Link href="/#booking">
                          <CalendarDays className="size-5" />
                          Book Appointment
                        </Link>
                      )}
                    </Button>
                    <Button asChild size="lg" variant="glass">
                      <Link href="/#doctors">
                        Meet our doctors
                        <ArrowUpRight className="size-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- Related services ---------- */}
        <section className="section-padding pt-0">
          <div className="container-page">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight">Explore other services</h2>
            </Reveal>
            <StaggerGroup stagger={0.06} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => {
                const RelatedIcon = item.icon;
                return (
                  <StaggerItem key={item.id}>
                    <Link
                      href={`/services/${item.id}`}
                      className="glass gradient-ring group flex h-full flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1.5"
                    >
                      <span
                        className={cn(
                          "grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-white",
                          item.gradient,
                        )}
                      >
                        <RelatedIcon className="size-6" />
                      </span>
                      <h3 className="mt-4 font-display text-base font-bold tracking-tight">{item.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {item.tagline ?? item.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-300">
                        View service
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </section>
      </main>
    </>
  );
}
