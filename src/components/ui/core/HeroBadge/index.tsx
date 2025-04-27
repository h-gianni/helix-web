import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface HeroBadgeProps {
  /**
   * The icon to display inside the badge
   */
  icon: LucideIcon;
  /**
   * The size variant of the badge
   * @default "base"
   */
  size?: "sm" | "base" | "lg" | "xl";
  /**
   * The color variant of the badge
   * @default "primary"
   */
  variant?: "primary" | "neutral" | "success" | "warning";
  /**
   * Additional CSS classes to apply to the badge
   */
  className?: string;
}

/**
 * HeroBadge component displays an icon within a circular colored badge
 */
export function HeroBadge({
  icon: Icon,
  size = "base",
  variant = "primary",
  className,
  ...props
}: HeroBadgeProps) {
  const sizeClasses = {
    sm: "size-7",
    base: "size-10",
    lg: "size-14",
    xl: "size-20"
  };
  
  const iconSizeClasses = {
    sm: "size-3",
    base: "size-4",
    lg: "size-6",
    xl: "size-12",
  };

  const variantClasses = {
    primary: "bg-primary-100 text-primary",
    neutral: "bg-neutral text-foreground-strong",
    success: "bg-success-100 text-success-700",
    warning: "bg-warning-100 text-warning-700",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <Icon className={cn(iconSizeClasses[size])} />
    </div>
  );
}