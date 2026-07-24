import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface StatMetric {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  icon: LucideIcon;
  /** Tailwind gradient stops, e.g. "from-primary-500 to-accent-500" */
  gradient: string;
  hint?: string;
  /** Renders a live "pulse" dot on the tile */
  live?: boolean;
}

/** The three technical build layers documented per service. */
export interface ServiceLayer {
  frontend: string;
  backend: string;
  integrations: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  /** ---- Dedicated service-page detail (from the implementation report) ---- */
  /** One-line promise shown under the title, e.g. "Fastest possible access when every second counts". */
  tagline?: string;
  /** Short intro paragraph framing who the page is for. */
  intent?: string;
  /**
   * Drives CTA tone on the detail page:
   * "speed" → red emergency-first, "transactional" → book/order, "explore" → consult.
   */
  emphasis?: "speed" | "transactional" | "explore";
  /** Page accent used for badges and highlights. */
  accent?: "primary" | "accent" | "danger";
  /** Quick-glance chips — specialties, fleet types, common tests, etc. */
  highlights?: string[];
  /** "Page Content" bullet list. */
  content?: string[];
  /** "Key Features" bullet list. */
  features?: string[];
  /** Frontend / backend / integrations build notes. */
  layers?: ServiceLayer;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export interface VideoSource {
  src: string;
  type: string;
}

export interface TourStop {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
  /** Inline clip, best format first. Without it the stop stays a still photo. */
  video?: readonly VideoSource[];
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  qualification: string;
  experience: number;
  availability: string;
  rating: number;
  reviews: number;
  image: string;
  languages: string[];
  focus: string[];
  nextSlot: string;
}

export interface Testimonial {
  id: string;
  name: string;
  treatment: string;
  rating: number;
  quote: string;
  image: string;
  location: string;
  hasVideo?: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  image: string;
  /** Masonry span class applied at md+ */
  span: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface Department {
  id: string;
  name: string;
  icon: LucideIcon;
  doctors: string[];
}

export type PortalRoleId = "doctor" | "pathology" | "lab" | "admin" | "patient";

/** A sign-in portal (demo / UI only — no real authentication). */
export interface PortalRole {
  id: PortalRoleId;
  /** Who signs in here — separates the patient portal from staff portals. */
  audience: "staff" | "patient";
  /** Full portal name, e.g. "Doctor Portal". */
  name: string;
  /** Short label, e.g. "Doctor". */
  shortName: string;
  /** One-line promise shown under the heading. */
  tagline: string;
  /** Longer description for the brand panel. */
  blurb: string;
  icon: LucideIcon;
  accent: "primary" | "accent" | "danger";
  gradient: string;
  /** Field label for the identifier, e.g. "Doctor ID". */
  idLabel: string;
  /** Placeholder / sample identifier, e.g. "DR-10482". */
  idPlaceholder: string;
  /** What the role can do once signed in — brand-panel bullets. */
  features: string[];
}

/* ---- Patient portal dashboard (demo data) ---- */
export type AppointmentMode = "In-person" | "Video consult" | "Lab visit";
export type AppointmentStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export interface PatientProfile {
  name: string;
  id: string;
  phone: string;
  memberSince: string;
}

export interface PatientAppointment {
  id: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  mode: AppointmentMode;
  status: AppointmentStatus;
}

export interface PatientVisit {
  id: string;
  date: string;
  doctor: string;
  department: string;
  summary: string;
  reportReady: boolean;
}

export interface PatientInvoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "Paid" | "Due";
}

export type BookingStep = "department" | "doctor" | "date" | "time" | "confirm";

export interface BookingState {
  department: string | null;
  doctor: string | null;
  date: string | null;
  time: string | null;
}
