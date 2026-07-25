/**
 * Seed the demo patient, their history, and a demo portal login.
 *
 * Idempotent: re-runnable without piling up duplicates. Patient/user/invoices
 * are upserted on their unique keys; visits and appointments are cleared for the
 * demo patient and recreated (they have no natural unique key).
 *
 * Run with: npm run db:seed  (needs DATABASE_URL set and `npm run db:push` done).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// A clearly-fake demo login. CHANGE THIS before any real deployment.
const DEMO_EMAIL = "jordan.ellis@example.com";
const DEMO_PASSWORD = "aurora-demo-1234";

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const patient = await prisma.patient.upsert({
    where: { mrn: "PT-48210" },
    update: { name: "Jordan Ellis", phone: "+1 555 010 2233", memberSince: "2019" },
    create: {
      mrn: "PT-48210",
      name: "Jordan Ellis",
      phone: "+1 555 010 2233",
      email: DEMO_EMAIL,
      memberSince: "2019",
    },
  });

  // Portal login linked to the demo patient.
  await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: "Jordan Ellis", passwordHash, role: "PATIENT", patientId: patient.id },
    create: {
      email: DEMO_EMAIL,
      name: "Jordan Ellis",
      passwordHash,
      role: "PATIENT",
      patientId: patient.id,
    },
  });

  // Reset the demo patient's history so re-seeding stays clean.
  await prisma.visit.deleteMany({ where: { patientId: patient.id } });
  await prisma.appointment.deleteMany({ where: { patientId: patient.id } });

  await prisma.visit.createMany({
    data: [
      {
        patientId: patient.id,
        visitedAt: new Date("2026-07-02"),
        doctor: "Dr. Marcus Hale",
        department: "Emergency Medicine",
        summary: "Chest-pain assessment — ECG normal, discharged the same day.",
        reportReady: true,
      },
      {
        patientId: patient.id,
        visitedAt: new Date("2026-05-18"),
        doctor: "Dr. Ravi Menon",
        department: "Neurology",
        summary: "Migraine follow-up — medication adjusted, review in 3 months.",
        reportReady: true,
      },
      {
        patientId: patient.id,
        visitedAt: new Date("2026-03-10"),
        doctor: "Dr. Sofia Haddad",
        department: "Oncology",
        summary: "Routine screening panel — results clear.",
        reportReady: true,
      },
      {
        patientId: patient.id,
        visitedAt: new Date("2026-01-04"),
        doctor: "Dr. Amara Osei",
        department: "Cardiology",
        summary: "Annual heart check — echocardiogram within normal range.",
        reportReady: false,
      },
    ],
  });

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient.id,
        patientName: patient.name,
        doctor: "Dr. Amara Osei",
        department: "Cardiology",
        scheduledAt: new Date("2026-07-28T10:30:00"),
        mode: "IN_PERSON",
        status: "CONFIRMED",
      },
      {
        patientId: patient.id,
        patientName: patient.name,
        doctor: "Dr. Lena Fischer",
        department: "Pediatrics",
        scheduledAt: new Date("2026-07-31T13:15:00"),
        mode: "VIDEO_CONSULT",
        status: "PENDING",
      },
    ],
  });

  // Invoices keyed by their human reference so upsert stays idempotent.
  const invoices = [
    { reference: "INV-20482", issuedAt: new Date("2026-07-02"), description: "Emergency visit + ECG", amount: 240, status: "DUE" as const },
    { reference: "INV-19233", issuedAt: new Date("2026-05-18"), description: "Neurology consultation", amount: 120, status: "PAID" as const },
    { reference: "INV-18110", issuedAt: new Date("2026-03-10"), description: "Screening panel (bloodwork)", amount: 320, status: "PAID" as const },
  ];

  for (const invoice of invoices) {
    await prisma.invoice.upsert({
      where: { reference: invoice.reference },
      update: { ...invoice, patientId: patient.id },
      create: { ...invoice, patientId: patient.id },
    });
  }

  console.info("Seed complete.");
  console.info(`Demo patient: ${patient.mrn} (${patient.name})`);
  console.info(`Demo login:   ${DEMO_EMAIL} / ${DEMO_PASSWORD}  ← change before deploying`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
