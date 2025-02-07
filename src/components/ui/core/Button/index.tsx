import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "neutral" | "warning" | "danger";
  volume?: "loud" | "moderate" | "soft";
  size?: "sm" | "base" | "lg";
  shape?: "beveled" | "rounded";
  isLoading?: boolean;
  iconOnly?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "neutral",
      volume = "loud",
      size = "base",
      shape = "beveled",
      isLoading = false,
      iconOnly = false,
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
    
    // Only append volume to variant if it's not loud (default)
    const computedVariant = volume === "loud" ? variant : `${variant}-${volume}`;

    return (
      <Comp
        className={cn("ui-button", className)}
        data-variant={computedVariant}
        data-size={size}
        data-state={isLoading ? "loading" : disabled ? "disabled" : undefined}
        data-shape={shape === "rounded" ? "rounded" : undefined}
        data-icon={iconOnly ? "true" : undefined}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="ui-icon">
              <Loader2 className="animate-spin" />
            </span>
            {!iconOnly && children}
          </>
        ) : (
          <>
            {leadingIcon && <span className="ui-icon">{leadingIcon}</span>}
            {!iconOnly && children}
            {trailingIcon && <span className="ui-icon">{trailingIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button };