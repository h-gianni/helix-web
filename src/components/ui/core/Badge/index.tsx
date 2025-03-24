import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium leading-4 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        "primary-light":
          "border-transparent bg-primary-lightest text-primary-darker",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        "secondary-light":
          "border-transparent bg-secondary-lightest text-secondary-darker",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        "destructive-light":
          "border-transparent bg-destructive-lightest text-destructive-darker",
        outline: "text-foreground border",
        accent:
          "border-transparent bg-accent text-accent-foreground",
        "accent-light":
          "border-transparent bg-accent-lightest text-accent-dark",
        success:
          "border-transparent bg-success text-success-foreground",
        "success-light":
          "border-transparent bg-success-lightest text-success-darker",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        "warning-light":
          "border-transparent bg-warning-lightest text-warning-darker",
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
