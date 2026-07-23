"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  FileText,
  FlaskConical,
  MapPin,
  ReceiptText,
  Sparkles,
  Video,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { departments, doctors, timeSlots } from "@/lib/data";
import {
  formatCurrency,
  invoices as seedInvoices,
  patientProfile,
  upcomingAppointments as seedUpcoming,
  visitHistory,
} from "@/lib/patient";
import { cn } from "@/lib/utils";
import type { AppointmentMode, PatientAppointment, PatientInvoice } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const tabs = [
  { id: "upcoming", label: "Upcoming", icon: CalendarClock },
  { id: "book", label: "Book Appointment", icon: CalendarPlus },
  { id: "history", label: "History", icon: Clock },
  { id: "billing", label: "Billing", icon: ReceiptText },
] as const;

type TabId = (typeof tabs)[number]["id"];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-accent-500/12 text-accent-600 dark:text-accent-300",
  Pending: "bg-amber-500/12 text-amber-600 dark:text-amber-300",
  Completed: "bg-primary-500/12 text-primary-600 dark:text-primary-300",
  Cancelled: "bg-danger-500/12 text-danger-600 dark:text-danger-400",
};

const modeIcon: Record<AppointmentMode, typeof MapPin> = {
  "In-person": MapPin,
  "Video consult": Video,
  "Lab visit": FlaskConical,
};

function firstDoctorOf(departmentId: string) {
  const dept = departments.find((item) => item.id === departmentId);
  const doctorId = dept?.doctors[0];
  return doctors.find((item) => item.id === doctorId)?.name ?? "Next available specialist";
}

export function PatientDashboard() {
  const [tab, setTab] = useState<TabId>("upcoming");
  const [upcoming, setUpcoming] = useState<PatientAppointment[]>(seedUpcoming);
  const [invoices, setInvoices] = useState<PatientInvoice[]>(seedInvoices);
  const [toast, setToast] = useState<string | null>(null);
  const [minDate, setMinDate] = useState("");

  // Booking form state
  const [dept, setDept] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => setMinDate(new Date().toISOString().slice(0, 10)), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const amountDue = useMemo(
    () => invoices.filter((inv) => inv.status === "Due").reduce((sum, inv) => sum + inv.amount, 0),
    [invoices],
  );
  const reportsReady = visitHistory.filter((visit) => visit.reportReady).length;

  const stats = [
    { label: "Upcoming visits", value: String(upcoming.length), icon: CalendarClock, tint: "text-primary-500" },
    { label: "Reports ready", value: String(reportsReady), icon: FileText, tint: "text-accent-500" },
    { label: "Amount due", value: formatCurrency(amountDue), icon: CreditCard, tint: "text-danger-500" },
  ];

  function bookAppointment(event: React.FormEvent) {
    event.preventDefault();
    if (!dept || !date || !time) {
      setFormError("Choose a department, date and time to continue.");
      return;
    }
    setFormError(null);
    const departmentName = departments.find((item) => item.id === dept)?.name ?? "General";
    const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const appointment: PatientAppointment = {
      id: `apt-${Date.now()}`,
      doctor: firstDoctorOf(dept),
      department: departmentName,
      date: formattedDate,
      time,
      mode: "In-person",
      status: "Pending",
    };
    setUpcoming((prev) => [appointment, ...prev]);
    setDept(null);
    setDate("");
    setTime(null);
    setReason("");
    setTab("upcoming");
    setToast("Appointment requested — we'll confirm by SMS shortly.");
  }

  function cancelAppointment(id: string) {
    setUpcoming((prev) => prev.filter((apt) => apt.id !== id));
    setToast("Appointment cancelled.");
  }

  function payInvoice(id: string) {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "Paid" } : inv)));
    setToast("Payment successful — demo only, no charge was made.");
  }

  return (
    <main className="container-page flex-1 py-10">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-4 top-20 z-50 mx-auto flex w-fit max-w-[90vw] items-center gap-2.5 rounded-full border border-accent-500/30 bg-accent-500/15 px-5 py-3 text-sm font-semibold text-accent-700 shadow-lg backdrop-blur-md dark:text-accent-200"
            role="status"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting */}
      <div className="flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 w-fit dark:text-amber-300">
        <Sparkles className="size-3.5" />
        Demo dashboard — signed in as a guest
      </div>
      <h1 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Hello, {patientProfile.name.split(" ")[0]}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Patient ID {patientProfile.id} · Member since {patientProfile.memberSince}
      </p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="glass flex items-center gap-4 rounded-3xl p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface-muted">
              <stat.icon className={cn("size-5", stat.tint)} />
            </span>
            <span className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </span>
              <span className="font-display text-2xl font-bold">{stat.value}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-3">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                active ? "text-white" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="patient-tab"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary-600 to-primary-500"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <item.icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Panels — keyed motion.div re-mounts on tab change (no AnimatePresence
          "wait" wrapper, which can freeze same-key content updates). */}
      <div className="mt-8">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          {tab === "upcoming" && (
            <UpcomingPanel items={upcoming} onCancel={cancelAppointment} onBook={() => setTab("book")} />
          )}
          {tab === "book" && (
            <BookPanel
              dept={dept}
              setDept={setDept}
              date={date}
              setDate={setDate}
              minDate={minDate}
              time={time}
              setTime={setTime}
              reason={reason}
              setReason={setReason}
              error={formError}
              onSubmit={bookAppointment}
            />
          )}
          {tab === "history" && <HistoryPanel onDownload={() => setToast("Report download is a demo action.")} />}
          {tab === "billing" && <BillingPanel invoices={invoices} amountDue={amountDue} onPay={payInvoice} />}
        </motion.div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", statusStyles[status] ?? "bg-surface-muted")}>
      {status}
    </span>
  );
}

