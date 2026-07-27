/**
 * Email delivery for one-time passcodes.
 *
 * Provider-pluggable via the `EMAIL_PROVIDER` env var:
 *   • "resend" — HTTP API, needs an API key + verified `from` (send to anyone).
 *   • "smtp"   — any SMTP server via nodemailer. With Gmail SMTP you can send to
 *                ANY recipient from your own Gmail using a Google App Password —
 *                no domain to verify. Best free option for small/demo volumes.
 * Structured so further providers can be added as `case`s without touching callers.
 *
 * DEV MODE: if the selected provider has no credentials configured, no real email
 * is sent — the code is logged to the server console and `delivered: false` is
 * returned. This lets the whole flow run locally with zero account setup; add the
 * credentials to `.env` to switch on real delivery.
 */

import nodemailer from "nodemailer";

export interface EmailResult {
  /** True only when a real email was handed off to the provider. */
  delivered: boolean;
  /** True when running without a provider key (code logged, not sent). */
  dev: boolean;
  /** Provider message id, when available. */
  id?: string;
  /** Human-readable error when a real send was attempted and failed. */
  error?: string;
}

type Provider = "resend" | "smtp" | "sendgrid";

function activeProvider(): Provider {
  const raw = (process.env.EMAIL_PROVIDER ?? "resend").toLowerCase();
  if (raw === "smtp" || raw === "gmail") return "smtp";
  if (raw === "sendgrid") return "sendgrid";
  return "resend";
}

/** The verified sender address. Override with EMAIL_FROM in `.env`. */
function fromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "Aurora Health <onboarding@resend.dev>";
}

/**
 * Send an OTP code to an email address. Never throws — failures are returned as
 * `{ delivered: false, error }` so the caller can decide how loudly to fail.
 */
export async function sendOtpEmail(email: string, code: string): Promise<EmailResult> {
  const provider = activeProvider();

  switch (provider) {
    case "resend":
      return sendViaResend(email, code);
    case "smtp":
      return sendViaSmtp(email, code);
    // Stub — add a real implementation when a key is provided for this provider.
    case "sendgrid":
      return devFallback(provider, email, code, "sendgrid is not implemented yet");
  }
}

/**
 * SMTP via nodemailer. Works with any SMTP server; the documented default is
 * Gmail (smtp.gmail.com:465) with a Google App Password, which lets you send to
 * any recipient from your own Gmail without owning a domain.
 *
 * Config (in `.env`): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS. With no
 * SMTP_USER/SMTP_PASS it falls back to dev mode (code logged, nothing sent).
 */
async function sendViaSmtp(email: string, code: string): Promise<EmailResult> {
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER?.trim();
  // Google App Passwords are displayed in 4 space-separated groups; the spaces
  // are cosmetic, so strip all whitespace to accept either form.
  const pass = process.env.SMTP_PASS?.replace(/\s+/g, "");
  if (!user || !pass) return devFallback("smtp", email, code);

  // Gmail requires the From address to be the authenticated account; default to
  // it when EMAIL_FROM isn't set so the send isn't rejected.
  const from = process.env.EMAIL_FROM?.trim() || `Aurora Health <${user}>`;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
      auth: { user, pass },
    });

    const info = await transporter.sendMail({
      from,
      to: email,
      subject: `${code} is your Aurora Health verification code`,
      html: otpEmailHtml(code),
      text: otpEmailText(code),
    });

    return { delivered: true, dev: false, id: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP error";
    console.error("[email/smtp] send failed:", message);
    return { delivered: false, dev: false, error: message };
  }
}

/** Resend transactional email — https://resend.com/docs/api-reference/emails */
async function sendViaResend(email: string, code: string): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return devFallback("resend", email, code);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress(),
        to: [email],
        subject: `${code} is your Aurora Health verification code`,
        html: otpEmailHtml(code),
        text: otpEmailText(code),
      }),
      cache: "no-store",
    });

    const body = (await res.json().catch(() => null)) as
      | { id?: string; message?: string; name?: string }
      | null;

    if (!res.ok || !body?.id) {
      const message = body?.message ?? `HTTP ${res.status}`;
      console.error("[email/resend] send failed:", message);
      return { delivered: false, dev: false, error: message };
    }

    return { delivered: true, dev: false, id: body.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    console.error("[email/resend] request threw:", message);
    return { delivered: false, dev: false, error: message };
  }
}

/** No key configured: log the code so local dev works without a provider. */
function devFallback(
  provider: Provider,
  email: string,
  code: string,
  note?: string,
): EmailResult {
  const suffix = note ? ` (${note})` : "";
  console.info(
    `[email/${provider}] DEV MODE${suffix} — no email sent. OTP for ${email} is ${code}`,
  );
  return { delivered: false, dev: true };
}

/** Minimal, self-contained HTML for the passcode email. */
function otpEmailHtml(code: string): string {
  const spaced = code.split("").join("&nbsp;");
  return `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;background:#f1f5f9;padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table role="presentation" width="440" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px -12px rgba(2,44,72,.25);">
            <tr>
              <td style="background:linear-gradient(135deg,#062b45,#065f5b);padding:28px 32px;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:.2px;">
                Aurora Health
              </td>
            </tr>
            <tr>
              <td style="padding:32px;color:#0f172a;">
                <p style="margin:0 0 8px;font-size:16px;font-weight:600;">Verify your sign-in</p>
                <p style="margin:0 0 24px;font-size:14px;line-height:22px;color:#475569;">
                  Use the six-digit code below to finish signing in to your patient portal. It expires in 5 minutes.
                </p>
                <div style="text-align:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:18px 0;font-size:30px;font-weight:700;letter-spacing:8px;color:#0f172a;">
                  ${spaced}
                </div>
                <p style="margin:24px 0 0;font-size:12px;line-height:20px;color:#94a3b8;">
                  Didn't request this? You can safely ignore this email — no one can sign in without the code.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Plain-text fallback for clients that don't render HTML. */
function otpEmailText(code: string): string {
  return [
    "Aurora Health — verify your sign-in",
    "",
    `Your six-digit code is: ${code}`,
    "It expires in 5 minutes.",
    "",
    "Didn't request this? You can safely ignore this email.",
  ].join("\n");
}
