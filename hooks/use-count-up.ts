"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  /** Target value to animate to. */
  value: number;
  /** Duration in milliseconds. */
  duration?: number;
  /** Decimal places to keep while animating. */
  decimals?: number;
  /** Animation only runs once this flips to true. */
  start?: boolean;
}

/**
 * requestAnimationFrame-driven counter with an ease-out curve.
 * Respects `prefers-reduced-motion` by jumping straight to the value.
 */
export function useCountUp({ value, duration = 1800, decimals = 0, start = true }: UseCountUpOptions) {
  const [display, setDisplay] = useState(0);
  const frame = useRef<number | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const startTime = performance.now();
    const factor = 10 ** decimals;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo — fast start, gentle landing
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplay(Math.round(value * eased * factor) / factor);

      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [start, value, duration, decimals]);

  return display;
}
