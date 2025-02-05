"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  withLabel?: boolean;
  label?: string;
  description?: string;
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(
  (
    { className, withLabel = false, label, description, id, disabled, required, ...props },
    ref
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    // Base checkbox element
    const checkboxElement = (
      <CheckboxPrimitive.Root
        id={checkboxId}
        ref={ref}
        disabled={disabled}
        required={required}
        className={cn("ui-checkbox-base peer", className)}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("ui-checkbox-indicator ui-checkbox-animation")}
        >
          <Check className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );

    // Description element if provided
    const descriptionElement = description && (
      <p className="ui-checkbox-description">{description}</p>
    );

    // Return just the checkbox if no label is required
    if (!withLabel || !label) {
      return checkboxElement;
    }

    // Return checkbox with label and optional description
    return (
      <div className="ui-checkbox-label-wrapper">
        {checkboxElement}
        <div>
          <Label htmlFor={checkboxId} disabled={disabled} required={required}>
            {label}
          </Label>
          {descriptionElement}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
