import { NextResponse } from "next/server";

import { toDbMode, toUiMode, toUiStatus } from "@/lib/appointments";
import { prisma } from "@/lib/prisma";
import { validateAppointment } from "@/lib/validation";

/**
 * Appointments endpoint.
 *
 * POST — book an appointment. Accepts a guest booking (name + contact) or,
 * with `mrn`, links the appointment to an existing patient record.
 * GET  — list upcoming appointments, newest first. Optional `?mrn=` filter
 * scopes to one patient (used by the portal dashboard).
 */
export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const result = validateAppointment(json);

  if (!result.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the highlighted fields.", errors: result.errors },
      { status: 422 },
    );
  }

  const data = result.data!;
  const mrn = typeof (json as Record<string, unknown>).mrn === "string"
    ? ((json as Record<string, unknown>).mrn as string).trim()
    : undefined;

  try {
    // Link to a patient when a known MRN is supplied; otherwise it's a guest booking.
    const patient = mrn ? await prisma.patient.findUnique({ where: { mrn } }) : null;

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient?.id ?? null,
        patientName: data.patientName,
        department: data.department,
        doctor: data.doctor,
        scheduledAt: new Date(data.scheduledAt),
        mode: toDbMode(data.mode),
        email: data.email ?? null,
        phone: data.phone ?? null,
        notes: data.notes ?? null,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Your appointment request is in — we'll confirm shortly.",
        appointment: { id: appointment.id, status: toUiStatus(appointment.status) },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[appointments] failed to create", error);
    return NextResponse.json(
      { ok: false, message: "Something went wrong on our end. Please call our front desk." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const mrn = new URL(request.url).searchParams.get("mrn")?.trim();

  try {
    const appointments = await prisma.appointment.findMany({
      where: mrn ? { patient: { mrn } } : undefined,
      orderBy: { scheduledAt: "asc" },
      take: 50,
    });

    return NextResponse.json({
      ok: true,
      appointments: appointments.map((a) => ({
        id: a.id,
        patientName: a.patientName,
        department: a.department,
        doctor: a.doctor,
        scheduledAt: a.scheduledAt.toISOString(),
        mode: toUiMode(a.mode),
        status: toUiStatus(a.status),
      })),
    });
  } catch (error) {
    console.error("[appointments] failed to list", error);
    return NextResponse.json(
      { ok: false, message: "Could not load appointments." },
      { status: 500 },
    );
  }
}
