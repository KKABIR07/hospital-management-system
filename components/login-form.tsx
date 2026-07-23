"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Info,
  Lock,
  Pencil,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { getPortalRole } from "@/lib/portal";
import { cn } from "@/lib/utils";
import type { PortalRole } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const accentMap = {
  primary: {
    text: "text-primary-600 dark:text-primary-300",
    chip: "border-primary-500/20 bg-primary-500/10 text-primary-700 dark:text-primary-300",
    accentVar: "accent-primary-600",
  },
  accent: {
    text: "text-accent-600 dark:text-accent-300",
    chip: "border-accent-500/20 bg-accent-500/10 text-accent-700 dark:text-accent-300",
    accentVar: "accent-accent-600",
  },
  danger: {
    text: "text-danger-600 dark:text-danger-400",
    chip: "border-danger-500/20 bg-danger-500/10 text-danger-700 dark:text-danger-400",
    accentVar: "accent-danger-600",
  },
};

type Accent = (typeof accentMap)[keyof typeof accentMap];

const noticeStyles =
  "flex items-start gap-2.5 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300";

/* ------------------------------------------------------------------ *
 * Staff — ID + password (demo only)
 * ------------------------------------------------------------------ */
function StaffCredentials({ role, accent }: { role: PortalRole; accent: Accent }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    window.setTimeout(() => router.push(`/portal/${role.id}`), 850);
  }

  return (
    <>
      <div className={cn("mt-6", noticeStyles)}>
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          Demo environment — no real authentication. Enter any {role.idLabel.toLowerCase()} and password
          (e.g. <span className="font-semibold">{role.idPlaceholder}</span>) to continue.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" noValidate>
        <div>
          <Label htmlFor="staff-id">{role.idLabel}</Label>
          <Input
            id="staff-id"
            name="staff-id"
            required
            autoComplete="username"
            placeholder={role.idPlaceholder}
            autoCapitalize="characters"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 text-muted-foreground">
            <input type="checkbox" name="remember" className={cn("size-4 rounded border-border", accent.accentVar)} />
            Remember me
          </label>
          <Link href="/#contact" className={cn("font-semibold hover:underline", accent.text)}>
            Forgot ID?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Signing in…
            </>
          ) : (
            <>
              <Lock className="size-4.5" />
              Sign in
              <ArrowRight className="size-4.5" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Patient — phone number + OTP (demo only, no SMS is sent)
 * ------------------------------------------------------------------ */
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function PatientOtpFlow({ role, accent }: { role: PortalRole; accent: Accent }) {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneValid = phoneDigits.length >= 7;
  const otpValue = otp.join("");
  const otpValid = otpValue.length === OTP_LENGTH;

  // Resend countdown.
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);

  function sendOtp(event?: React.FormEvent) {
    event?.preventDefault();
    if (!phoneValid) {
      setError("Enter a valid mobile number.");
      return;
    }
    setError(null);
    setSending(true);
    // Demo: no SMS is sent — we simply advance to the code step.
    window.setTimeout(() => {
      setSending(false);
      setStep("otp");
      setSeconds(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      window.setTimeout(() => inputsRef.current[0]?.focus(), 60);
    }, 700);
  }

  function resend() {
    if (seconds > 0) return;
    setError(null);
    setSeconds(RESEND_SECONDS);
    setOtp(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
  }

  function verify(event?: React.FormEvent) {
    event?.preventDefault();
    if (!otpValid) {
      setError("Enter the 6-digit code.");
      return;
    }
    setError(null);
    setVerifying(true);
    // Demo: any 6-digit code is accepted.
    window.setTimeout(() => router.push(`/portal/${role.id}`), 800);
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) inputsRef.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(event: React.ClipboardEvent<HTMLDivElement>) {
    const text = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    event.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    [...text].forEach((char, index) => (next[index] = char));
    setOtp(next);
    inputsRef.current[Math.min(text.length, OTP_LENGTH - 1)]?.focus();
  }

  if (step === "phone") {
    return (
      <motion.div key="phone" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <div className={cn("mt-6", noticeStyles)}>
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>
            Demo environment — no real SMS is sent. Enter any mobile number and we&apos;ll take you to the code step.
          </span>
        </div>

        <form onSubmit={sendOtp} className="mt-7 flex flex-col gap-5" noValidate>
          <div>
            <Label htmlFor="phone">Mobile number</Label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 grid w-11 place-items-center text-muted-foreground">
                <Phone className="size-4.5" />
              </span>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                placeholder="+1 555 010 2233"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="pl-11"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              We&apos;ll send a one-time code to verify it&apos;s you.
            </p>
          </div>

          {error && (
            <p className="text-sm font-medium text-danger-600 dark:text-danger-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={sending}>
            {sending ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Sending code…
              </>
            ) : (
              <>
                Send code
                <ArrowRight className="size-4.5" />
              </>
            )}
          </Button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div key="otp" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-foreground">{phone || "your phone"}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setStep("phone");
            setError(null);
          }}
          className={cn("inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline", accent.text)}
        >
          <Pencil className="size-3.5" />
          Change
        </button>
      </div>

      <div className={cn("mt-4", noticeStyles)}>
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          Demo — any 6-digit code works (e.g. <span className="font-semibold">123456</span>).
        </span>
      </div>

      <form onSubmit={verify} className="mt-6 flex flex-col gap-5" noValidate>
        <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
          {otp.map((digit, index) => (
            <input
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={digit}
              onChange={(event) => handleOtpChange(index, event.target.value)}
              onKeyDown={(event) => handleOtpKeyDown(index, event)}
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${index + 1}`}
              className="size-12 rounded-2xl border border-border bg-surface/60 text-center text-lg font-bold text-foreground outline-none transition-all duration-200 focus:border-primary-500 focus:bg-surface focus:shadow-[0_0_0_4px_rgba(21,101,192,0.14)] sm:size-14"
            />
          ))}
        </div>

        {error && (
          <p className="text-sm font-medium text-danger-600 dark:text-danger-400" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={verifying}>
          {verifying ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Verifying…
            </>
          ) : (
            <>
              <ShieldCheck className="size-4.5" />
              Verify &amp; continue
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t get a code?{" "}
          {seconds > 0 ? (
            <span>Resend in {seconds}s</span>
          ) : (
            <button type="button" onClick={resend} className={cn("font-semibold hover:underline", accent.text)}>
              Resend code
            </button>
          )}
        </p>
      </form>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * Shared shell
 * ------------------------------------------------------------------ */
export function LoginForm({ roleId }: { roleId: string }) {
  const role = getPortalRole(roleId);
  if (!role) return null;

  const accent = accentMap[role.accent];
  const Icon = role.icon;
  const isPatient = role.audience === "patient";

  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- Brand panel ---------- */}
      <aside className="relative hidden overflow-hidden bg-[linear-gradient(150deg,#04121f_0%,#062b45_48%,#065f5b_100%)] p-12 lg:flex lg:flex-col">
        <motion.div
          aria-hidden
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className={cn("absolute -left-24 top-10 size-[32rem] rounded-full blur-[120px]", `bg-gradient-to-br ${role.gradient}`)}
          style={{ opacity: 0.25 }}
        />

        <Link href="/" className="relative z-10 w-fit [&_span]:text-white">
          <Logo />
        </Link>

        <div className="relative z-10 mt-auto max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            <Icon className="size-4" />
            {role.name}
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-white">
            {role.tagline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">{role.blurb}</p>

          <ul className="mt-8 flex flex-col gap-3.5">
            {role.features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: EASE }}
                className="flex items-center gap-3 text-sm text-white/80"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 mt-12 flex items-center gap-2 text-xs text-white/45">
          <ShieldCheck className="size-3.5" />
          {isPatient ? "Your health data is private & encrypted" : "Staff access only · Protected environment"}
        </p>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main className="relative flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <Link href="/" className="mb-10 w-fit lg:hidden">
          <Logo />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto w-full max-w-md"
        >
          <Link
            href={isPatient ? "/" : "/login"}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            {isPatient ? "Back to home" : "All portals"}
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span className={cn("grid size-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-[0_14px_30px_-12px_rgba(21,101,192,0.6)]", role.gradient)}>
              <Icon className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight">Sign in</h1>
              <p className={cn("text-sm font-semibold", accent.text)}>{role.name}</p>
            </div>
          </div>

          {isPatient ? (
            <PatientOtpFlow role={role} accent={accent} />
          ) : (
            <StaffCredentials role={role} accent={accent} />
          )}

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isPatient ? "Need something else? " : "Not staff? "}
            <Link href="/" className={cn("font-semibold hover:underline", accent.text)}>
              Return to the main site
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
