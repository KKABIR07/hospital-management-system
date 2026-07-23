"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send, Siren } from "lucide-react";

import { WhatsAppIcon } from "@/components/icons";
import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { departments } from "@/lib/data";
import { fullAddress, siteConfig } from "@/lib/site-config";
import { toDialable } from "@/lib/utils";

type FormStatus = "idle" | "sending" | "sent" | "error";

const DEFAULT_ERROR = "Something went wrong. Please call our front desk.";

export function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setFeedback(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        setFieldErrors(data.errors ?? {});
        setFeedback(data.message ?? DEFAULT_ERROR);
        setStatus("error");
        return;
      }

      form.reset();
      setFeedback(data.message ?? "Thank you — a patient coordinator will call you shortly.");
      setStatus("sent");
    } catch {
      setFeedback(DEFAULT_ERROR);
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative section-padding overflow-hidden">
      <div aria-hidden className="halo -right-40 top-20 size-[30rem] bg-primary-500/12" />
      <div aria-hidden className="halo -left-40 bottom-20 size-[26rem] bg-accent-500/12" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="Contact Us"
          title={
            <>
              We&apos;re here, <span className="text-gradient">around the clock</span>
            </>
          }
          description="Reach the right desk directly — no switchboard maze, no hold music."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* ---------- Details ---------- */}
          <div className="flex flex-col gap-5">
            <Reveal>
              <div className="glass gradient-ring grid gap-4 rounded-4xl p-7 sm:grid-cols-2">
                <ContactTile
                  icon={<Siren className="size-5" />}
                  label="Emergency 24×7"
                  value={siteConfig.emergencyPhone}
                  href={`tel:${toDialable(siteConfig.emergencyPhone)}`}
                  tone="danger"
                />
                <ContactTile
                  icon={<Phone className="size-5" />}
                  label="Front Desk"
                  value={siteConfig.frontDeskPhone}
                  href={`tel:${toDialable(siteConfig.frontDeskPhone)}`}
                  tone="primary"
                />
                <ContactTile
                  icon={<WhatsAppIcon className="size-5" />}
                  label="WhatsApp"
                  value={siteConfig.whatsapp}
                  href={`https://wa.me/${toDialable(siteConfig.whatsapp).replace("+", "")}`}
                  tone="accent"
                  external
                />
                <ContactTile
                  icon={<Mail className="size-5" />}
                  label="Email"
                  value={siteConfig.email}
                  href={`mailto:${siteConfig.email}`}
                  tone="primary"
                />
                <div className="sm:col-span-2">
                  <ContactTile
                    icon={<MapPin className="size-5" />}
                    label="Address"
                    value={fullAddress}
                    href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
                    tone="accent"
                    external
                  />
                </div>
              </div>
            </Reveal>

            {/* Opening hours */}
            <Reveal delay={0.08}>
              <div className="glass gradient-ring rounded-4xl p-7">
                <h3 className="flex items-center gap-2.5 font-display text-base font-bold tracking-tight">
                  <Clock className="size-5 text-primary-500" />
                  Opening Hours
                </h3>
                <dl className="mt-5 flex flex-col divide-y divide-border">
                  {siteConfig.hours.map((entry) => (
                    <div key={entry.label} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <dt className="text-muted-foreground">{entry.label}</dt>
                      <dd className="text-right font-semibold">{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* Map */}
            <Reveal delay={0.14}>
              <div className="glass gradient-ring overflow-hidden rounded-4xl p-2">
                <iframe
                  src={siteConfig.mapEmbed}
                  title={`Map showing ${siteConfig.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  className="h-72 w-full rounded-3xl border-0 grayscale-[0.25] transition-all duration-500 hover:grayscale-0"
                />
              </div>
            </Reveal>
          </div>

          {/* ---------- Form ---------- */}
          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="glass gradient-ring flex h-full flex-col gap-5 rounded-5xl p-7 sm:p-9"
            >
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">Send us a message</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  We reply to every enquiry within 2 hours during opening hours.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Jordan Ellis"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  />
                  <FieldError id="name-error" message={fieldErrors.name} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+1 555 010 2233"
                    aria-invalid={Boolean(fieldErrors.phone)}
                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                  />
                  <FieldError id="phone-error" message={fieldErrors.phone} />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                <FieldError id="email-error" message={fieldErrors.email} />
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <select
                  id="department"
                  name="department"
                  defaultValue=""
                  className="w-full rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground shadow-sm outline-none backdrop-blur-sm transition-all duration-300 hover:border-primary-500/40 focus:border-primary-500 focus:bg-surface focus:shadow-[0_0_0_4px_rgba(21,101,192,0.14)]"
                >
                  <option value="" disabled>
                    Select a department
                  </option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                  <option value="other">Something else</option>
                </select>
              </div>

              <div className="flex-1">
                <Label htmlFor="message">How can we help?</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Tell us briefly about your symptoms or question…"
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={fieldErrors.message ? "message-error" : undefined}
                />
                <FieldError id="message-error" message={fieldErrors.message} />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={status === "sending" || status === "sent"}
                className="w-full"
              >
                {status === "sending" ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                      className="size-4 rounded-full border-2 border-white/40 border-t-white"
                    />
                    Sending…
                  </>
                ) : status === "sent" ? (
                  <>Message sent — we&apos;ll be in touch</>
                ) : status === "error" ? (
                  <>
                    <Send className="size-5" />
                    Try again
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    Send Message
                  </>
                )}
              </Button>

              <p
                className={`text-center text-xs ${
                  status === "sent"
                    ? "text-accent-600 dark:text-accent-400"
                    : status === "error"
                      ? "text-danger-600 dark:text-danger-400"
                      : "text-muted-foreground"
                }`}
                role="status"
                aria-live="polite"
              >
                {feedback ??
                  "For medical emergencies please call our 24×7 line instead of this form."}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-xs font-medium text-danger-600 dark:text-danger-400">
      {message}
    </p>
  );
}

const toneMap = {
  primary: "bg-primary-500/12 text-primary-600 dark:text-primary-300",
  accent: "bg-accent-500/12 text-accent-600 dark:text-accent-300",
  danger: "bg-danger-500/12 text-danger-600 dark:text-danger-400",
} as const;

function ContactTile({
  icon,
  label,
  value,
  href,
  tone,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  tone: keyof typeof toneMap;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-start gap-3.5 rounded-3xl p-3 transition-colors duration-300 hover:bg-foreground/4"
    >
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${toneMap[tone]}`}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[0.64rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold break-words">{value}</span>
      </span>
    </a>
  );
}
