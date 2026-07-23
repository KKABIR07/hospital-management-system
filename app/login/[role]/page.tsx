import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getPortalRole, portalRoles } from "@/lib/portal";

type Params = { role: string };

export function generateStaticParams(): Params[] {
  return portalRoles.map((role) => ({ role: role.id }));
}

/** Only the four known portals are valid routes. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { role: roleId } = await params;
  const role = getPortalRole(roleId);

  if (!role) return {};

  const audienceLabel = role.audience === "staff" ? "Staff" : "Patient";
  const title = `${role.name} — ${audienceLabel} Sign In`;

  return {
    title,
    description: `Secure ${audienceLabel.toLowerCase()} sign-in for the Aurora Health ${role.name}. ${role.tagline}.`,
    // Staff portals should never be indexed.
    robots: { index: false, follow: false },
    alternates: { canonical: `/login/${role.id}` },
  };
}

export default async function LoginRolePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { role: roleId } = await params;
  const role = getPortalRole(roleId);

  if (!role) notFound();

  return <LoginForm roleId={role.id} />;
}
