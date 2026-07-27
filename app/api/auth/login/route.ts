import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { toUiRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  sessionCookieOptions,
} from "@/lib/session";
import { validateCredentials } from "@/lib/validation";

/**
 * Verify portal credentials.
 *
 * Compares the supplied password against the stored bcrypt hash. On success it
 * returns the user's public profile — it does NOT set a session cookie or JWT;
 * wire that in (NextAuth, iron-session, etc.) when you add real auth state.
 * A wrong email and a wrong password return the same generic message so the
 * endpoint doesn't reveal which accounts exist.
 */
export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validateCredentials(json);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors: result.errors },
      { status: 422 },
    );
  }

  const { email, password } = result.data!;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Hash a throwaway even when the user is missing, so response time doesn't
    // leak whether the email exists (timing-safe-ish against user enumeration).
    const hash = user?.passwordHash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva";
    const ok = await bcrypt.compare(password, hash);

    if (!user || !ok) {
      return NextResponse.json(
        { ok: false, message: "Invalid email or password." },
        { status: 401 },
      );
    }

    const role = toUiRole(user.role);
    const token = await createSessionToken({ id: user.id, name: user.name, role });

    const response = NextResponse.json({
      ok: true,
      message: `Welcome back, ${user.name}.`,
      user: { id: user.id, name: user.name, email: user.email, role },
    });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
    return response;
  } catch (error) {
    console.error("[auth/login] failed", error);
    return NextResponse.json(
      { ok: false, message: "Could not sign you in. Please try again." },
      { status: 500 },
    );
  }
}
