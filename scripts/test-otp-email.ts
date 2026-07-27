// Standalone real-email test for the patient OTP sender.
//
// Sends a real 6-digit code through the SAME code the app uses (lib/email.ts),
// so it exercises whichever provider EMAIL_PROVIDER selects (smtp / resend). It
// bypasses the database, so it works even while MongoDB (port 27017) is blocked —
// SMTP (465) and Resend (443) are unaffected by that.
//
// Usage:
//   npx tsx scripts/test-otp-email.ts you@example.com

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { sendOtpEmail } from "../lib/email";

const here = dirname(fileURLToPath(import.meta.url));

// Load .env into process.env (no dotenv dependency). Runs before main(), and the
// sender reads these at call-time, so a static import above is fine.
try {
  const text = readFileSync(join(here, "..", ".env"), "utf8");
  for (const line of text.split(/\r?\n/)) {
    if (line.trim().startsWith("#")) continue;
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
} catch {
  /* no .env — provider will fall back to dev mode */
}

async function main() {
  const to = process.argv[2];
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    console.error("Usage: npx tsx scripts/test-otp-email.ts <recipient-email>");
    process.exit(1);
  }

  const code = String(Math.floor(Math.random() * 1_000_000)).padStart(6, "0");
  console.log(`Sending test OTP to ${to} via EMAIL_PROVIDER=${process.env.EMAIL_PROVIDER ?? "resend"} …`);

  const result = await sendOtpEmail(to, code);

  if (result.dev) {
    console.log(`\nℹ️  DEV MODE — no credentials configured, nothing sent.`);
    console.log(`   For SMTP set SMTP_USER + SMTP_PASS in .env; for Resend set RESEND_API_KEY.`);
    console.log(`   (The code would have been: ${code})`);
    return;
  }
  if (!result.delivered) {
    console.error(`\n❌ FAILED: ${result.error ?? "unknown error"}`);
    console.error(`\nGmail tips: SMTP_PASS must be a 16-char App Password (not your login password),`);
    console.error(`and 2-Step Verification must be ON for the account.`);
    process.exit(1);
  }

  console.log(`\n✅ Sent for real. Check the inbox (and Spam/Promotions).`);
  console.log(`   id   : ${result.id ?? "(none)"}`);
  console.log(`   to   : ${to}`);
  console.log(`   code : ${code}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
