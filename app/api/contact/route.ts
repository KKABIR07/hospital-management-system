import { NextResponse } from "next/server";

import { validateContact } from "@/lib/validation";

/**
 * Contact form endpoint.
 *
 * Validates the submission server-side and (currently) logs it. Wire the
 * marked section to your email provider (Resend, SendGrid, SES…) or CRM to
 * make it live — the request/response contract stays the same.
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
    // ---- Integration point ----------------------------------------------
    // e.g. await sendEmail({ to: siteConfig.email, ...result.data })
    //      await crm.createLead(result.data)
    console.info("[contact] new enquiry", {
      name: result.data!.name,
      email: result.data!.email,
      department: result.data!.department ?? "—",
    });
    // ---------------------------------------------------------------------

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
