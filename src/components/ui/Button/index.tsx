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
      strong: "button-default",
      outline: "button-outline",
      text: "button-text",
      "icon-only": "button-icon-only",
    },
    size: {
      sm: "button-sm",
      base: "button-base-size",
      lg: "button-lg",
    },
    shape: {
      beveled: "",
      rounded: "button-rounded",
    },
    isLoading: {
      true: "button-loading",
    },
  },
  compoundVariants: [
    // Primary variant
    {
      variant: "primary",
      appearance: ["strong", "icon-only"],
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
      appearance: ["strong", "icon-only"],
      className: "button-warning",
    },
    {
      variant: "warning",
      appearance: "outline",
      className: "button-warning-outline",
    },
    {
      variant: "warning",
      appearance: ["text", "icon-only"],
      className: "button-warning-text",
    },
    // Danger variant
    {
      variant: "danger",
      appearance: ["strong", "icon-only"],
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
      appearance: "strong",
      className: "button-neutral",
    },
    {
      variant: "neutral",
      appearance: "outline",
      className: "button-neutral-outline",
    },
    {
      variant: "neutral",
      appearance: ["text", "icon-only"],
      className: "button-neutral-text",
    },
    // Icon sizes
    {
      appearance: "icon-only",
      size: "sm",
      className: "button-icon-sm",
    },
    {
      appearance: "icon-only",
      size: "base",
      className: "button-icon-base",
    },
    {
      appearance: "icon-only",
      size: "lg",
      className: "button-icon-lg",
    },
  ],
  defaultVariants: {
    variant: "neutral",
    appearance: "strong",
    size: "base",
    shape: "beveled",
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
      shape,
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
            shape,
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