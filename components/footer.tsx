"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone, Send, Siren } from "lucide-react";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  Logo,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons";
import { Reveal } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { services } from "@/lib/data";
import { fullAddress, navLinks, siteConfig } from "@/lib/site-config";
import { toDialable } from "@/lib/utils";

const socials = [
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedInIcon },
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YouTubeIcon },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      <div aria-hidden className="halo -left-20 top-0 size-[28rem] bg-primary-500/20" />
      <div aria-hidden className="halo -right-20 bottom-0 size-[28rem] bg-accent-500/15" />

      <div className="container-page relative z-10 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand + contact */}
          <Reveal className="flex flex-col gap-6">
            <Logo className="[&_span]:text-white" />
            <p className="max-w-sm text-sm leading-relaxed text-white/65">
              A 480-bed multi-specialty institute where advanced medicine and genuine
              compassion meet — every hour of every day, for every patient.
            </p>

            <ul className="flex flex-col gap-3 text-sm text-white/70">
              <li>
                <a
                  href={`tel:${toDialable(siteConfig.emergencyPhone)}`}
                  className="inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-danger-500/20 text-danger-400">
                    <Siren className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-white/45">Emergency 24×7</span>
                    {siteConfig.emergencyPhone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${toDialable(siteConfig.whatsapp).replace("+", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-accent-500/20 text-accent-400">
                    <WhatsAppIcon className="size-4" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.16em] text-white/45">WhatsApp</span>
                    {siteConfig.whatsapp}
                  </span>
                </a>
              </li>
              <li className="inline-flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-500/20 text-primary-300">
                  <MapPin className="size-4" />
                </span>
                <span className="pt-1.5">{fullAddress}</span>
              </li>
            </ul>
          </Reveal>

          {/* Quick links */}
          <Reveal delay={0.06} className="flex flex-col gap-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white/90">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/65">
              {[{ label: "Home", href: "#top" }, ...navLinks, { label: "Book Appointment", href: "#booking" }].map(
                (link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </Reveal>

          {/* Departments */}
          <Reveal delay={0.12} className="flex flex-col gap-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white/90">Departments</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/65">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href="#services"
                    className="group inline-flex items-center gap-1.5 transition-colors hover:text-white"
                  >
                    {service.title}
                    <ArrowUpRight className="size-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Newsletter */}
          <Reveal delay={0.18} className="flex flex-col gap-5">
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white/90">Health Newsletter</h3>
            <p className="text-sm leading-relaxed text-white/65">
              Monthly guidance from our consultants — prevention, nutrition and screening
              reminders. No spam, unsubscribe anytime.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubscribed(true);
              }}
              className="flex flex-col gap-3"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex gap-2">
                <Input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@email.com"
                  className="border-white/15 bg-white/10 text-white placeholder:text-white/40 focus:bg-white/15"
                />
                <Button type="submit" size="icon" aria-label="Subscribe to newsletter">
                  <Send className="size-4" />
                </Button>
              </div>
              {subscribed && (
                <p className="text-xs font-medium text-accent-400" role="status">
                  You&apos;re on the list — welcome to Aurora Health.
                </p>
              )}
            </form>

            <div className="flex gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-xl border border-white/12 bg-white/5 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary-400/50 hover:bg-primary-500/20 hover:text-white"
                >
                  <Icon className="size-4.5" />
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-6">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Mail className="size-3.5" />
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${toDialable(siteConfig.frontDeskPhone)}`}
                className="inline-flex items-center gap-1.5 hover:text-white"
              >
                <Phone className="size-3.5" />
                {siteConfig.frontDeskPhone}
              </a>
            </li>
            <li>
              <Link href="#faq" className="hover:text-white">
                Privacy &amp; Patient Rights
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
