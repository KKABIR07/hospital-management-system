import type {
  PatientAppointment,
  PatientInvoice,
  PatientProfile,
  PatientVisit,
} from "@/types";

/**
 * Demo patient data for the portal dashboard. This is illustrative sample
 * content only — no real patient records are stored or fetched.
 */
export const patientProfile: PatientProfile = {
  name: "Jordan Ellis",
  id: "PT-48210",
  phone: "+1 555 010 2233",
  memberSince: "2019",
};

export const upcomingAppointments: PatientAppointment[] = [
  {
    id: "apt-3391",
    doctor: "Dr. Amara Osei",
    department: "Cardiology",
    date: "Tue, 28 Jul 2026",
    time: "10:30 AM",
    mode: "In-person",
    status: "Confirmed",
  },
  {
    id: "apt-3402",
    doctor: "Dr. Lena Fischer",
    department: "Pediatrics",
    date: "Fri, 31 Jul 2026",
    time: "01:15 PM",
    mode: "Video consult",
    status: "Pending",
  },
];

export const visitHistory: PatientVisit[] = [
  {
    id: "vis-2871",
    date: "02 Jul 2026",
    doctor: "Dr. Marcus Hale",
    department: "Emergency Medicine",
    summary: "Chest-pain assessment — ECG normal, discharged the same day.",
    reportReady: true,
  },
  {
    id: "vis-2744",
    date: "18 May 2026",
    doctor: "Dr. Ravi Menon",
    department: "Neurology",
    summary: "Migraine follow-up — medication adjusted, review in 3 months.",
    reportReady: true,
  },
  {
    id: "vis-2610",
    date: "10 Mar 2026",
    doctor: "Dr. Sofia Haddad",
    department: "Oncology",
    summary: "Routine screening panel — results clear.",
    reportReady: true,
  },
  {
    id: "vis-2480",
    date: "04 Jan 2026",
    doctor: "Dr. Amara Osei",
    department: "Cardiology",
    summary: "Annual heart check — echocardiogram within normal range.",
    reportReady: false,
  },
];

export const invoices: PatientInvoice[] = [
  {
    id: "INV-20482",
    date: "02 Jul 2026",
    description: "Emergency visit + ECG",
    amount: 240,
    status: "Due",
  },
  {
    id: "INV-19233",
    date: "18 May 2026",
    description: "Neurology consultation",
    amount: 120,
    status: "Paid",
  },
  {
    id: "INV-18110",
    date: "10 Mar 2026",
    description: "Screening panel (bloodwork)",
    amount: 320,
    status: "Paid",
  },
];

/** e.g. 240 → "$240.00" */
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
