import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:pointer-events-none resize-none",
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-destructive text-destructive focus:ring-destructive",
      },
      size: {
        default: "h-24",
        sm: "h-16",
        lg: "h-32",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & VariantProps<typeof textareaVariants>
>(({ className, variant, size, ...props }, ref) => {
  return <textarea ref={ref} className={cn(textareaVariants({ variant, size, className }))} {...props} />;
});

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };