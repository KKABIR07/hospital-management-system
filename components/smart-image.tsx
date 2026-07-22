"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

import { cn } from "@/lib/utils";

type SmartImageProps = Omit<ImageProps, "onError" | "onLoad"> & {
  /** Shown while loading and if the remote source fails. */
  fallbackLabel?: string;
};

/**
 * next/image with a branded gradient placeholder.
 *
 * Photography is loaded from a CDN, so a blocked network or a moved asset
 * would otherwise leave a broken box in an otherwise premium layout. This
 * keeps the composition intact and fades the real photo in when it lands.
 */
export function SmartImage({ className, fallbackLabel, alt, ...props }: SmartImageProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  return (
    <span className="absolute inset-0 block overflow-hidden">
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 bg-[linear-gradient(135deg,#0ea5e9_0%,#0284c7_38%,#10b981_100%)] transition-opacity duration-700",
          status === "ready" ? "opacity-0" : "opacity-100",
        )}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
        {fallbackLabel && status === "error" && (
          <span className="absolute inset-x-0 bottom-5 px-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
            {fallbackLabel}
          </span>
        )}
      </span>

      {status !== "error" && (
        <Image
          alt={alt}
          className={cn(
            "object-cover transition-all duration-700",
            status === "ready" ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md",
            className,
          )}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          {...props}
        />
      )}
    </span>
  );
}
