import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = 
  | 'default'  // Changed back to 'default' to match CSS
  | 'primary' 
  | 'accent' 
  | 'danger' 
  | 'success' 
  | 'warning' 
  | 'info';

export type BadgeVolume = 'loud' | 'moderate' | 'soft';
export type BadgeSize = 'sm' | 'base' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  volume?: BadgeVolume;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

function Badge({
  className,
  variant = 'default',  // Changed back to 'default'
  volume = 'loud',
  size = 'base',
  icon,
  children,
  ...props
}: BadgeProps) {
  // Compute the variant based on volume
  // - loud = solid/strong (default)
  // - moderate = outline
  // - soft = light background
  const computedVariant = volume === 'loud' 
    ? variant 
    : volume === 'moderate'
    ? `${variant}-moderate`
    : `${variant}-soft`;

  // Map sizes to match the CSS
  const mappedSize = size === 'base' ? 'default' : size;

  return (
    <div
      className={cn("ui-badge", className)}
      data-variant={computedVariant}
      data-size={mappedSize}
      {...props}
    >
      {icon && <span className="ui-badge-icon">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge };