import * as React from "react";

import { cn } from "@/lib/utils";

const fieldStyles =
  "w-full rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground shadow-sm outline-none backdrop-blur-sm transition-all duration-300 placeholder:text-muted-foreground/70 hover:border-primary-500/40 focus:border-primary-500 focus:bg-surface focus:shadow-[0_0_0_4px_rgba(14,165,233,0.14)]";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input ref={ref} type={type} className={cn(fieldStyles, className)} {...props} />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn(fieldStyles, "min-h-32 resize-y", className)} {...props} />
));
Textarea.displayName = "Textarea";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn("mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground", className)}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export { Input, Textarea, Label };
