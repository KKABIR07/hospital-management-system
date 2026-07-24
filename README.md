# Aurora Health — Hospital & Healthcare Landing Page

A premium, fully responsive hospital landing page built with Next.js 15, React 19,
TypeScript, Tailwind CSS v4 and Framer Motion. Glassmorphism UI, dark/light mode,
animated counters, an AI-style booking assistant, and SEO + structured data out of the box.

> This is the public-facing marketing site for the wider Hospital Management System
> (patient registration, EMR, billing, pharmacy, lab, inventory).

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Sections

| Section | Component | Notes |
| --- | --- | --- |
| Hero | `components/sections/hero.tsx` | Video background with gradient + poster fallback, floating glass cards, accreditation marquee |
| Live dashboard | `live-dashboard.tsx` | 7 glass tiles, animated counters, live pulse badges |
| AI booking | `ai-booking.tsx` | 5-step chat flow: department → doctor → date → time → confirm |
| Services | `services.tsx` | 8 services, 3D icon tiles, gradient ring + hover lift |
| Why choose us | `why-choose-us.tsx` | 6 differentiators with animated icons |
| Virtual tour | `virtual-tour.tsx` | 6 stops, large preview + interactive list |
| Doctors | `doctors.tsx` | Cards that expand on hover to reveal detail |
| Emergency banner | `emergency-banner.tsx` | Red gradient, pulse, floating ambulance, ECG line |
| Testimonials | `testimonials.tsx` | Autoplaying slider, video stills, star ratings |
| Statistics | `statistics.tsx` | Count-up metrics on a dark grid backdrop |
| Gallery | `gallery.tsx` | Masonry grid with hover zoom |
| FAQ | `faq.tsx` | Radix accordion, 6 categories |
| Contact | `contact.tsx` | Map embed, contact tiles, opening hours, form |

## Project structure

```
app/                  layout (fonts, metadata, JSON-LD), page, sitemap, robots, globals.css
components/           shared UI (navbar, footer, motion primitives, smart image, icons)
components/ui/        shadcn-style primitives (button, card, accordion, input, badge)
components/sections/  one file per landing-page section
hooks/                use-count-up, use-media-query, use-scroll-state
lib/                  site-config, data, images, utils
types/                shared TypeScript interfaces
```

## Customising

- **Hospital details** (name, phone numbers, address, hours, socials) — `lib/site-config.ts`
- **Content** (services, doctors, FAQs, testimonials, stats) — `lib/data.ts`
- **Imagery** — `lib/images.ts`. Photography currently loads from the Unsplash CDN;
  swap any URL for a `/public` path and it is picked up everywhere. `SmartImage`
  renders a branded gradient placeholder if a source ever fails, so the layout
  never breaks.
- **Hero video** — see `public/videos/README.md`. Without it the hero uses an
  animated gradient + poster photograph.
- **Theme tokens** (colours, radii, shadows, keyframes) — `app/globals.css`

Before deploying, set `siteConfig.url` to your real domain — it drives canonical
URLs, Open Graph tags, `sitemap.xml` and the JSON-LD `Hospital` schema — and point
`next.config.ts` `images.remotePatterns` at your own asset host.

## Notes

- The contact form and newsletter signup are wired to local state only. Connect
  them to your API route or CRM in `components/sections/contact.tsx` and
  `components/footer.tsx`.
- Dashboard figures are static sample data. Feed them from your HIS/API to make
  the "Live" badges truthful.
- Accessibility: skip link, focus-visible rings, ARIA labels on icon-only
  controls, `aria-live` on the booking transcript, and `prefers-reduced-motion`
  honoured in both CSS and Framer Motion (`MotionConfig reducedMotion="user"`).
