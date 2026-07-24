import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-500/10 text-primary-600 dark:text-primary-300",
        accent: "bg-accent-500/12 text-accent-600 dark:text-accent-300",
        danger: "bg-danger-500/12 text-danger-600 dark:text-danger-400",
        glass: "glass text-foreground",
        onDark: "border border-white/20 bg-white/10 text-white backdrop-blur-md",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
