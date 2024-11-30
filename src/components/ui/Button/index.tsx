import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Updated button variants to use design tokens
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "gap-2 whitespace-nowrap rounded-md",
    "text-sm font-medium",
    "transition-colors",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-action-primary", // Token-based ring color
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "[&_svg]:pointer-events-none",
    "[&_svg]:size-4",
    "[&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-action-primary",
          "text-text-primary", // Token for text color
          "hover:bg-action-primary-hover",
          "disabled:bg-action-primary-disabled",
          "disabled:text-text-disabled",
        ].join(" "),
        destructive: [
          "bg-state-error",
          "text-text-primary", // Text token
          "hover:bg-state-error/90",
          "disabled:bg-state-error/50",
        ].join(" "),
        outline: [
          "border",
          "border-border-normal",
          "bg-surface-0",
          "text-text-primary",
          "hover:bg-surface-1",
          "hover:border-border-bold",
          "disabled:bg-surface-0",
          "disabled:border-border-light",
        ].join(" "),
        secondary: [
          "bg-surface-2",
          "text-text-primary",
          "hover:bg-surface-2/80",
          "disabled:bg-surface-1",
        ].join(" "),
        ghost: [
          "text-text-secondary",
          "hover:bg-surface-1",
          "hover:text-text-primary",
          "disabled:text-text-disabled",
          "disabled:hover:bg-transparent",
        ].join(" "),
        link: [
          "text-action-primary",
          "underline-offset-4",
          "hover:underline",
          "hover:text-action-primary-hover",
          "disabled:text-text-disabled",
        ].join(" "),
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
