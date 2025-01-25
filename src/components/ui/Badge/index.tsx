import * as React from "react"

import { cn } from "@/lib/utils"

type BadgeVariant = 'default' | 'primary' | 'accent' | 'danger' | 'success' | 'warning' | 'info';
type BadgeAppearance = 'default' | 'light' | 'outline';
type BadgeSize = 'default' | 'lg';

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
  return (
    <div 
      className={cn(
        'badge-base',
        `badge-size-${size}`,
        `badge-${variant}${appearance === 'default' ? '' : `-${appearance}`}`,
        className
      )} 
      {...props} 
    />
  )
}

export { Badge }