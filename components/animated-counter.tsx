"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

import { useCountUp } from "@/hooks/use-count-up";
import { formatNumber } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
  /** Renders 1,250,000 as "1.25M" to keep large tiles readable. */
  compact?: boolean;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1800,
  className,
  compact = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const current = useCountUp({ value, duration, decimals, start: inView });

  const rendered =
    compact && value >= 1000
      ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(current)
      : formatNumber(current, decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {rendered}
      {suffix}
    </span>
  );
}
