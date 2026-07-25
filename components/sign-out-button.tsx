"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Signs the user out by clearing the session cookie (POST /api/auth/logout),
 * then returns them to the portal's sign-in page. `router.refresh()` drops any
 * cached server state so the now-unauthenticated view is re-fetched.
 */
export function SignOutButton({ role }: { role: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Even if the request fails, fall through to the login page.
    }
    router.replace(`/login/${role}`);
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={signOut} disabled={busy}>
      <LogOut className="size-4" />
      {busy ? "Signing out…" : "Sign out"}
    </Button>
  );
}
