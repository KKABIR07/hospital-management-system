import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { BCRYPT_ROUNDS } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";
import {
  generateOtpCode,
  normalizeEmail,
  OTP_RESEND_COOLDOWN_MS,
  OTP_TTL_MS,
} from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import { validateEmailOtpRequest } from "@/lib/validation";

/**
 * Start a patient email-OTP login: issue a one-time code to an email address.
 *
 * Only a bcrypt hash of the code is stored; the plaintext lives only in the
 * email. A short cooldown per address throttles abuse. The response never
 * contains the code in production — in local dev (no email provider key) it
 * echoes `devCode` so you can complete the flow without a mailbox.
 */
export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validateEmailOtpRequest(json);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email address.", errors: result.errors },
      { status: 422 },
    );
  }

  const email = normalizeEmail(result.data!.email);
  if (!email) {
    return NextResponse.json(
      { ok: false, message: "That doesn't look like a valid email address.", errors: { email: "Enter a valid email address." } },
      { status: 422 },
    );
  }

  try {
    // Throttle: reject if a code was already issued within the cooldown window.
    const recent = await prisma.otpChallenge.findFirst({
      where: { email, consumed: false, createdAt: { gt: new Date(Date.now() - OTP_RESEND_COOLDOWN_MS) } },
      orderBy: { createdAt: "desc" },
    });
    if (recent) {
      const waitMs = OTP_RESEND_COOLDOWN_MS - (Date.now() - recent.createdAt.getTime());
      return NextResponse.json(
        { ok: false, message: `Please wait ${Math.ceil(waitMs / 1000)}s before requesting another code.` },
        { status: 429 },
      );
    }

    // Supersede any earlier unconsumed challenges for this address.
    await prisma.otpChallenge.updateMany({
      where: { email, consumed: false },
      data: { consumed: true, consumedAt: new Date() },
    });

    const code = generateOtpCode();
    const codeHash = await bcrypt.hash(code, BCRYPT_ROUNDS);

    await prisma.otpChallenge.create({
      data: { email, codeHash, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
    });

    const mail = await sendOtpEmail(email, code);

    if (!mail.delivered && !mail.dev) {
      // A real send was attempted and failed — surface a soft error.
      return NextResponse.json(
        { ok: false, message: "We couldn't send the code right now. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: mail.dev ? "Dev mode: code logged to the server console." : "We've sent a 6-digit code to your email.",
      email,
      dev: mail.dev,
      // Only ever present in dev mode (no provider key configured).
      ...(mail.dev ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error("[auth/otp/email/request] failed", error);
    return NextResponse.json(
      { ok: false, message: "Could not start sign-in. Please try again." },
      { status: 500 },
    );
  }
}
