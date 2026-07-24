import { FlaskConical, Microscope, ShieldCheck, Stethoscope, UserRound } from "lucide-react";

import type { PortalRole, PortalRoleId } from "@/types";

/**
 * Sign-in portals. This is a UI / demo experience only — there is no backend
 * authentication, no accounts and no credential storage. The forms accept any
 * input and route to a placeholder dashboard.
 */
export const portalRoles: PortalRole[] = [
  {
    id: "patient",
    audience: "patient",
    name: "Patient Portal",
    shortName: "Patient",
    tagline: "Your reports, appointments & prescriptions",
    blurb:
      "View test results, upcoming appointments, prescriptions and bills — all in one secure place, anytime.",
    icon: UserRound,
    accent: "primary",
    gradient: "from-primary-500 to-accent-500",
    idLabel: "Patient ID / MRN",
    idPlaceholder: "PT-48210",
    features: [
      "Lab & imaging reports as they’re ready",
      "Upcoming appointments & reminders",
      "Prescriptions and billing history",
    ],
  },
  {
    id: "doctor",
    audience: "staff",
    name: "Doctor Portal",
    shortName: "Doctor",
    tagline: "Consultations, rounds & patient records",
    blurb:
      "Your appointment queue, patient histories and e-prescriptions in one secure workspace — on the ward or on call.",
    icon: Stethoscope,
    accent: "primary",
    gradient: "from-primary-600 to-primary-400",
    idLabel: "Doctor ID",
    idPlaceholder: "DR-10482",
    features: [
      "Live appointment queue & tele-consults",
      "Patient records and e-prescriptions",
      "Lab & imaging results in a single view",
    ],
  },
  {
    id: "pathology",
    audience: "staff",
    name: "Pathology Portal",
    shortName: "Pathology",
    tagline: "Samples, results & report sign-off",
    blurb:
      "Follow every sample from collection to verified report, and release results the moment they are signed off.",
    icon: Microscope,
    accent: "accent",
    gradient: "from-accent-600 to-accent-400",
    idLabel: "Pathologist ID",
    idPlaceholder: "PATH-2043",
    features: [
      "Sample tracking & turnaround times",
      "Result entry and report sign-off",
      "NABL-compliant audit trail",
    ],
  },
  {
    id: "lab",
    audience: "staff",
    name: "Laboratory Portal",
    shortName: "Lab",
    tagline: "Equipment scheduling & test processing",
    blurb:
      "Manage analyser queues, imaging slots and test processing across the diagnostics floor from one worklist.",
    icon: FlaskConical,
    accent: "primary",
    gradient: "from-primary-500 to-accent-500",
    idLabel: "Lab Tech ID",
    idPlaceholder: "LAB-5510",
    features: [
      "Analyser & equipment scheduling",
      "Test processing worklists",
      "Report upload to the patient portal",
    ],
  },
  {
    id: "admin",
    audience: "staff",
    name: "Admin Portal",
    shortName: "Admin",
    tagline: "Operations, staff & hospital control",
    blurb:
      "Oversee beds, staff rosters, billing and the live hospital dashboard from a single control centre.",
    icon: ShieldCheck,
    accent: "danger",
    gradient: "from-danger-500 to-primary-500",
    idLabel: "Admin ID",
    idPlaceholder: "ADM-0001",
    features: [
      "Bed, roster & queue management",
      "Billing and insurance oversight",
      "Full access to the live dashboard",
    ],
  },
];

export function getPortalRole(id: string): PortalRole | undefined {
  return portalRoles.find((role) => role.id === id);
}

export const portalRoleIds: PortalRoleId[] = portalRoles.map((role) => role.id);

/** Staff-only portals, for the staff sign-in hub. */
export const staffPortalRoles: PortalRole[] = portalRoles.filter((role) => role.audience === "staff");

/** The single patient portal. */
export const patientPortalRole = portalRoles.find((role) => role.audience === "patient")!;
