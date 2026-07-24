"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  CalendarDays,
  Check,
  CircleCheck,
  Clock,
  RotateCcw,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Reveal } from "@/components/motion-primitives";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { departments, doctors, timeSlots } from "@/lib/data";
import { cn, getUpcomingDays } from "@/lib/utils";
import type { BookingState, BookingStep } from "@/types";

const STEPS: { id: BookingStep; label: string }[] = [
  { id: "department", label: "Department" },
  { id: "doctor", label: "Doctor" },
  { id: "date", label: "Date" },
  { id: "time", label: "Time" },
  { id: "confirm", label: "Confirm" },
];

const PROMPTS: Record<BookingStep, string> = {
  department: "Which department do you need? I'll match you with the right specialist.",
  doctor: "Great choice. Here are the consultants available in that department.",
  date: "When would you like to come in? These are the next open days.",
  time: "Almost there — pick a slot that suits you.",
  confirm: "Here's your appointment summary. Shall I lock it in?",
};

interface ChatMessage {
  id: number;
  role: "bot" | "user";
  text: string;
}

const initialBooking: BookingState = { department: null, doctor: null, date: null, time: null };

export function AiBooking() {
  const [stepIndex, setStepIndex] = useState(0);
  const [booking, setBooking] = useState<BookingState>(initialBooking);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: "bot", text: "How can we help you today?" },
    { id: 1, role: "bot", text: PROMPTS.department },
  ]);
  const [typing, setTyping] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [days, setDays] = useState<ReturnType<typeof getUpcomingDays>>([]);

  const messageId = useRef(2);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const step = STEPS[stepIndex].id;

  // Dates are resolved after mount so SSR and client markup always agree.
  useEffect(() => setDays(getUpcomingDays(7)), []);

  // Clear pending typing timers on unmount.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Keep the newest bubble in view without scrolling the page itself.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, step]);

  const availableDoctors = useMemo(() => {
    const dept = departments.find((item) => item.id === booking.department);
    if (!dept) return [];
    return doctors.filter((doctor) => dept.doctors.includes(doctor.id));
  }, [booking.department]);

  const selected = useMemo(
    () => ({
      department: departments.find((item) => item.id === booking.department),
      doctor: doctors.find((item) => item.id === booking.doctor),
      day: days.find((item) => item.value === booking.date),
    }),
    [booking, days],
  );

  function push(role: ChatMessage["role"], text: string) {
    setMessages((prev) => [...prev, { id: messageId.current++, role, text }]);
  }

  function advance(userText: string, patch: Partial<BookingState>) {
    // Ignore double-taps while the assistant is still "typing", otherwise two
    // queued timeouts would both advance the step and desync the transcript.
    if (typing) return;

    push("user", userText);
    setBooking((prev) => ({ ...prev, ...patch }));
    setTyping(true);

    const next = Math.min(stepIndex + 1, STEPS.length - 1);
    const timer = setTimeout(() => {
      setTyping(false);
      push("bot", PROMPTS[STEPS[next].id]);
      setStepIndex(next);
    }, 760);

    timers.current.push(timer);
  }

  function goBack() {
    if (stepIndex === 0 || typing) return;
    const prevIndex = stepIndex - 1;
    const key = STEPS[prevIndex].id as keyof BookingState;

    setStepIndex(prevIndex);
    setBooking((prev) => ({ ...prev, [key]: null }));
    setMessages((prev) => prev.slice(0, -2));
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    messageId.current = 2;
    setStepIndex(0);
    setBooking(initialBooking);
    setConfirmed(false);
    setTyping(false);
    setMessages([
      { id: 0, role: "bot", text: "How can we help you today?" },
      { id: 1, role: "bot", text: PROMPTS.department },
    ]);
  }

  const progress = confirmed ? 100 : (stepIndex / (STEPS.length - 1)) * 100;

  return (
    <section id="booking" className="relative section-padding overflow-hidden bg-surface-muted/60">
      <div aria-hidden className="halo -right-32 top-10 size-[30rem] bg-primary-500/14" />
      <div aria-hidden className="halo -left-32 bottom-10 size-[26rem] bg-accent-500/14" />

      <div className="container-page relative z-10">
        <SectionHeading
          eyebrow="AI Appointment Booking"
          title={
            <>
              Book in under a minute, <span className="text-gradient">no phone queue</span>
            </>
          }
          description="Our assistant checks live consultant availability while you choose — so every slot you see is a slot you can actually get."
        />

        <Reveal delay={0.12} className="mx-auto mt-14 max-w-4xl">
          <div className="glass gradient-ring overflow-hidden rounded-5xl">
            {/* ---------- Header + progress ---------- */}
            <div className="border-b border-border/70 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="relative grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                    <Bot className="size-5" />
                    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface bg-accent-500" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold tracking-tight">Aurora Assistant</p>
                    <p className="text-xs text-accent-600 dark:text-accent-300">Online · replies instantly</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {stepIndex > 0 && !confirmed && (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ArrowLeft className="size-3.5" />
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <RotateCcw className="size-3.5" />
                    Restart
                  </button>
                </div>
              </div>

              {/* Step rail */}
              <div className="mt-5">
                <div className="relative h-1 rounded-full bg-foreground/8">
                  <motion.span
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                  />
                </div>
                <ol className="mt-3 flex justify-between">
                  {STEPS.map((item, index) => {
                    const done = confirmed || index < stepIndex;
                    const current = !confirmed && index === stepIndex;

                    return (
                      <li key={item.id} className="flex flex-col items-center gap-1.5">
                        <span
                          className={cn(
                            "grid size-6 place-items-center rounded-full text-[0.62rem] font-bold transition-all duration-300",
                            done && "bg-gradient-to-br from-primary-500 to-accent-500 text-white",
                            current && "bg-primary-500/15 text-primary-600 ring-2 ring-primary-500/40 dark:text-primary-300",
                            !done && !current && "bg-foreground/8 text-muted-foreground",
                          )}
                        >
                          {done ? <Check className="size-3.5" /> : index + 1}
                        </span>
                        <span
                          className={cn(
                            "hidden text-[0.68rem] font-semibold sm:block",
                            current ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {item.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* ---------- Conversation ---------- */}
            <div
              ref={scrollRef}
              className="max-h-[26rem] space-y-4 overflow-y-auto px-6 py-6 sm:px-8"
              role="log"
              aria-live="polite"
            >
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 14, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("flex gap-3", message.role === "user" && "flex-row-reverse")}
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-xl text-white",
                        message.role === "bot"
                          ? "bg-gradient-to-br from-primary-500 to-accent-500"
                          : "bg-foreground/80",
                      )}
                    >
                      {message.role === "bot" ? <Sparkles className="size-4" /> : <Check className="size-4" />}
                    </span>
                    <p
                      className={cn(
                        "max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed",
                        message.role === "bot"
                          ? "rounded-tl-md bg-surface text-foreground shadow-sm"
                          : "rounded-tr-md bg-gradient-to-br from-primary-600 to-primary-500 text-white",
                      )}
                    >
                      {message.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
                    <Sparkles className="size-4" />
                  </span>
                  <span className="flex items-center gap-1.5 rounded-3xl rounded-tl-md bg-surface px-4 py-4 shadow-sm">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.15 }}
                        className="size-1.5 rounded-full bg-primary-500"
                      />
                    ))}
                    <span className="sr-only">Assistant is typing</span>
                  </span>
                </motion.div>
              )}
            </div>

            {/* ---------- Interactive step panel ---------- */}
            <div className="border-t border-border/70 bg-surface/40 px-6 py-6 sm:px-8">
              <AnimatePresence mode="wait">
                {confirmed ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4 py-4 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                      className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-accent-500 to-primary-500 text-white shadow-[0_18px_40px_-14px_rgba(16,185,129,0.9)]"
                    >
                      <CircleCheck className="size-8" />
                    </motion.span>
                    <div>
                      <p className="font-display text-xl font-bold">Appointment confirmed</p>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        {selected.doctor?.name} · {selected.day?.weekday} {selected.day?.day} {selected.day?.month} ·{" "}
                        {booking.time}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        A confirmation has been sent to your phone and email. Reschedule free up to 2 hours before.
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={reset}>
                      <RotateCcw className="size-4" />
                      Book another appointment
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === "department" && (
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                        {departments.map((dept) => (
                          <OptionButton
                            key={dept.id}
                            onClick={() => advance(dept.name, { department: dept.id, doctor: null })}
                          >
                            <dept.icon className="size-4 text-primary-500" />
                            {dept.name}
                          </OptionButton>
                        ))}
                      </div>
                    )}

                    {step === "doctor" && (
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {availableDoctors.map((doctor) => (
                          <OptionButton
                            key={doctor.id}
                            className="justify-start text-left"
                            onClick={() => advance(doctor.name, { doctor: doctor.id })}
                          >
                            <Stethoscope className="size-4 shrink-0 text-primary-500" />
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate font-semibold">{doctor.name}</span>
                              <span className="truncate text-xs font-normal text-muted-foreground">
                                {doctor.experience} yrs · ★ {doctor.rating}
                              </span>
                            </span>
                          </OptionButton>
                        ))}
                      </div>
                    )}

                    {step === "date" && (
                      <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-7">
                        {days.map((day) => (
                          <OptionButton
                            key={day.value}
                            className="flex-col gap-0.5 px-2 py-3"
                            onClick={() =>
                              advance(
                                day.isToday ? "Today" : `${day.weekday}, ${day.day} ${day.month}`,
                                { date: day.value },
                              )
                            }
                          >
                            <span className="text-[0.62rem] font-semibold uppercase tracking-wide text-muted-foreground">
                              {day.isToday ? "Today" : day.weekday}
                            </span>
                            <span className="font-display text-lg font-bold">{day.day}</span>
                            <span className="text-[0.62rem] text-muted-foreground">{day.month}</span>
                          </OptionButton>
                        ))}
                      </div>
                    )}

                    {step === "time" && (
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        {timeSlots.map((slot) => (
                          <OptionButton key={slot} onClick={() => advance(slot, { time: slot })}>
                            <Clock className="size-3.5 text-primary-500" />
                            {slot}
                          </OptionButton>
                        ))}
                      </div>
                    )}

                    {step === "confirm" && (
                      <div className="flex flex-col gap-5">
                        <dl className="grid gap-3 rounded-3xl bg-surface p-5 text-sm shadow-sm sm:grid-cols-2">
                          <SummaryRow label="Department" value={selected.department?.name} />
                          <SummaryRow label="Consultant" value={selected.doctor?.name} />
                          <SummaryRow
                            label="Date"
                            value={
                              selected.day
                                ? `${selected.day.weekday}, ${selected.day.day} ${selected.day.month}`
                                : undefined
                            }
                          />
                          <SummaryRow label="Time" value={booking.time ?? undefined} />
                        </dl>

                        <Button size="lg" className="w-full" onClick={() => setConfirmed(true)}>
                          <CalendarDays className="size-5" />
                          Confirm Appointment
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OptionButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold shadow-sm transition-colors duration-300 hover:border-primary-500/50 hover:bg-primary-500/8",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value ?? "—"}</dd>
    </div>
  );
}
