/**
 * SMS one-time-passcode helpers: phone normalisation, code generation, and the
 * timing/attempt policy shared by the request + verify routes.
 *
 * Numbers are normalised to E.164 with an India (+91) default, since that's the
 * audience for this deployment. Change `DEFAULT_COUNTRY_CODE` (or extend the
 * logic) if you onboard other regions.
 */

/** OTP length in digits. */
export const OTP_LENGTH = 6;

/** How long a code stays valid, in milliseconds (5 minutes). */
export const OTP_TTL_MS = 5 * 60 * 1000;

/** Minimum gap between two "send code" requests for the same number, in ms. */
export const OTP_RESEND_COOLDOWN_MS = 30 * 1000;

/** Max verify attempts against a single challenge before it's burned. */
export const OTP_MAX_ATTEMPTS = 5;

const DEFAULT_COUNTRY_CODE = "91";

/**
 * Normalise a user-entered mobile number to E.164, defaulting to India (+91).
 *
 * Accepts the common shapes an Indian user types:
 *   "9083389670"      → "+919083389670"
 *   "09083389670"     → "+919083389670"
 *   "919083389670"    → "+919083389670"
 *   "+91 90833 89670" → "+919083389670"
 *
 * Returns `null` if the input can't be resolved to a plausible number.
 */
export function normalizePhoneE164(raw: string): string | null {
  if (typeof raw !== "string") return null;

  const hadPlus = raw.trim().startsWith("+");
  let digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  // Drop a domestic trunk "0" prefix (e.g. 09083389670).
  if (!hadPlus && digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  // Bare 10-digit local number → prepend the default country code.
  if (!hadPlus && digits.length === 10) {
    digits = DEFAULT_COUNTRY_CODE + digits;
  }

  // India sanity check: country code + 10-digit subscriber number.
  if (digits.startsWith(DEFAULT_COUNTRY_CODE)) {
    const subscriber = digits.slice(DEFAULT_COUNTRY_CODE.length);
    if (subscriber.length !== 10 || !/^[6-9]/.test(subscriber)) return null;
  } else if (digits.length < 8 || digits.length > 15) {
    // Non-India E.164 numbers: accept a reasonable length range.
    return null;
  }

  return `+${digits}`;
}

/**
 * The national (subscriber) portion of an E.164 number, without country code —
 * some Indian SMS gateways (e.g. Fast2SMS) want the bare 10-digit number.
 */
export function toLocalNumber(e164: string): string {
  const digits = e164.replace(/\D/g, "");
  if (digits.startsWith(DEFAULT_COUNTRY_CODE)) {
    return digits.slice(DEFAULT_COUNTRY_CODE.length);
  }
  return digits;
}

/**
 * A cryptographically-random numeric code of `OTP_LENGTH` digits, zero-padded.
 * Uses the Web Crypto API available in the Node/Next runtime.
 */
export function generateOtpCode(): string {
  const max = 10 ** OTP_LENGTH;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const value = buf[0] % max;
  return value.toString().padStart(OTP_LENGTH, "0");
}
