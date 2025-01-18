import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(["button-base"], {
  variants: {
    variant: {
      primary: "",
      neutral: "",
      warning: "",
      danger: "",
    },
    appearance: {
      default: "button-default",
      outline: "button-outline",
      text: "button-text",
      "icon-only": "button-icon-only",
    },
    size: {
      sm: "button-sm",
      default: "button-default-size",
      lg: "button-lg",
    },
    isLoading: {
      true: "button-loading",
    },
  },
  compoundVariants: [
    // Primary variant
    {
      variant: "primary",
      appearance: ["default", "icon-only"],
      className: "button-primary",
    },
    {
      variant: "primary",
      appearance: "outline",
      className: "button-primary-outline",
    },
    {
      variant: "primary",
      appearance: ["text", "icon-only"],
      className: "button-primary-text",
    },
    // Warning variant
    {
      variant: "warning",
      appearance: ["default", "icon-only"],
      className: "button-warning",
    },
    {
      variant: "danger",
      appearance: "outline",
      className: "button-danger-outline",
    },
    {
      variant: "danger",
      appearance: ["text", "icon-only"],
      className: "button-danger-text",
    },
    // Danger variant
    {
      variant: "danger",
      appearance: ["default", "icon-only"],
      className: "button-danger",
    },
    {
      variant: "danger",
      appearance: "outline",
      className: "button-danger-outline",
    },
    {
      variant: "danger",
      appearance: ["text", "icon-only"],
      className: "button-danger-text",
    },
    // Neutral variant
    {
      variant: "neutral",
      appearance: "outline",
      className: "button-neutral-outline",
    },
    {
      variant: "neutral",
      appearance: ["text"],
      className: "button-neutral-text",
    },
    {
      variant: "neutral",
      appearance: ["icon-only"],
      className: "button-neutral-icon",
    },
    // Icon sizes
    {
      appearance: "icon-only",
      size: "sm",
      className: "button-icon-sm",
    },
    {
      appearance: "icon-only",
      size: "default",
      className: "button-icon-default",
    },
    {
      appearance: "icon-only",
      size: "lg",
      className: "button-icon-lg",
    },
  ],
  defaultVariants: {
    variant: "neutral",
    appearance: "default",
    size: "default",
    isLoading: false,
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      appearance,
      size,
      isLoading = false,
      leadingIcon,
      trailingIcon,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isIconOnly = appearance === "icon-only";

    return (
      <Comp
        className={cn(
          buttonVariants({
            variant,
            appearance,
            size,
            isLoading,
            className,
          })
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            {!isIconOnly && children}
          </>
        ) : (
          <>
            {leadingIcon}
            {!isIconOnly && children}
            {trailingIcon}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
