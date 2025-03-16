import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium leading-4 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        "primary-light":
          "border-transparent bg-primary-lightest text-primary-darker hover:bg-primary-lighter hover:text-primary-darkest",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        "secondary-light":
          "border-transparent bg-secondary-lightest text-secondary-darker hover:bg-secondary-lighter hover:text-secondary-darkest",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        "destructive-light":
          "border-transparent bg-destructive-lightest text-destructive-darker hover:bg-destructive-lighter hover:text-destructive-darkest",
        outline: "text-foreground border",
        accent:
          "border-transparent bg-accent text-accent-foreground hover:bg-accent/80",
        "accent-light":
          "border-transparent bg-accent-lightest text-accent-darker hover:bg-accent-lighter hover:text-accent-darkest",
        success:
          "border-transparent bg-success text-success-foreground hover:bg-success/80",
        "success-light":
          "border-transparent bg-success-lightest text-success-darker hover:bg-success-lighter hover:text-success-darkest",
        warning:
          "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        "warning-light":
          "border-transparent bg-warning-lightest text-warning-darker hover:bg-warning-lighter hover:text-warning-darkest",
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
