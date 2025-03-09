"use client";

import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "base" | "lg";
  label?: string;
}

const sizeClasses = {
  sm: "h-2 w-2",
  base: "h-4 w-4",
  lg: "h-6 w-6",
};

const Loader = ({ size = "base", label, className, ...props }: LoaderProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <LoaderCircle className={cn("animate-spin text-foreground", sizeClasses[size])} />
      {label && <span className="text-base">{label}</span>}
    </div>
  );
};

export { Loader };
