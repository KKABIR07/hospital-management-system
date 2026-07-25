/**
 * SMS delivery for one-time passcodes.
 *
 * Provider-pluggable via the `SMS_PROVIDER` env var. The default is Fast2SMS,
 * an India-focused gateway whose "otp" route needs no DLT template approval for
 * the quick-send path. Structured so MSG91 / 2Factor / Twilio can be added as
 * further `case`s without touching the callers.
 *
 * DEV MODE: if the selected provider has no API key configured, no real SMS is
 * sent — the code is logged to the server console and `delivered: false` is
 * returned. This lets the whole flow run locally with zero account setup; add
 * the key to `.env` to switch on real delivery.
 */

import { toLocalNumber } from "@/lib/otp";

export interface SmsResult {
  /** True only when a real SMS was handed off to the provider. */
  delivered: boolean;
  /** True when running without a provider key (code logged, not sent). */
  dev: boolean;
  /** Provider request id, when available. */
  id?: string;
  /** Human-readable error when a real send was attempted and failed. */
  error?: string;
}

type Provider = "fast2sms" | "msg91" | "2factor";

function activeProvider(): Provider {
  const raw = (process.env.SMS_PROVIDER ?? "fast2sms").toLowerCase();
  if (raw === "msg91" || raw === "2factor") return raw;
  return "fast2sms";
}

/**
 * Send an OTP code to an E.164 number. Never throws — failures are returned as
 * `{ delivered: false, error }` so the caller can decide how loudly to fail.
 */
export async function sendOtpSms(phoneE164: string, code: string): Promise<SmsResult> {
  const provider = activeProvider();

  switch (provider) {
    case "fast2sms":
      return sendViaFast2Sms(phoneE164, code);
    // Stubs — add real implementations when a key is provided for these.
    case "msg91":
    case "2factor":
      return devFallback(provider, phoneE164, code, `${provider} is not implemented yet`);
  }
}

/** Fast2SMS "otp" route — https://docs.fast2sms.com/#otp-message */
async function sendViaFast2Sms(phoneE164: string, code: string): Promise<SmsResult> {
  const apiKey = process.env.FAST2SMS_API_KEY?.trim();
  if (!apiKey) return devFallback("fast2sms", phoneE164, code);

  // Fast2SMS expects the bare 10-digit Indian number, no country code.
  const number = toLocalNumber(phoneE164);
  const params = new URLSearchParams({
    route: "otp",
    variables_values: code,
    numbers: number,
    flash: "0",
  });

  try {
    const res = await fetch(`https://www.fast2sms.com/dev/bulkV2?${params.toString()}`, {
      method: "GET",
      headers: { authorization: apiKey },
      cache: "no-store",
    });

    const body = (await res.json().catch(() => null)) as
      | { return?: boolean; request_id?: string; message?: string[] }
      | null;

    if (!res.ok || !body?.return) {
      const message = body?.message?.join(" ") ?? `HTTP ${res.status}`;
      console.error("[sms/fast2sms] send failed:", message);
      return { delivered: false, dev: false, error: message };
    }

    return { delivered: true, dev: false, id: body.request_id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    console.error("[sms/fast2sms] request threw:", message);
    return { delivered: false, dev: false, error: message };
  }
}

/** No key configured: log the code so local dev works without a provider. */
function devFallback(
  provider: Provider,
  phoneE164: string,
  code: string,
  note?: string,
): SmsResult {
  const suffix = note ? ` (${note})` : "";
  console.info(
    `[sms/${provider}] DEV MODE${suffix} — no SMS sent. OTP for ${phoneE164} is ${code}`,
  );
  return { delivered: false, dev: true };
}
