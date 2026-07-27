import { NextResponse } from "next/server";

import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

/**
 * Clear the session cookie. Stateless tokens can't be revoked server-side, so
 * "logout" simply deletes the cookie by overwriting it with an expired one.
 */
export async function POST() {
  const response = NextResponse.json({ ok: true, message: "Signed out." });
  // maxAge 0 tells the browser to drop the cookie immediately.
  response.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return response;
}
