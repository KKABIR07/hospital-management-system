/**
 * Cookie-based session auth.
 *
 * A signed JWT (HS256) is stored in an httpOnly cookie — the client can't read
 * or forge it, and it's verified on every protected request. `jose` is used
 * (not `jsonwebtoken`) because it runs in the Edge runtime, so the same verify
 * works in middleware and in Node route handlers / server components.
 *
 * This is stateless: the token itself carries the user identity, so there's no
 * session table to hit. Revocation is therefore coarse (change AUTH_SECRET to
 * invalidate everything, or shorten the lifetime); add a DB session store if you
 * need per-session logout.
 */

import { SignJWT, jwtVerify } from "jose";

import type { PortalRoleId } from "@/types";

export const SESSION_COOKIE = "aurora_session";

/** Session lifetime — 7 days. */
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export interface SessionUser {
  id: string;
  name: string;
  role: PortalRoleId;
  phone?: string;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a long random value in .env (see .env.example).",
    );
  }
  return new TextEncoder().encode(secret);
}

/** Sign a session token for a user. */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ name: user.name, role: user.role, phone: user.phone })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

/** Verify a token and return the session user, or null if invalid/expired. */
export async function verifySessionToken(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.role !== "string") return null;
    return {
      id: payload.sub,
      name: typeof payload.name === "string" ? payload.name : "",
      role: payload.role as PortalRoleId,
      phone: typeof payload.phone === "string" ? payload.phone : undefined,
    };
  } catch {
    return null;
  }
}

/** Cookie options shared by set/clear so they always match. */
export function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

/**
 * Read the current session in a server component or route handler (Node runtime).
 * Middleware reads the cookie off the request directly instead.
 *
 * `next/headers` is imported lazily so this module stays free of Node-only
 * imports in the static graph — that lets middleware (Edge runtime) import the
 * verify/sign helpers above without pulling `next/headers` into its bundle.
 */
export async function getSession(): Promise<SessionUser | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
