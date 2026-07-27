import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

import { BCRYPT_ROUNDS, toUiRole } from "@/lib/auth";
import { normalizeEmail, OTP_MAX_ATTEMPTS } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  sessionCookieOptions,
} from "@/lib/session";
import { validateEmailOtpVerify } from "@/lib/validation";

/**
 * Complete a patient email-OTP login.
 *
 * Verifies the code against the most recent live challenge for the address, with
 * expiry + attempt-count guards. On success it finds — or creates — the Patient
 * and linked User record for that email, so a first-time address is onboarded as
 * a real account, then sets the signed session cookie.
 */
export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validateEmailOtpVerify(json);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the code and try again.", errors: result.errors },
      { status: 422 },
    );
  }

  const email = normalizeEmail(result.data!.email);
  if (!email) {
    return NextResponse.json({ ok: false, message: "That email address looks invalid." }, { status: 422 });
  }
  const { code } = result.data!;

  try {
    const challenge = await prisma.otpChallenge.findFirst({
      where: { email, consumed: false },
      orderBy: { createdAt: "desc" },
    });

    if (!challenge) {
      return NextResponse.json(
        { ok: false, message: "No active code. Please request a new one." },
        { status: 400 },
      );
    }

    if (challenge.expiresAt.getTime() < Date.now()) {
      await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumed: true, consumedAt: new Date() } });
      return NextResponse.json(
        { ok: false, message: "That code has expired. Please request a new one." },
        { status: 400 },
      );
    }

    if (challenge.attempts >= OTP_MAX_ATTEMPTS) {
      await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumed: true, consumedAt: new Date() } });
      return NextResponse.json(
        { ok: false, message: "Too many attempts. Please request a new code." },
        { status: 429 },
      );
    }

    const matches = await bcrypt.compare(code, challenge.codeHash);
    if (!matches) {
      const attempts = challenge.attempts + 1;
      const burn = attempts >= OTP_MAX_ATTEMPTS;
      await prisma.otpChallenge.update({
        where: { id: challenge.id },
        // Burn the challenge once the attempt ceiling is hit.
        data: { attempts, ...(burn ? { consumed: true, consumedAt: new Date() } : {}) },
      });
      const left = Math.max(0, OTP_MAX_ATTEMPTS - attempts);
      return NextResponse.json(
        { ok: false, message: left > 0 ? `Incorrect code. ${left} attempt${left === 1 ? "" : "s"} left.` : "Too many attempts. Please request a new code." },
        { status: 401 },
      );
    }

    // Correct — consume the challenge so the code can't be reused.
    await prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumed: true, consumedAt: new Date() } });

    const user = await findOrCreatePatientUser(email);
    const role = toUiRole(user.role);

    const token = await createSessionToken({
      id: user.id,
      name: user.name,
      role,
      phone: user.phone ?? undefined,
    });

    const response = NextResponse.json({
      ok: true,
      message: `Welcome, ${user.name}.`,
      user: { id: user.id, name: user.name, email: user.email, role },
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
    return response;
  } catch (error) {
    console.error("[auth/otp/email/verify] failed", error);
    return NextResponse.json(
      { ok: false, message: "Could not sign you in. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * Look up the patient login for an email, creating the Patient + User pair on
 * first sign-in. Email is the User table's real unique key, so a repeat sign-in
 * always resolves to the same account. Password login is disabled via a random
 * hash (patients authenticate by code, not password).
 */
async function findOrCreatePatientUser(email: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const local = email.split("@")[0] || "patient";
  const name = local.charAt(0).toUpperCase() + local.slice(1);
  const randomSecret = `${email}:${Date.now()}:${Math.random()}`;
  const passwordHash = await bcrypt.hash(randomSecret, BCRYPT_ROUNDS);

  // Collision-resistant MRN from the address (no phone for email-only accounts).
  const slug = email.replace(/[^a-z0-9]/gi, "").slice(0, 8).toUpperCase() || "USER";
  const patient = await prisma.patient.create({
    data: {
      mrn: `PE-${slug}-${Math.floor(Date.now() % 100000)}`,
      name,
      email,
      memberSince: String(new Date().getFullYear()),
    },
  });

  return prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: UserRole.PATIENT,
      patientId: patient.id,
    },
  });
}
