import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = 'default' | 'primary' | 'accent' | 'danger' | 'success' | 'warning' | 'info';
export type BadgeAppearance = 'default' | 'light' | 'outline';
export type BadgeSize = 'default' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  appearance?: BadgeAppearance;
  size?: BadgeSize;
}

function Badge({
  className,
  variant = 'default',
  appearance = 'default',
  size = 'default',
  ...props
}: BadgeProps) {
  // For the new design system, a "default" appearance corresponds to the solid/strong style.
  // If a different appearance is passed (e.g. "light" or "outline"), we combine it with the variant.
  const computedVariant = appearance === 'default' ? variant : `${variant}-${appearance}`;

  return (
    <div
      className={cn("ui-badge", className)}
      data-variant={computedVariant}
      data-size={size}
      {...props}
    />
  );
}

export { Badge };
