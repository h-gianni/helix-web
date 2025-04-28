"use client";

import * as React from "react";
import { Toggle } from "@/components/ui/core/Toggle";

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "default" | "sm" | "lg";
  className?: string;
  disabled?: boolean;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked = false,
      onCheckedChange,
      size = "default",
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const handleToggle = () => {
      if (onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <Toggle
        ref={ref}
        id={id}
        size={size}
        className={className}
        pressed={checked}
        onPressedChange={handleToggle}
        disabled={disabled}
        aria-checked={checked}
        role="switch"
        {...props}
      />
    );
  }
);

Switch.displayName = "Switch";
