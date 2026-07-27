import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { BCRYPT_ROUNDS, toDbRole, toUiRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateRegister } from "@/lib/validation";

/**
 * Create a portal account.
 *
 * The password is hashed with bcrypt before storage — plaintext never touches
 * the database. This endpoint establishes accounts; it does not issue a session
 * (no cookie/JWT). Layer NextAuth or your session strategy on top when you're
 * ready for real sign-in state.
 */
export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validateRegister(json);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors: result.errors },
      { status: 422 },
    );
  }

  const data = result.data!;

  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: toDbRole(data.role),
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Account created.",
        user: { id: user.id, name: user.name, email: user.email, role: toUiRole(user.role) },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[auth/register] failed", error);
    return NextResponse.json(
      { ok: false, message: "Could not create the account. Please try again." },
      { status: 500 },
    );
  }
}
