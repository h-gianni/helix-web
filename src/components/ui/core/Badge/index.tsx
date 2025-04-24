import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-2 py-1 text-xs leading-4 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-neutral-100/60 text-secondary-foreground",
        neutral: "border-transparent bg-neutral-950 text-white",
        primary: "border-transparent bg-primary text-primary-50",
        "primary-light": "border-transparent bg-primary-100/60 text-primary",
        secondary: "border-transparent bg-secondary-500 text-secondary-50",
        "secondary-light":
          "border-transparent bg-secondary-50/60 text-secondary-600",
        tertiary: "border-transparent bg-tertiary-500 text-tertiary-50",
        "tertiary-light": "border-transparent bg-tertiary-50/60 text-tertiary-600",
        info: "border-transparent bg-info text-info-50",
        "info-light": "border-transparent bg-info-100/60 text-info-foreground",
        outline: "text-foreground border border-input",
        accent: "border-transparent bg-accent text-accent-950",
        destructive: "border-transparent bg-destructive text-destructive-50",
        "destructive-light":
          "border-transparent bg-destructive-100/60 text-destructive-foreground",
        success: "border-transparent bg-success text-white",
        "success-light":
          "border-transparent bg-success-100/60 text-success-foreground",
        warning: "border-transparent bg-warning text-white",
        "warning-light":
          "border-transparent bg-warning-100/60 text-warning-foreground",
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
