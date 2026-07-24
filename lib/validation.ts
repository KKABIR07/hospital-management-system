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
