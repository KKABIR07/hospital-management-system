/**
 * Tiny dependency-free validation helpers shared by the API route handlers.
 * Swap for zod/valibot if the project later adds a schema library.
 */

export type FieldErrors = Record<string, string>;

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: FieldErrors;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allows +, spaces, dashes, parens, dots — 7 to 20 digits once stripped.
const PHONE_RE = /^[\d]{7,20}$/;

export function isEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_RE.test(value.trim());
}

export function isPhone(value: unknown): value is string {
  return typeof value === "string" && PHONE_RE.test(value.replace(/[^\d]/g, ""));
}

function requireText(value: unknown, min: number, max: number) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  department?: string;
  message: string;
}

export function validateContact(input: unknown): ValidationResult<ContactPayload> {
  const errors: FieldErrors = {};
  const body = (input ?? {}) as Record<string, unknown>;

  if (!requireText(body.name, 2, 80)) errors.name = "Please enter your full name.";
  if (!isEmail(body.email)) errors.email = "Please enter a valid email address.";
  if (!isPhone(body.phone)) errors.phone = "Please enter a valid phone number.";
  if (!requireText(body.message, 5, 2000)) errors.message = "Please add a short message.";

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      name: (body.name as string).trim(),
      email: (body.email as string).trim(),
      phone: (body.phone as string).trim(),
      department: typeof body.department === "string" ? body.department.trim() : undefined,
      message: (body.message as string).trim(),
    },
  };
}

export interface NewsletterPayload {
  email: string;
}

export function validateNewsletter(input: unknown): ValidationResult<NewsletterPayload> {
  const body = (input ?? {}) as Record<string, unknown>;
  if (!isEmail(body.email)) {
    return { success: false, errors: { email: "Please enter a valid email address." } };
  }
  return { success: true, data: { email: (body.email as string).trim() } };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export function validateRegister(input: unknown): ValidationResult<RegisterPayload> {
  const errors: FieldErrors = {};
  const body = (input ?? {}) as Record<string, unknown>;

  if (!requireText(body.name, 2, 80)) errors.name = "Please enter your full name.";
  if (!isEmail(body.email)) errors.email = "Please enter a valid email address.";
  // Minimum 8 chars — a floor, not a policy. Tighten if you add a real password policy.
  if (typeof body.password !== "string" || body.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      name: (body.name as string).trim(),
      email: (body.email as string).trim().toLowerCase(),
      password: body.password as string,
      role: typeof body.role === "string" ? body.role.trim() : undefined,
    },
  };
}

export interface CredentialsPayload {
  email: string;
  password: string;
}

export function validateCredentials(input: unknown): ValidationResult<CredentialsPayload> {
  const errors: FieldErrors = {};
  const body = (input ?? {}) as Record<string, unknown>;

  if (!isEmail(body.email)) errors.email = "Please enter a valid email address.";
  if (typeof body.password !== "string" || body.password.length === 0) {
    errors.password = "Please enter your password.";
  }

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      email: (body.email as string).trim().toLowerCase(),
      password: body.password as string,
    },
  };
}

export interface OtpRequestPayload {
  phone: string;
}

export function validateOtpRequest(input: unknown): ValidationResult<OtpRequestPayload> {
  const body = (input ?? {}) as Record<string, unknown>;
  if (!isPhone(body.phone)) {
    return { success: false, errors: { phone: "Enter a valid mobile number." } };
  }
  return { success: true, data: { phone: (body.phone as string).trim() } };
}

export interface OtpVerifyPayload {
  phone: string;
  code: string;
}

export function validateOtpVerify(input: unknown): ValidationResult<OtpVerifyPayload> {
  const errors: FieldErrors = {};
  const body = (input ?? {}) as Record<string, unknown>;

  if (!isPhone(body.phone)) errors.phone = "Enter a valid mobile number.";
  // A 4–8 digit numeric code — the route enforces the exact length.
  if (typeof body.code !== "string" || !/^\d{4,8}$/.test(body.code.trim())) {
    errors.code = "Enter the code we sent you.";
  }

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: { phone: (body.phone as string).trim(), code: (body.code as string).trim() },
  };
}

export interface EmailOtpRequestPayload {
  email: string;
}

export function validateEmailOtpRequest(input: unknown): ValidationResult<EmailOtpRequestPayload> {
  const body = (input ?? {}) as Record<string, unknown>;
  if (!isEmail(body.email)) {
    return { success: false, errors: { email: "Enter a valid email address." } };
  }
  return { success: true, data: { email: (body.email as string).trim().toLowerCase() } };
}

export interface EmailOtpVerifyPayload {
  email: string;
  code: string;
}

export function validateEmailOtpVerify(input: unknown): ValidationResult<EmailOtpVerifyPayload> {
  const errors: FieldErrors = {};
  const body = (input ?? {}) as Record<string, unknown>;

  if (!isEmail(body.email)) errors.email = "Enter a valid email address.";
  // A 4–8 digit numeric code — the route enforces the exact length.
  if (typeof body.code !== "string" || !/^\d{4,8}$/.test(body.code.trim())) {
    errors.code = "Enter the code we sent you.";
  }

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: { email: (body.email as string).trim().toLowerCase(), code: (body.code as string).trim() },
  };
}

const APPOINTMENT_MODES = ["In-person", "Video consult", "Lab visit"] as const;
type AppointmentModeInput = (typeof APPOINTMENT_MODES)[number];

export interface AppointmentPayload {
  patientName: string;
  department: string;
  doctor: string;
  /** ISO 8601 timestamp for the appointment start. */
  scheduledAt: string;
  mode: AppointmentModeInput;
  email?: string;
  phone?: string;
  notes?: string;
}

export function validateAppointment(input: unknown): ValidationResult<AppointmentPayload> {
  const errors: FieldErrors = {};
  const body = (input ?? {}) as Record<string, unknown>;

  if (!requireText(body.patientName, 2, 80)) errors.patientName = "Please enter the patient's name.";
  if (!requireText(body.department, 2, 80)) errors.department = "Please choose a department.";
  if (!requireText(body.doctor, 2, 80)) errors.doctor = "Please choose a doctor.";

  const scheduledAt = typeof body.scheduledAt === "string" ? new Date(body.scheduledAt) : null;
  if (!scheduledAt || Number.isNaN(scheduledAt.getTime())) {
    errors.scheduledAt = "Please choose a valid date and time.";
  }

  const mode = body.mode;
  if (!APPOINTMENT_MODES.includes(mode as AppointmentModeInput)) {
    errors.mode = "Please choose how you'd like to be seen.";
  }

  if (body.email !== undefined && body.email !== "" && !isEmail(body.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (body.phone !== undefined && body.phone !== "" && !isPhone(body.phone)) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (Object.keys(errors).length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      patientName: (body.patientName as string).trim(),
      department: (body.department as string).trim(),
      doctor: (body.doctor as string).trim(),
      scheduledAt: scheduledAt!.toISOString(),
      mode: mode as AppointmentModeInput,
      email: isEmail(body.email) ? (body.email as string).trim() : undefined,
      phone: isPhone(body.phone) ? (body.phone as string).trim() : undefined,
      notes: requireText(body.notes, 1, 2000) ? (body.notes as string).trim() : undefined,
    },
  };
}
