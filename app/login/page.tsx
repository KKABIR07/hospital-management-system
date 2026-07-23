import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, UserRound } from "lucide-react";

import { Logo } from "@/components/icons";
import { staffPortalRoles } from "@/lib/portal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Staff Sign In",
  description: "Choose your Aurora Health staff portal — Doctor, Pathology, Lab or Admin.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default function LoginHubPage() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div aria-hidden className="halo left-1/2 top-0 size-[36rem] -translate-x-1/2 bg-primary-500/10" />

      <div className="relative z-10 w-full max-w-3xl">
        <Link href="/" className="mx-auto mb-10 flex w-fit justify-center">
          <Logo />
        </Link>

        <div className="text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Staff Sign In</h1>
          <p className="mt-3 text-muted-foreground">
            Select your portal to continue. Access is restricted to Aurora Health staff.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {staffPortalRoles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.id}
                href={`/login/${role.id}`}
                className="glass gradient-ring group flex items-center gap-4 rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <span
                  className={cn(
                    "grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-[0_14px_30px_-12px_rgba(21,101,192,0.6)]",
                    role.gradient,
                  )}
                >
                  <Icon className="size-7" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="font-display text-lg font-bold tracking-tight">{role.name}</span>
                  <span className="truncate text-sm text-muted-foreground">{role.tagline}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
              </Link>
            );
          })}
        </div>

        {/* Patients sign in separately */}
        <Link
          href="/login/patient"
          className="glass mt-6 flex items-center gap-3 rounded-2xl p-4 transition-colors hover:border-primary-500/40"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-300">
            <UserRound className="size-5" />
          </span>
          <span className="flex-1 text-sm">
            <span className="font-semibold text-foreground">Are you a patient?</span>{" "}
            <span className="text-muted-foreground">Sign in to the Patient Portal instead.</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
        </Link>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:underline dark:text-primary-300"
          >
            Return to the main site
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
