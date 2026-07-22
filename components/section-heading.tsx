import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion-primitives";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  onDark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  onDark = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      <Reveal>
        <Badge variant={onDark ? "onDark" : "default"}>
          <span className="size-1.5 rounded-full bg-current" />
          {eyebrow}
        </Badge>
      </Reveal>

      <Reveal delay={0.08}>
        <h2
          className={cn(
            "max-w-3xl font-display text-3xl font-bold leading-[1.12] tracking-tight text-balance sm:text-4xl md:text-5xl",
            onDark && "text-white",
          )}
        >
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.14}>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed text-pretty md:text-lg",
              onDark ? "text-white/75" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
