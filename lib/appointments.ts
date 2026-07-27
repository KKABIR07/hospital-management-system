import { AppointmentMode, AppointmentStatus } from "@prisma/client";

import type {
  AppointmentMode as UiAppointmentMode,
  AppointmentStatus as UiAppointmentStatus,
} from "@/types";

/**
 * The UI speaks human labels ("Video consult"); the database stores enums
 * (VIDEO_CONSULT). These maps are the single source of truth for both
 * directions so the API, seed script and dashboard never drift.
 */
const MODE_TO_DB: Record<UiAppointmentMode, AppointmentMode> = {
  "In-person": AppointmentMode.IN_PERSON,
  "Video consult": AppointmentMode.VIDEO_CONSULT,
  "Lab visit": AppointmentMode.LAB_VISIT,
};

const MODE_TO_UI: Record<AppointmentMode, UiAppointmentMode> = {
  [AppointmentMode.IN_PERSON]: "In-person",
  [AppointmentMode.VIDEO_CONSULT]: "Video consult",
  [AppointmentMode.LAB_VISIT]: "Lab visit",
};

const STATUS_TO_DB: Record<UiAppointmentStatus, AppointmentStatus> = {
  Confirmed: AppointmentStatus.CONFIRMED,
  Pending: AppointmentStatus.PENDING,
  Completed: AppointmentStatus.COMPLETED,
  Cancelled: AppointmentStatus.CANCELLED,
};

const STATUS_TO_UI: Record<AppointmentStatus, UiAppointmentStatus> = {
  [AppointmentStatus.CONFIRMED]: "Confirmed",
  [AppointmentStatus.PENDING]: "Pending",
  [AppointmentStatus.COMPLETED]: "Completed",
  [AppointmentStatus.CANCELLED]: "Cancelled",
};

export const toDbMode = (mode: UiAppointmentMode): AppointmentMode => MODE_TO_DB[mode];
export const toUiMode = (mode: AppointmentMode): UiAppointmentMode => MODE_TO_UI[mode];
export const toDbStatus = (status: UiAppointmentStatus): AppointmentStatus => STATUS_TO_DB[status];
export const toUiStatus = (status: AppointmentStatus): UiAppointmentStatus => STATUS_TO_UI[status];