function UpcomingPanel({
  items,
  onCancel,
  onBook,
}: {
  items: PatientAppointment[];
  onCancel: (id: string) => void;
  onBook: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="glass flex flex-col items-center gap-4 rounded-4xl p-12 text-center">
        <CalendarClock className="size-10 text-muted-foreground" />
        <p className="text-muted-foreground">You have no upcoming appointments.</p>
        <Button onClick={onBook}>
          <CalendarPlus className="size-4.5" />
          Book an appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((apt) => {
        const ModeIcon = modeIcon[apt.mode];
        return (
          <div key={apt.id} className="glass flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-400 font-display text-lg font-bold text-white">
                {apt.doctor.replace("Dr. ", "").charAt(0)}
              </span>
              <div>
                <p className="font-display text-base font-bold">{apt.doctor}</p>
                <p className="text-sm text-muted-foreground">{apt.department}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="size-4" />
                    {apt.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4" />
                    {apt.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ModeIcon className="size-4" />
                    {apt.mode}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <StatusBadge status={apt.status} />
              <button
                type="button"
                onClick={() => onCancel(apt.id)}
                className="inline-flex items-center gap-1 text-sm font-semibold text-danger-600 transition-colors hover:text-danger-700 dark:text-danger-400"
              >
                <X className="size-4" />
                Cancel
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BookPanel({
  dept,
  setDept,
  date,
  setDate,
  minDate,
  time,
  setTime,
  reason,
  setReason,
  error,
  onSubmit,
}: {
  dept: string | null;
  setDept: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  minDate: string;
  time: string | null;
  setTime: (value: string) => void;
  reason: string;
  setReason: (value: string) => void;
  error: string | null;
  onSubmit: (event: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="glass rounded-4xl p-6 sm:p-8">
      <h2 className="font-display text-xl font-bold tracking-tight">Book a new appointment</h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Pick a department and a preferred slot — we&apos;ll match you with the right specialist.
      </p>

      {/* Department */}
      <div className="mt-7">
        <Label>Department</Label>
        <div className="flex flex-wrap gap-2">
          {departments.map((item) => {
            const active = dept === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDept(item.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                  active
                    ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300"
                    : "border-border text-muted-foreground hover:border-primary-500/40 hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="appt-date">Preferred date</Label>
          <Input
            id="appt-date"
            type="date"
            min={minDate || undefined}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="appt-reason">Reason (optional)</Label>
          <Input
            id="appt-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. follow-up, chest pain…"
          />
        </div>
      </div>

      {/* Time */}
      <div className="mt-6">
        <Label>Preferred time</Label>
        <div className="flex flex-wrap gap-2">
          {timeSlots.map((slot) => {
            const active = time === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setTime(slot)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                  active
                    ? "border-primary-500 bg-primary-500/10 text-primary-600 dark:text-primary-300"
                    : "border-border text-muted-foreground hover:border-primary-500/40 hover:text-foreground",
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="mt-5 text-sm font-medium text-danger-600 dark:text-danger-400" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
        <CalendarPlus className="size-4.5" />
        Request appointment
      </Button>
    </form>
  );
}

function HistoryPanel({ onDownload }: { onDownload: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      {visitHistory.map((visit) => (
        <div key={visit.id} className="glass flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
              <FileText className="size-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-display text-base font-bold">{visit.doctor}</p>
                <span className="text-sm text-muted-foreground">{visit.department}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{visit.summary}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <Clock className="size-3.5" />
                {visit.date}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            {visit.reportReady ? (
              <Button variant="soft" size="sm" onClick={onDownload}>
                <Download className="size-4" />
                Report
              </Button>
            ) : (
              <span className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                Report pending
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function BillingPanel({
  invoices,
  amountDue,
  onPay,
}: {
  invoices: PatientInvoice[];
  amountDue: number;
  onPay: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="glass flex flex-col items-start justify-between gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Total outstanding</p>
          <p className="mt-1 font-display text-3xl font-bold">{formatCurrency(amountDue)}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-semibold",
            amountDue > 0 ? "bg-danger-500/12 text-danger-600 dark:text-danger-400" : "bg-accent-500/12 text-accent-600 dark:text-accent-300",
          )}
        >
          {amountDue > 0 ? "Payment due" : "All settled"}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {invoices.map((inv) => (
          <div key={inv.id} className="glass flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-surface-muted text-muted-foreground">
                <ReceiptText className="size-5" />
              </span>
              <div>
                <p className="font-display text-base font-bold">{inv.description}</p>
                <p className="text-sm text-muted-foreground">
                  {inv.id} · {inv.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:justify-end">
              <span className="font-display text-lg font-bold">{formatCurrency(inv.amount)}</span>
              {inv.status === "Due" ? (
                <Button size="sm" onClick={() => onPay(inv.id)}>
                  <CreditCard className="size-4" />
                  Pay now
                </Button>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/12 px-3 py-1.5 text-xs font-semibold text-accent-600 dark:text-accent-300">
                  <CheckCircle2 className="size-3.5" />
                  Paid
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
