import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LayoutDashboard, Sparkles } from "lucide-react";

import { Logo } from "@/components/icons";
import { PatientDashboard } from "@/components/patient-dashboard";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { getPortalRole, portalRoles } from "@/lib/portal";
import { cn } from "@/lib/utils";

type Params = { role: string };

export function generateStaticParams(): Params[] {
  return portalRoles.map((role) => ({ role: role.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { role: roleId } = await params;
  const role = getPortalRole(roleId);
  if (!role) return {};

  return {
    title: `${role.name} — Dashboard`,
    robots: { index: false, follow: false },
  };
}

export default async function PortalDashboardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { role: roleId } = await params;
  const role = getPortalRole(roleId);

  if (!role) notFound();

  const Icon = role.icon;

  return (
    <div className="flex min-h-svh flex-col">
      {/* Top bar */}
      <header className="glass sticky top-0 z-40 border-b border-border/60">
        <div className="container-page flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="Aurora Health — home">
              <Logo />
            </Link>
            <span className="hidden h-6 w-px bg-border sm:block" />
            <span
              className={cn(
                "hidden items-center gap-2 rounded-full bg-gradient-to-br px-3 py-1.5 text-xs font-semibold text-white sm:inline-flex",
                role.gradient,
              )}
            >
              <Icon className="size-3.5" />
              {role.name}
            </span>
          </div>

          <SignOutButton role={role.id} />
        </div>
      </header>

      {role.audience === "patient" ? (
        <PatientDashboard />
      ) : (
        <main className="container-page flex-1 py-14">
          <div className="flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 w-fit dark:text-amber-300">
            <Sparkles className="size-3.5" />
            Demo dashboard — signed in as a guest
          </div>

          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome to the {role.name}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            You’re signed in to the demo environment. The full {role.shortName.toLowerCase()} workspace is coming
            soon — here’s what it will include.
          </p>

          {/* Placeholder feature tiles */}
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {role.features.map((feature) => (
              <div key={feature} className="glass gradient-ring rounded-3xl p-6">
                <span className={cn("grid size-11 place-items-center rounded-2xl bg-gradient-to-br text-white", role.gradient)}>
                  <LayoutDashboard className="size-5" />
                </span>
                <p className="mt-4 text-sm font-medium leading-relaxed text-foreground/90">{feature}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Coming soon
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Back to main site</Link>
            </Button>
            <Button asChild variant="glass">
              <Link href="/login">Switch portal</Link>
            </Button>
          </div>
        </main>
      )}
    </div>
  );
}
