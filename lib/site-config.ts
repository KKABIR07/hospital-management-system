export const siteConfig = {
  name: "Aurora Health",
  legalName: "Aurora Health Institute",
  tagline: "Compassion Meets Advanced Healthcare",
  description:
    "Aurora Health delivers 24/7 emergency care, world-class specialists and advanced diagnostics with the warmth of human compassion. Book an appointment in under a minute.",
  url: "https://aurorahealth.example.com",
  locale: "en_US",
  emergencyPhone: "+1 (800) 911-2450",
  frontDeskPhone: "+1 (800) 240-1180",
  whatsapp: "+1 (800) 240-1180",
  email: "care@aurorahealth.example.com",
  address: {
    street: "1200 Meridian Boulevard",
    city: "San Francisco",
    region: "CA",
    postalCode: "94107",
    country: "USA",
  },
  hours: [
    { label: "Emergency & Trauma", value: "Open 24 × 7" },
    { label: "OPD / Consultations", value: "Mon – Sat · 8:00 AM – 9:00 PM" },
    { label: "Diagnostics & Labs", value: "Mon – Sun · 7:00 AM – 10:00 PM" },
    { label: "Pharmacy", value: "Open 24 × 7" },
    { label: "Visiting Hours", value: "Daily · 11:00 AM – 1:00 PM, 5:00 – 7:00 PM" },
  ],
  social: {
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
  },
  /** Google Maps embed for the contact section (no API key required). */
  mapEmbed:
    "https://www.google.com/maps?q=San+Francisco+General+Hospital&output=embed",
} as const;

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Doctors", href: "#doctors" },
  { label: "Tour", href: "#tour" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}`;
