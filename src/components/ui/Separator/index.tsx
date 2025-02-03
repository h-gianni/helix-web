"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

type SeparatorVariant = 'default' | 'accent' | 'dashed' | 'dotted' | 'gradient'

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  variant?: SeparatorVariant;
  withText?: string;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  ({
    className,
    orientation = "horizontal",
    decorative = true,
    variant = "default",
    withText,
    ...props
  }, ref) => {
    if (withText && orientation !== "horizontal") {
      console.warn("withText prop is only supported for horizontal orientation");
    }

    // If withText is provided, render a text separator
    if (withText && orientation === "horizontal") {
      return (
        <div className="separator-with-text">
          <div className="h-px" />
          <span>{withText}</span>
          <div className="h-px" />
        </div>
      );
    }

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          "separator-base",
          `separator-${variant}`,
          orientation === "horizontal" ? "separator-horizontal" : "separator-vertical",
          className
        )}
        {...props}
      />
    )
  }
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
export type { SeparatorProps }