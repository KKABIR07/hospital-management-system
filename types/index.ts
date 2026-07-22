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

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export interface TourStop {
  id: string;
  title: string;
  description: string;
  duration: string;
  image: string;
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

export type BookingStep = "department" | "doctor" | "date" | "time" | "confirm";

export interface BookingState {
  department: string | null;
  doctor: string | null;
  date: string | null;
  time: string | null;
}
