"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/core/Label";

export interface RadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  error?: boolean;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "blocks" | "compact";
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, error, orientation = "vertical", variant = "default", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        "ui-radio-group-base",
        variant === "default" &&
          (orientation === "vertical"
            ? "ui-radio-group-vertical"
            : "ui-radio-group-horizontal"),
        variant === "blocks" &&
          (orientation === "vertical"
            ? "ui-radio-group-blocks-vertical"
            : "ui-radio-group-blocks-horizontal"),
        variant === "compact" && [
          "ui-radio-group-compact",
          orientation === "vertical"
            ? "ui-radio-group-compact-vertical"
            : "ui-radio-group-compact-horizontal",
        ],
        error && "ui-radio-group-error",
        className
      )}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "blocks" | "compact";
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, children, label, description, variant = "default", ...props }, ref) => {
  const { disabled, required, "aria-invalid": ariaInvalid } = props;
  const error = ariaInvalid === true || ariaInvalid === "true";
  const orientation = props["aria-orientation"];
  
  // The radio button itself (wrapped in a container)
  const radio = (
    <div className="ui-radio-container">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "ui-radio-base",
          !props["aria-invalid"] ? "radio-default" : "ui-radio-error",
          !props["aria-invalid"] ? "ui-radio-focus" : "ui-radio-focus-error",
          props.disabled && "ui-radio-disabled",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="ui-radio-indicator">
          <Circle />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    </div>
  );

  // If variant is blocks or compact, wrap the radio with a label element
  if (variant === "blocks" || variant === "compact") {
    return (
      <label
        className={cn(
          "ui-radio-label-wrapper group",
          variant === "blocks" && "ui-radio-label-wrapper-blocks",
          variant === "compact" &&
            orientation === "vertical" &&
            "ui-radio-label-wrapper-compact-vertical",
          variant === "compact" &&
            orientation === "horizontal" &&
            "ui-radio-label-wrapper-compact-horizontal",
          props.disabled && "ui-radio-disabled"
        )}
        data-state={props.checked ? "checked" : "unchecked"}
      >
        <div
          className={cn(
            "ui-radio-content-wrapper",
            orientation === "horizontal" && "ui-radio-content-wrapper-horizontal"
          )}
        >
          {radio}
          <div className="ui-radio-label-content">
            {label && <div className="ui-radio-label-text">{label}</div>}
            {description && <div className="ui-radio-description">{description}</div>}
            {children}
          </div>
        </div>
      </label>
    );
  }

  // If a label is provided outside of blocks/compact variants, wrap with a row layout
  if (label) {
    return (
      <div className="ui-radio-label-row">
        {radio}
        <Label
          htmlFor={props.id}
          disabled={disabled}
          required={required}
          error={error}
        >
          {label}
        </Label>
      </div>
    );
  }

  // Otherwise, return just the radio element
  return radio;
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
// export type { RadioGroupProps, RadioGroupItemProps };
