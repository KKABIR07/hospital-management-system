import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

import { BCRYPT_ROUNDS, toUiRole } from "@/lib/auth";
import { normalizePhoneE164, OTP_MAX_ATTEMPTS, toLocalNumber } from "@/lib/otp";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  sessionCookieOptions,
} from "@/lib/session";
import { validateOtpVerify } from "@/lib/validation";

/**
 * Complete a patient SMS-OTP login.
 *
 * Verifies the code against the most recent live challenge for the number, with
 * expiry + attempt-count guards. On success it finds — or creates — the Patient
 * and linked User record for that phone, so a first-time number is onboarded as
 * a real account. Like the password login, this returns the profile but does
 * not yet set a session cookie/JWT (wire that in with your session strategy).
 */
export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validateOtpVerify(json);
  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the code and try again.", errors: result.errors },
      { status: 422 },
    );
  }

  const phone = normalizePhoneE164(result.data!.phone);
  if (!phone) {
    return NextResponse.json({ ok: false, message: "That mobile number looks invalid." }, { status: 422 });
  }
  const { code } = result.data!;

  try {
    const challenge = await prisma.otpChallenge.findFirst({
      where: { phone, consumed: false },
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

    const user = await findOrCreatePatientUser(phone);
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
      user: { id: user.id, name: user.name, phone: user.phone, role },
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
    return response;
  } catch (error) {
    console.error("[auth/otp/verify] failed", error);
    return NextResponse.json(
      { ok: false, message: "Could not sign you in. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * Look up the patient login for an E.164 number, creating the Patient + User
 * pair on first sign-in. Phone uniqueness is enforced here (see the schema note
 * on why it isn't a DB `@unique`).
 */
async function findOrCreatePatientUser(phone: string) {
  const existing = await prisma.user.findFirst({ where: { phone } });
  if (existing) return existing;

  const local = toLocalNumber(phone);
  const name = `Patient ${local.slice(-4)}`;
  // Synthetic, collision-free email so the required unique `email` is satisfied
  // for phone-only accounts. Password login is disabled via a random hash.
  const email = `p${phone.replace(/\D/g, "")}@patients.aurora.local`;
  const randomSecret = `${phone}:${Date.now()}:${Math.random()}`;
  const passwordHash = await bcrypt.hash(randomSecret, BCRYPT_ROUNDS);

  const patient = await prisma.patient.create({
    data: {
      mrn: `PT-${local}`,
      name,
      phone,
      memberSince: String(new Date().getFullYear()),
    },
  });

  return prisma.user.create({
    data: {
      email,
      phone,
      name,
      passwordHash,
      role: UserRole.PATIENT,
      patientId: patient.id,
    },
  });
}
