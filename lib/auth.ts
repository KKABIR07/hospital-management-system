import { UserRole } from "@prisma/client";

import type { PortalRoleId } from "@/types";

/** Portal role slugs (URL / UI) ↔ the DB enum. */
const ROLE_TO_DB: Record<PortalRoleId, UserRole> = {
  patient: UserRole.PATIENT,
  doctor: UserRole.DOCTOR,
  pathology: UserRole.PATHOLOGY,
  lab: UserRole.LAB,
  admin: UserRole.ADMIN,
};

const ROLE_TO_UI: Record<UserRole, PortalRoleId> = {
  [UserRole.PATIENT]: "patient",
  [UserRole.DOCTOR]: "doctor",
  [UserRole.PATHOLOGY]: "pathology",
  [UserRole.LAB]: "lab",
  [UserRole.ADMIN]: "admin",
};

export function toDbRole(role: string | undefined): UserRole {
  if (!role) return UserRole.PATIENT;
  return ROLE_TO_DB[role as PortalRoleId] ?? UserRole.PATIENT;
}

export const toUiRole = (role: UserRole): PortalRoleId => ROLE_TO_UI[role];

/** bcrypt work factor. 10 is a sensible default for interactive logins. */
export const BCRYPT_ROUNDS = 10;
