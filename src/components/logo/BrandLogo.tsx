import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  variant?: "hero" | "base" | "icon";
  className?: string;
}

export function BrandLogo({ variant = "base", className }: BrandLogoProps) {
  const isHero = variant === "hero";
  const isIcon = variant === "icon";

  return (
    <span
      className={cn(
        "flex gap-3 text-foreground-strong flex-shrink-0",
        isHero ? "flex-col items-center" : "items-center",
        className
      )}
    >
      <svg
        className={cn(
          !isIcon && (isHero ? "size-16" : "size-6"),
          "fill-current text-neutral-darkest"
        )}
        viewBox="0 0 139 139"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M46.8 82.24L23.03 100.92V9.41002C23.03 4.22002 27.24 0.0200195 32.43 0.0200195H37.41C42.6 0.0200195 46.81 4.23002 46.81 9.42002V82.25L46.8 82.24Z" fill="currentColor" />
        <path d="M92.61 47.35L69.42 65.07V9.4C69.42 4.21 73.63 0 78.82 0H83.22C88.41 0 92.62 4.21 92.62 9.4V47.35H92.61Z" fill="currentColor" />
        <path d="M0 118.8L23.19 100.9V128.88C23.19 134.07 18.98 138.28 13.79 138.28H9.39C4.2 138.28 0 134.07 0 128.88V118.8Z" fill="currentColor" />
        <path d="M92.61 47.3299L115.8 29.1899V128.88C115.8 134.07 111.59 138.28 106.4 138.28H102C96.81 138.28 92.6 134.07 92.6 128.88V47.3299H92.61Z" fill="currentColor" />
        <path d="M46.8 82.2401L69.49 65.0701V128.87C69.49 134.06 65.28 138.27 60.09 138.27H56.19C51 138.27 46.79 134.06 46.79 128.87V82.2401H46.8Z" fill="currentColor" />
        <path d="M138.99 10.81L115.8 29.18V9.4C115.8 4.21 120.01 0 125.2 0H129.6C134.79 0 139 4.21 139 9.4V10.82L138.99 10.81Z" fill="currentColor" />
      </svg>

      {!isIcon && (
        <span className={cn(isHero ? "display-1 text-center" : "heading-1", "!font-black")}>
          JustScore
        </span>
      )}
    </span>
  );
}
