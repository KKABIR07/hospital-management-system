import {
  Activity,
  Ambulance,
  Baby,
  BedDouble,
  Brain,
  ClipboardPlus,
  CreditCard,
  FlaskConical,
  Gauge,
  HeartPulse,
  Microscope,
  MonitorSmartphone,
  Pill,
  Scan,
  ShieldPlus,
  Siren,
  Sparkles,
  Stethoscope,
  Timer,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { images } from "@/lib/images";
import type {
  Department,
  Doctor,
  FaqItem,
  Feature,
  GalleryImage,
  Service,
  StatMetric,
  Testimonial,
  TourStop,
} from "@/types";

/* ------------------------------------------------------------------ *
 * Hero — floating glass cards
 * ------------------------------------------------------------------ */
export const heroStats = [
  { id: "doctors", label: "Available Doctors", value: "48", icon: Stethoscope, tone: "primary" as const },
  { id: "beds", label: "Beds Available", value: "126", icon: BedDouble, tone: "accent" as const },
  { id: "emergency", label: "Emergency Status", value: "Ready", icon: Siren, tone: "danger" as const },
  { id: "wait", label: "Avg. Waiting Time", value: "08 min", icon: Timer, tone: "primary" as const },
];

/* ------------------------------------------------------------------ *
 * Live hospital dashboard
 * ------------------------------------------------------------------ */
export const dashboardMetrics: StatMetric[] = [
  {
    id: "available-doctors",
    label: "Available Doctors",
    value: 48,
    icon: Stethoscope,
    gradient: "from-primary-500 to-primary-400",
    hint: "Across 24 departments",
    live: true,
  },
  {
    id: "specialists-online",
    label: "Specialists Online",
    value: 19,
    icon: MonitorSmartphone,
    gradient: "from-accent-500 to-accent-400",
    hint: "Tele-consult ready",
    live: true,
  },
  {
    id: "beds-available",
    label: "Beds Available",
    value: 126,
    icon: BedDouble,
    gradient: "from-primary-600 to-accent-500",
    hint: "of 480 total beds",
  },
  {
    id: "emergency-queue",
    label: "Emergency Queue",
    value: 3,
    icon: Siren,
    gradient: "from-danger-500 to-danger-400",
    hint: "Triage in progress",
    live: true,
  },
  {
    id: "waiting-time",
    label: "Avg. Waiting Time",
    value: 8,
    suffix: " min",
    icon: Timer,
    gradient: "from-primary-500 to-accent-400",
    hint: "Down 12% this week",
  },
  {
    id: "icu-occupancy",
    label: "ICU Occupancy",
    value: 72,
    suffix: "%",
    icon: Activity,
    gradient: "from-accent-600 to-primary-500",
    hint: "34 of 47 critical beds",
  },
  {
    id: "ambulances",
    label: "Ambulances Ready",
    value: 12,
    icon: Ambulance,
    gradient: "from-danger-500 to-primary-500",
    hint: "Avg. dispatch 4 min",
    live: true,
  },
];

/* ------------------------------------------------------------------ *
 * Services
 * ------------------------------------------------------------------ */
export const services: Service[] = [
  {
    id: "emergency",
    title: "Emergency Care",
    description: "Level-1 trauma bay staffed round the clock with a 4-minute average response.",
    icon: Siren,
    gradient: "from-danger-500 to-danger-400",
  },
  {
    id: "icu",
    title: "Intensive Care",
    description: "47 critical-care beds with continuous monitoring and 1:1 nursing.",
    icon: Activity,
    gradient: "from-primary-600 to-primary-400",
  },
  {
    id: "surgery",
    title: "General Surgery",
    description: "Robot-assisted and minimally invasive theatres with same-day recovery.",
    icon: ClipboardPlus,
    gradient: "from-accent-600 to-accent-400",
  },
  {
    id: "pathology",
    title: "Pathology",
    description: "NABL-accredited labs returning most reports within four hours.",
    icon: Microscope,
    gradient: "from-primary-500 to-accent-500",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    description: "24×7 in-house pharmacy with insurance-linked billing and home delivery.",
    icon: Pill,
    gradient: "from-accent-500 to-primary-400",
  },
  {
    id: "ambulance",
    title: "Ambulance",
    description: "GPS-tracked advanced life-support fleet with paramedics on board.",
    icon: Ambulance,
    gradient: "from-danger-500 to-primary-500",
  },
  {
    id: "maternity",
    title: "Maternity",
    description: "Birthing suites, neonatal ICU and lactation support for every family.",
    icon: Baby,
    gradient: "from-accent-400 to-primary-400",
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    description: "3T MRI, 256-slice CT and digital imaging read by on-site radiologists.",
    icon: Scan,
    gradient: "from-primary-500 to-primary-700",
  },
];

/* ------------------------------------------------------------------ *
 * Why choose us
 * ------------------------------------------------------------------ */
export const features: Feature[] = [
  {
    id: "doctors",
    title: "Experienced Doctors",
    description: "320+ consultants averaging 15 years of practice across 24 specialties.",
    icon: Stethoscope,
    gradient: "from-primary-500 to-primary-400",
  },
  {
    id: "equipment",
    title: "Modern Equipment",
    description: "Robotic surgery, 3T MRI and AI-assisted imaging refreshed every 3 years.",
    icon: Sparkles,
    gradient: "from-accent-500 to-accent-400",
  },
  {
    id: "emergency",
    title: "24 × 7 Emergency",
    description: "Trauma team, cath lab and stroke unit always active — never on call.",
    icon: ShieldPlus,
    gradient: "from-danger-500 to-danger-400",
  },
  {
    id: "affordable",
    title: "Affordable Treatment",
    description: "Transparent packages, cashless insurance and 0% EMI on major procedures.",
    icon: Wallet,
    gradient: "from-accent-600 to-primary-500",
  },
  {
    id: "records",
    title: "Digital Health Records",
    description: "Lifetime encrypted records, reports and prescriptions in one secure app.",
    icon: MonitorSmartphone,
    gradient: "from-primary-600 to-accent-500",
  },
  {
    id: "fast",
    title: "Fast Patient Care",
    description: "Digital check-in and smart triage keep the average wait under 10 minutes.",
    icon: Zap,
    gradient: "from-primary-400 to-accent-400",
  },
];

/* ------------------------------------------------------------------ *
 * Virtual tour
 * ------------------------------------------------------------------ */
export const tourStops: TourStop[] = [
  {
    id: "reception",
    title: "360° Reception",
    description: "Step into the atrium and see how fast check-in really works.",
    duration: "1:40",
    image: images.tour.reception,
  },
  {
    id: "icu",
    title: "Intensive Care Unit",
    description: "Continuous monitoring, isolation pods and 1:1 critical nursing.",
    duration: "2:15",
    image: images.tour.icu,
  },
  {
    id: "theatre",
    title: "Operation Theatre",
    description: "Laminar-flow modular theatres built for robot-assisted surgery.",
    duration: "2:48",
    image: images.tour.theatre,
  },
  {
    id: "rooms",
    title: "Patient Rooms",
    description: "Private and deluxe suites with attendant beds and smart controls.",
    duration: "1:55",
    image: images.tour.rooms,
  },
  {
    id: "mri",
    title: "MRI Room",
    description: "3T wide-bore MRI with noise reduction and paediatric comfort mode.",
    duration: "1:20",
    image: images.tour.mri,
  },
  {
    id: "laboratory",
    title: "Laboratory",
    description: "Fully automated analysers processing 4,000+ samples every day.",
    duration: "2:05",
    image: images.tour.laboratory,
  },
];

/* ------------------------------------------------------------------ *
 * Doctors
 * ------------------------------------------------------------------ */
export const doctors: Doctor[] = [
  {
    id: "amara-osei",
    name: "Dr. Amara Osei",
    department: "Cardiology",
    qualification: "MBBS, MD, DM (Cardiology)",
    experience: 18,
    availability: "Mon – Fri · 9:00 AM – 4:00 PM",
    rating: 4.9,
    reviews: 862,
    image: images.doctors.cardiology,
    languages: ["English", "French", "Twi"],
    focus: ["Interventional cardiology", "Heart failure", "Preventive care"],
    nextSlot: "Today · 4:30 PM",
  },
  {
    id: "ravi-menon",
    name: "Dr. Ravi Menon",
    department: "Neurology",
    qualification: "MBBS, MD, DM (Neurology)",
    experience: 21,
    availability: "Mon – Sat · 10:00 AM – 6:00 PM",
    rating: 4.8,
    reviews: 741,
    image: images.doctors.neurology,
    languages: ["English", "Hindi", "Malayalam"],
    focus: ["Stroke care", "Epilepsy", "Movement disorders"],
    nextSlot: "Tomorrow · 11:00 AM",
  },
  {
    id: "lena-fischer",
    name: "Dr. Lena Fischer",
    department: "Pediatrics",
    qualification: "MBBS, MD (Pediatrics), FNB",
    experience: 12,
    availability: "Mon – Sat · 8:00 AM – 2:00 PM",
    rating: 5.0,
    reviews: 1204,
    image: images.doctors.pediatrics,
    languages: ["English", "German"],
    focus: ["Neonatal care", "Child nutrition", "Vaccination"],
    nextSlot: "Today · 1:15 PM",
  },
  {
    id: "daniel-cruz",
    name: "Dr. Daniel Cruz",
    department: "Orthopedics",
    qualification: "MBBS, MS (Ortho), Fellowship (Sports)",
    experience: 15,
    availability: "Tue – Sun · 11:00 AM – 7:00 PM",
    rating: 4.7,
    reviews: 596,
    image: images.doctors.orthopedics,
    languages: ["English", "Spanish"],
    focus: ["Joint replacement", "Sports injury", "Spine care"],
    nextSlot: "Today · 6:00 PM",
  },
  {
    id: "sofia-haddad",
    name: "Dr. Sofia Haddad",
    department: "Oncology",
    qualification: "MBBS, MD, DM (Medical Oncology)",
    experience: 16,
    availability: "Mon – Thu · 9:30 AM – 5:00 PM",
    rating: 4.9,
    reviews: 683,
    image: images.doctors.oncology,
    languages: ["English", "Arabic", "French"],
    focus: ["Immunotherapy", "Breast oncology", "Palliative care"],
    nextSlot: "Thu · 10:00 AM",
  },
  {
    id: "marcus-hale",
    name: "Dr. Marcus Hale",
    department: "Emergency Medicine",
    qualification: "MBBS, MD (Emergency Medicine)",
    experience: 14,
    availability: "Available 24 × 7 on rotation",
    rating: 4.8,
    reviews: 978,
    image: images.doctors.emergency,
    languages: ["English"],
    focus: ["Trauma", "Critical airway", "Toxicology"],
    nextSlot: "Walk-in · Now",
  },
];

/* ------------------------------------------------------------------ *
 * AI booking flow
 * ------------------------------------------------------------------ */
export const departments: Department[] = [
  { id: "cardiology", name: "Cardiology", icon: HeartPulse, doctors: ["amara-osei"] },
  { id: "neurology", name: "Neurology", icon: Brain, doctors: ["ravi-menon"] },
  { id: "pediatrics", name: "Pediatrics", icon: Baby, doctors: ["lena-fischer"] },
  { id: "orthopedics", name: "Orthopedics", icon: Gauge, doctors: ["daniel-cruz"] },
  { id: "oncology", name: "Oncology", icon: FlaskConical, doctors: ["sofia-haddad"] },
  { id: "emergency", name: "Emergency", icon: Siren, doctors: ["marcus-hale"] },
];

export const timeSlots = [
  "09:00 AM",
  "10:30 AM",
  "11:45 AM",
  "01:15 PM",
  "02:30 PM",
  "04:00 PM",
  "05:30 PM",
  "06:45 PM",
];

/* ------------------------------------------------------------------ *
 * Testimonials
 * ------------------------------------------------------------------ */
export const testimonials: Testimonial[] = [
  {
    id: "elena",
    name: "Elena Marquez",
    treatment: "Angioplasty · Cardiology",
    rating: 5,
    quote:
      "I arrived at 2 AM with chest pain and was in the cath lab within twenty minutes. The team explained every step to my husband while they worked. I went home in three days.",
    image: images.patients.one,
    location: "Oakland, CA",
    hasVideo: true,
  },
  {
    id: "james",
    name: "James Okoro",
    treatment: "Knee Replacement · Orthopedics",
    rating: 5,
    quote:
      "Dr. Cruz walked me through the implant options with actual scans on screen. Six weeks later I was back on the football pitch with my son. Zero complications.",
    image: images.patients.two,
    location: "San Jose, CA",
    hasVideo: true,
  },
  {
    id: "priya",
    name: "Priya Raghunathan",
    treatment: "Maternity · Neonatal ICU",
    rating: 5,
    quote:
      "Our daughter arrived seven weeks early. The NICU nurses sent us photo updates every night we couldn't stay. That kindness is why we still come back for check-ups.",
    image: images.patients.three,
    location: "Fremont, CA",
  },
  {
    id: "thomas",
    name: "Thomas Beckett",
    treatment: "Oncology · Immunotherapy",
    rating: 5,
    quote:
      "Two years of treatment and never once did I feel like a case number. The billing team even found a support programme that covered most of my cycles.",
    image: images.patients.four,
    location: "San Francisco, CA",
    hasVideo: true,
  },
];

/* ------------------------------------------------------------------ *
 * Statistics
 * ------------------------------------------------------------------ */
export const statistics: StatMetric[] = [
  {
    id: "patients",
    label: "Patients Treated",
    value: 1250000,
    suffix: "+",
    icon: Users,
    gradient: "from-primary-500 to-primary-400",
  },
  {
    id: "doctors",
    label: "Expert Doctors",
    value: 320,
    suffix: "+",
    icon: Stethoscope,
    gradient: "from-accent-500 to-accent-400",
  },
  {
    id: "years",
    label: "Years of Experience",
    value: 35,
    icon: ShieldPlus,
    gradient: "from-primary-600 to-accent-500",
  },
  {
    id: "operations",
    label: "Operations Completed",
    value: 84000,
    suffix: "+",
    icon: ClipboardPlus,
    gradient: "from-accent-600 to-primary-500",
  },
  {
    id: "recovery",
    label: "Recovery Rate",
    value: 98.6,
    suffix: "%",
    decimals: 1,
    icon: HeartPulse,
    gradient: "from-primary-400 to-accent-400",
  },
];

/* ------------------------------------------------------------------ *
 * Gallery
 * ------------------------------------------------------------------ */
export const galleryImages: GalleryImage[] = [
  { id: "reception", title: "Main Reception", image: images.gallery.reception, span: "md:row-span-2" },
  { id: "icu", title: "Intensive Care Unit", image: images.gallery.icu, span: "" },
  { id: "room", title: "Patient Suite", image: images.gallery.room, span: "" },
  { id: "doctors", title: "Our Consultants", image: images.gallery.doctors, span: "md:row-span-2" },
  { id: "theatre", title: "Operation Theatre", image: images.gallery.theatre, span: "" },
  { id: "ambulance", title: "Ambulance Fleet", image: images.gallery.ambulance, span: "" },
];

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */
export const faqs: FaqItem[] = [
  {
    id: "appointments",
    category: "Appointments",
    question: "How do I book an appointment, and can I reschedule it later?",
    answer:
      "Use the AI booking assistant above, call our front desk, or book from the patient app. You'll get an SMS and email confirmation instantly. Rescheduling is free up to 2 hours before your slot — just tap the link in your confirmation message.",
  },
  {
    id: "insurance",
    category: "Insurance",
    question: "Which insurance providers do you accept?",
    answer:
      "We are empanelled with 40+ national and international insurers for cashless treatment, including all major group corporate plans. Bring your policy card and a photo ID to the insurance desk on Level 1, and our team will handle pre-authorisation — usually within 90 minutes.",
  },
  {
    id: "emergency",
    category: "Emergency",
    question: "What should I do in a medical emergency?",
    answer:
      "Call our 24×7 emergency line immediately — an advanced life-support ambulance is dispatched in under 4 minutes on average, and our trauma team is alerted while you're still en route. If you're driving in, head straight to the Emergency entrance on Meridian Boulevard; registration can be completed after treatment begins.",
  },
  {
    id: "visiting",
    category: "Visiting Hours",
    question: "When can family members visit an admitted patient?",
    answer:
      "General wards welcome visitors daily from 11:00 AM – 1:00 PM and 5:00 – 7:00 PM. ICU visits are limited to two family members for 15 minutes during the evening window, and one attendant may stay overnight in private rooms.",
  },
  {
    id: "reports",
    category: "Reports",
    question: "How quickly will I receive my test reports?",
    answer:
      "Most pathology reports are ready within four hours, and imaging reports within six. Everything is pushed to your patient app and email the moment it's verified by a consultant — no need to travel back for a printout, though hard copies are available at the diagnostics desk.",
  },
  {
    id: "medicine",
    category: "Medicine",
    question: "Can I get my prescription refilled or delivered?",
    answer:
      "Yes. Our in-house pharmacy is open 24×7 and stocks every drug on our formulary. Request a refill from the app and we'll deliver within a 25 km radius the same day, with your consultant's digital prescription attached for your records.",
  },
];

/* ------------------------------------------------------------------ *
 * Trust markers (marquee under the hero)
 * ------------------------------------------------------------------ */
export const accreditations = [
  { label: "JCI Accredited", icon: ShieldPlus },
  { label: "NABH Certified", icon: ClipboardPlus },
  { label: "ISO 9001:2015", icon: Sparkles },
  { label: "NABL Labs", icon: Microscope },
  { label: "Cashless Insurance", icon: CreditCard },
  { label: "Green OT Certified", icon: Activity },
];
