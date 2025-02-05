"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, error, required, disabled, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-required={required || undefined}
    data-error={error || undefined}
    data-disabled={disabled || undefined}
    className={cn("ui-label", className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
