import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2 py-1 text-xs leading-4 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-neutral-lightest text-secondary-foreground",
        strong:
          "border-transparent bg-neutral-dark text-white",
        primary:
          "border-transparent bg-primary text-white",
        "primary-light":
          "border-transparent bg-primary-lightest text-primary-dark",
        info: "border-transparent bg-info text-white",
        "info-light": "border-transparent bg-info-lightest text-info-dark",
        destructive:
          "border-transparent bg-destructive text-white",
        "destructive-light":
          "border-transparent bg-destructive-lightest text-destructive-dark",
        outline: "text-foreground border border-neutral-light",
        accent: "border-transparent bg-accent text-neutral-darkest",
        "accent-light":
          "border-transparent bg-accent-lightest text-accent-darker",
        success: "border-transparent bg-success text-success-foreground",
        "success-light":
          "border-transparent bg-success-lightest text-success-dark",
        warning:
          "border-transparent bg-warning text-warning-foreground",
        "warning-light":
          "border-transparent bg-warning-lightest text-warning-dark",

        // To be removed
        secondary:
          "border-transparent bg-neutral-lighter text-secondary-foreground",
        "secondary-light":
          "border-transparent bg-secondary-lightest text-secondary-darker",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
