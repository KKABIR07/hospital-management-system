import { NextResponse } from "next/server";

import { validateNewsletter } from "@/lib/validation";

/**
 * Newsletter subscription endpoint. Validates the email and (currently) logs
 * it — connect to your ESP (Klaviyo, Mailchimp, Beehiiv…) at the marked line.
 */
export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validateNewsletter(json);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please enter a valid email address.", errors: result.errors },
      { status: 422 },
    );
  }

  try {
    // ---- Integration point: subscribe result.data!.email to your ESP ----
    console.info("[newsletter] new subscriber", result.data!.email);
    // ---------------------------------------------------------------------

    return NextResponse.json({ ok: true, message: "You're on the list — welcome to Aurora Health." });
  } catch (error) {
    console.error("[newsletter] failed to subscribe", error);
    return NextResponse.json(
      { ok: false, message: "Subscription failed. Please try again shortly." },
      { status: 500 },
    );
  }
}
