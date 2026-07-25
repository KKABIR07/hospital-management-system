import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Route protection for the portals.
 *
 * Only portals whose id is in `PROTECTED_ROLES` require a real session; the
 * others remain the open demo. To gate every portal (once staff accounts exist),
 * add their ids here. A visitor without a valid session — or with a session for
 * a different role — is bounced to that portal's sign-in page.
 */
const PROTECTED_ROLES = new Set(["patient"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match /portal/<role> and capture the role segment.
  const match = pathname.match(/^\/portal\/([^/]+)/);
  if (!match) return NextResponse.next();

  const role = match[1];
  if (!PROTECTED_ROLES.has(role)) return NextResponse.next();

  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  // Valid session for the matching role → allow through.
  if (session && session.role === role) return NextResponse.next();

  // Otherwise send them to sign in, remembering where they were headed.
  const loginUrl = new URL(`/login/${role}`, request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Run only for portal routes; skip static assets and API.
  matcher: ["/portal/:path*"],
};
