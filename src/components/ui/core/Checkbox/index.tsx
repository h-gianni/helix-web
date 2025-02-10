"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/core/Label";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    { className, label, description, id, disabled, required, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const elementId = id || generatedId;

    // Return checkbox with label and optional description
    return (
      <div className="ui-form-layout">
        <div className="ui-checkbox-label-wrapper">
          <CheckboxPrimitive.Root
            ref={ref}
            id={elementId}
            disabled={disabled}
            required={required}
            className={cn("ui-checkbox-base peer", className)}
            {...props}
          >
            <CheckboxPrimitive.Indicator className="ui-checkbox-indicator">
              <Check className="size-3.5" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
          <div className="ui-checkbox-text-wrapper">
            <Label
              htmlFor={elementId}
              data-disabled={disabled || undefined}
              data-required={required || undefined}
              className="ui-form-checkbox"
            >
              {label}
            </Label>
            {description && <p className="ui-form-helper">{description}</p>}
          </div>
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
