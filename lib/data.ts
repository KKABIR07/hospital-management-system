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

import { images, tourVideoSources } from "@/lib/images";
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
    tagline: "Fastest possible access when every second counts",
    intent:
      "Built for speed and clarity under stress — minimal reading, maximum one-tap action. Reachable from the sticky red banner on every page, not just the main menu.",
    emphasis: "speed",
    accent: "danger",
    highlights: ["Trauma", "Cardiac", "Stroke", "Poisoning", "Pediatric ER"],
    content: [
      "Live ER status badge — Normal / Busy / Critical",
      "One-tap “Call Emergency” and “Request Ambulance” buttons",
      "Emergency specialties: trauma, cardiac, stroke, poisoning, pediatric ER",
      "Map with the fastest driving route to the ER entrance",
      "“What to bring” checklist — ID, medical history, medication list",
    ],
    features: [
      "Real-time ER load & average wait-time widget",
      "Symptom-based triage checklist (informational, not diagnostic)",
      "Direct ambulance dispatch trigger from the same screen",
      "Sticky, pulsing red contact strip visible site-wide",
      "Multi-language toggle for non-native speakers in crisis",
    ],
    layers: {
      frontend:
        "Sticky site-wide banner + dedicated ER landing page; tel: links for one-tap calling; live, colour-coded status badge (green / amber / red).",
      backend:
        "REST/WebSocket feed from the ER management system pushing live status, bed count and wait time every 30–60 seconds.",
      integrations:
        "Google Maps Directions API for the fastest route; SMS/WhatsApp gateway alerts on-call ER staff when an ambulance is requested.",
    },
  },
  {
    id: "icu",
    title: "Intensive Care",
    description: "47 critical-care beds with continuous monitoring and 1:1 nursing.",
    icon: Activity,
    gradient: "from-primary-600 to-primary-400",
    tagline: "Critical care transparency & family confidence",
    intent:
      "Balances clinical credibility — equipment and specialists — with human warmth: visiting rules, live updates and plain-language guidance for anxious families.",
    emphasis: "explore",
    accent: "primary",
    highlights: ["Medical", "Surgical", "Neonatal", "Cardiac"],
    content: [
      "Live bed availability by ICU type — Medical, Surgical, Neonatal, Cardiac",
      "Equipment & capability highlights — ventilators, monitoring, isolation bays",
      "Visiting hours, family protocol and infection-control guidelines",
      "Admission criteria & referral process explained in plain language",
      "Direct link into the Virtual Hospital Tour ICU scene",
    ],
    features: [
      "On-duty intensivist / specialist roster shown live",
      "Downloadable “What to Expect in the ICU” PDF guide",
      "Opt-in WhatsApp/SMS status updates for registered family",
      "Direct line to the ICU nursing station, separate from the ER line",
    ],
    layers: {
      frontend:
        "Colour-coded bed-status grid per ICU type; collapsible visiting-protocol FAQ; PDF viewer / download.",
      backend:
        "Bed-management integration (HL7/FHIR feed) for live occupancy; staff roster synced from HR / scheduling.",
      integrations:
        "WhatsApp Business API / SMS gateway for opted-in family updates, gated by patient-linked consent and authentication.",
    },
  },
  {
    id: "surgery",
    title: "General Surgery",
    description: "Robot-assisted and minimally invasive theatres with same-day recovery.",
    icon: ClipboardPlus,
    gradient: "from-accent-600 to-accent-400",
    tagline: "Specialty discovery, surgeon trust & consult booking",
    intent:
      "Turns research into a booked consultation — leading with surgical specialties, building trust through surgeon credentials, and removing cost-uncertainty with an estimator.",
    emphasis: "explore",
    accent: "accent",
    highlights: ["General", "Cardiac", "Orthopedic", "Neuro", "Laparoscopic", "Cosmetic"],
    content: [
      "Grid of surgical specialties — General, Cardiac, Orthopedic, Neuro, Laparoscopic, Cosmetic",
      "Surgeon profile cards — experience, qualifications, procedures performed",
      "OT technology highlights — robotic-assisted, minimally invasive equipment",
      "Pre-op and post-op care guides per procedure type",
      "Patient testimonials specific to surgical outcomes",
    ],
    features: [
      "“Request a Surgical Consultation” form routed to the specialty team",
      "Approximate cost estimator (range-based, with a clear disclaimer)",
      "Downloadable pre-operative checklist and fasting instructions",
      "Filter surgeons by specialty, experience and next availability",
    ],
    layers: {
      frontend:
        "Filterable surgeon directory (specialty / experience / availability); multi-step consultation request form; cost-estimator with input sliders.",
      backend:
        "Doctor/booking API shared with the Doctors section; admin-maintained pricing rules engine for the estimator (not hard-coded).",
      integrations:
        "CRM / lead-routing so requests reach the correct department inbox; e-signature / consent-form tool for pre-admission paperwork.",
    },
  },
  {
    id: "pathology",
    title: "Pathology",
    description: "NABL-accredited labs returning most reports within four hours.",
    icon: Microscope,
    gradient: "from-primary-500 to-accent-500",
    tagline: "Lab test booking, home collection & digital reports",
    intent:
      "A high-frequency, transactional service — closer to a mini e-commerce + portal experience. Find a test, book collection, and get the report with minimal friction.",
    emphasis: "transactional",
    accent: "primary",
    highlights: ["CBC", "Lipid profile", "Thyroid", "Home collection"],
    content: [
      "Searchable test / panel catalog with pricing — CBC, lipid profile, thyroid…",
      "Home sample-collection scheduler — address, date, time slot",
      "Turnaround-time indicator per test",
      "Lab accreditation badges — NABL / ISO or regional equivalent",
    ],
    features: [
      "Cart-style flow: search → add to cart → schedule collection → pay",
      "Secure patient portal to view / download reports as PDF",
      "SMS / email the moment a report is ready",
      "Repeat / recurring test scheduling for chronic-care patients",
    ],
    layers: {
      frontend:
        "Test catalog with search / filter and cart; slot-picker calendar for home collection; authenticated report portal with PDF viewer.",
      backend:
        "Integration with the hospital LIMS for order creation, sample tracking and report retrieval.",
      integrations:
        "Payment gateway for prepaid tests; SMS / email report-ready alerts; OTP-based patient authentication for report access.",
    },
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    description: "24×7 in-house pharmacy with insurance-linked billing and home delivery.",
    icon: Pill,
    gradient: "from-accent-500 to-primary-400",
    tagline: "Prescription ordering & medicine delivery",
    intent:
      "Supports both walk-in browsing and prescription-based ordering, with delivery for patients who cannot easily visit in person.",
    emphasis: "transactional",
    accent: "accent",
    highlights: ["24×7", "Prescription upload", "Home delivery", "Refill reminders"],
    content: [
      "Medicine search / catalog with generic & brand names",
      "Prescription upload area — photo or PDF",
      "24/7 availability badge and nearest-branch locator",
      "Refill reminder sign-up for chronic medication",
    ],
    features: [
      "Prescription upload with pharmacist verification before dispatch",
      "Cart & checkout with delivery or in-store pickup",
      "Live order tracking — Confirmed → Packed → Out for Delivery → Delivered",
      "Automated refill reminders based on the prescribed dosage cycle",
    ],
    layers: {
      frontend:
        "Product catalog + cart / checkout (e-commerce pattern); drag-and-drop prescription upload; order-tracking timeline.",
      backend:
        "Pharmacy inventory integration for real-time stock; prescription-verification queue for licensed pharmacist review.",
      integrations:
        "Payment gateway; delivery / logistics API (own fleet or courier); SMS notifications on status changes.",
    },
  },
  {
    id: "ambulance",
    title: "Ambulance",
    description: "GPS-tracked advanced life-support fleet with paramedics on board.",
    icon: Ambulance,
    gradient: "from-danger-500 to-primary-500",
    tagline: "One-tap dispatch with live GPS tracking",
    intent:
      "Like Emergency Care, this page prioritises speed of action over information density. The one job: get a vehicle moving toward the patient in seconds.",
    emphasis: "speed",
    accent: "danger",
    highlights: ["Basic", "ICU-equipped", "Neonatal"],
    content: [
      "One-tap “Request Ambulance” button — auto-detects location",
      "Fleet types — Basic, ICU-equipped, Neonatal",
      "Coverage-area map and approximate response time by zone",
      "Fare estimate before confirming dispatch",
    ],
    features: [
      "Live GPS tracking of the dispatched ambulance on a map",
      "Driver name, photo and contact shown after dispatch",
      "ETA countdown with push / SMS updates",
      "Dispatch confirmation with a shareable tracking link for family",
    ],
    layers: {
      frontend:
        "Geolocation-based request button; live map (driver marker + route) like ride-hailing apps; shareable tracking-link page.",
      backend:
        "Dispatch system matching the nearest available vehicle; GPS / telematics feed from ambulance fleet devices.",
      integrations:
        "Maps SDK for live tracking; SMS / push for ETA updates; call routing to connect the requester with the assigned driver.",
    },
  },
  {
    id: "maternity",
    title: "Maternity",
    description: "Birthing suites, neonatal ICU and lactation support for every family.",
    icon: Baby,
    gradient: "from-accent-400 to-primary-400",
    tagline: "Packages, birthing options & the prenatal journey",
    intent:
      "Expecting parents plan months ahead, so this page is exploratory and reassuring — comparing packages, meeting doctors, and understanding the journey from prenatal to postnatal care.",
    emphasis: "explore",
    accent: "accent",
    highlights: ["Normal Delivery", "C-Section", "Premium Suite"],
    content: [
      "Maternity package comparison — Normal Delivery, C-Section, Premium Suite",
      "Birthing suite & NICU virtual-tour link",
      "Obstetrician / gynaecologist profiles with delivery experience",
      "Prenatal and postnatal care programme overview",
    ],
    features: [
      "Due-date calculator as an engagement widget",
      "Antenatal class schedule with online booking",
      "Package cost comparison table with inclusions / exclusions",
      "NICU readiness information for high-risk pregnancies",
    ],
    layers: {
      frontend:
        "Due-date calculator (date input + logic); package comparison table; class-booking calendar.",
      backend:
        "Package / pricing data via an admin CMS so staff can update without a developer; class booking synced with the appointment API.",
      integrations:
        "Shared booking engine with the Doctors and AI Appointment modules; optional pregnancy-tracking email / SMS drip campaign.",
    },
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    description: "3T MRI, 256-slice CT and digital imaging read by on-site radiologists.",
    icon: Scan,
    gradient: "from-primary-500 to-primary-700",
    tagline: "Imaging & test booking with digital report access",
    intent:
      "Covers imaging modalities distinct from Pathology’s lab-sample tests. The focus: scheduling equipment time slots and delivering large report / image files securely.",
    emphasis: "transactional",
    accent: "primary",
    highlights: ["X-ray", "MRI", "CT Scan", "Ultrasound", "ECG", "Mammography"],
    content: [
      "Modality list — X-ray, MRI, CT, Ultrasound, ECG, Mammography",
      "Equipment / technology highlights — 3T MRI, low-dose CT",
      "Preparation instructions per test — fasting, hydration, clothing",
      "Appointment slot availability by modality and location",
    ],
    features: [
      "Search / filter by modality, body part or referring symptom",
      "Online booking tied to equipment scheduling",
      "Downloadable prep-instruction sheet sent after booking",
      "Secure report / image portal for viewing and downloading results",
    ],
    layers: {
      frontend:
        "Modality search / filter grid; slot-based appointment calendar; authenticated portal for report / image retrieval.",
      backend:
        "RIS for scheduling equipment time; PACS integration for storing and serving diagnostic images / reports.",
      integrations:
        "OTP-based authentication for the report portal; SMS / email when results are ready; shared booking engine with the AI Appointment module.",
    },
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
    duration: "0:12",
    image: images.tour.reception,
    video: tourVideoSources.reception,
  },
  {
    id: "icu",
    title: "Intensive Care Unit",
    description: "Continuous monitoring, isolation pods and 1:1 critical nursing.",
    duration: "0:28",
    image: images.tour.icu,
  },
  {
    id: "theatre",
    title: "Operation Theatre",
    description: "Laminar-flow modular theatres built for robot-assisted surgery.",
    duration: "0:30",
    image: images.tour.theatre,
  },
  {
    id: "rooms",
    title: "Patient Rooms",
    description: "Private and deluxe suites with attendant beds and smart controls.",
    duration: "0:26",
    image: images.tour.rooms,
  },
  {
    id: "mri",
    title: "MRI Room",
    description: "3T wide-bore MRI with noise reduction and paediatric comfort mode.",
    duration: "0:22",
    image: images.tour.mri,
  },
  {
    id: "laboratory",
    title: "Laboratory",
    description: "Fully automated analysers processing 4,000+ samples every day.",
    duration: "0:25",
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
