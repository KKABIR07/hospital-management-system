import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { validateContact } from "@/lib/validation";

/**
 * Contact form endpoint.
 *
 * Validates the submission server-side, then persists it as a Contact record.
 * Hook an email provider (Resend, SendGrid, SES…) or CRM in alongside the
 * insert if you also want to notify staff — the request/response contract
 * stays the same.
 */
export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validateContact(json);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors: result.errors },
      { status: 422 },
    );
  }

  try {
    await prisma.contact.create({
      data: {
        name: result.data!.name,
        email: result.data!.email,
        phone: result.data!.phone,
        department: result.data!.department ?? null,
        message: result.data!.message,
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Thank you — a patient coordinator will call you shortly.",
    });
  } catch (error) {
    console.error("[contact] failed to process enquiry", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong on our end. Please call our front desk." },
      { status: 500 },
    );
  }
}
