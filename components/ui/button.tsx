"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-semibold transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 text-white shadow-[0_18px_40px_-16px_rgba(21,101,192,0.9)] hover:shadow-[0_26px_60px_-18px_rgba(21,101,192,1)] hover:-translate-y-0.5 active:translate-y-0",
        emergency:
          "bg-gradient-to-r from-danger-600 to-danger-500 text-white shadow-[0_18px_40px_-16px_rgba(239,68,68,0.9)] hover:shadow-[0_26px_60px_-18px_rgba(239,68,68,1)] hover:-translate-y-0.5 active:translate-y-0",
        glass:
          "glass text-foreground hover:-translate-y-0.5 hover:shadow-[0_26px_60px_-22px_rgba(15,23,42,0.4)]",
        outline:
          "border border-primary-500/40 bg-transparent text-foreground hover:border-primary-500 hover:bg-primary-500/10 hover:-translate-y-0.5",
        ghost: "bg-transparent text-foreground hover:bg-foreground/5",
        soft: "bg-primary-500/10 text-primary-600 hover:bg-primary-500/20 dark:text-primary-300",
      },
      size: {
        sm: "h-10 px-5 text-sm [&_svg]:size-4",
        md: "h-12 px-6 text-sm [&_svg]:size-4.5",
        lg: "h-14 px-8 text-base [&_svg]:size-5",
        icon: "size-11 [&_svg]:size-5",
      },
      /** Adds the sweeping light shine on hover. */
      shine: {
        true: "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shine: true,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shine, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp className={cn(buttonVariants({ variant, size, shine }), className)} ref={ref} {...props}>
        {asChild ? children : <span className="relative z-10 inline-flex items-center gap-2">{children}</span>}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
