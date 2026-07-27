import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateNewsletter } from "@/lib/validation";

/**
 * Newsletter subscription endpoint. Validates the email and stores the
 * subscriber. Push the email on to your ESP (Klaviyo, Mailchimp, Beehiiv…)
 * alongside the upsert if you want double opt-in.
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
    // Upsert keeps a repeat subscribe idempotent rather than erroring on the
    // unique email index.
    await prisma.newsletterSubscriber.upsert({
      where: { email: result.data!.email },
      update: {},
      create: { email: result.data!.email },
    });

    return NextResponse.json({ ok: true, message: "You're on the list — welcome to Aurora Health." });
  } catch (error) {
    console.error("[newsletter] failed to subscribe", error);
    return NextResponse.json(
      { ok: false, message: "Subscription failed. Please try again shortly." },
      { status: 500 },
    );
  }
}
