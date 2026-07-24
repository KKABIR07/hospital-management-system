"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: EASE } },
};

export const staggerContainer = (stagger = 0.09, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "up" | "in" | "scale";
  /** Re-run the animation each time it enters the viewport. */
  repeat?: boolean;
  as?: "div" | "section" | "li" | "article" | "header";
};

const variantMap = { up: fadeUp, in: fadeIn, scale: scaleIn } as const;

/** Scroll-triggered reveal. Animates once by default to keep scrolling calm. */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  repeat = false,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, margin: "-80px" }}
      variants={variantMap[variant]}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers its `Reveal`-less motion children. */
export function StaggerGroup({
  children,
  className,
  stagger = 0.09,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer(stagger, delay)}
    >
      {children}
    </motion.div>
  );
}

/** Child of `StaggerGroup`. */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

/** Soft coloured blur used as section background lighting. */
export function Halo({ className }: { className?: string }) {
  return <div aria-hidden className={cn("halo", className)} />;
}
