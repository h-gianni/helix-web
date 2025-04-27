// src/components/ui/composite/NoContentFound/index.tsx
import React from "react";
import { Button, ButtonProps } from "@/components/ui/core/Button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NoContentFoundProps {
  /**
   * Visual variant of the component
   * - "page": Used when an entire page is empty
   * - "section": Used when a section of a page is empty
   */
  variant?: "page" | "section";
  
  /**
   * Icon to display above the title
   */
  icon: LucideIcon;
  
  /**
   * Title text to display
   */
  title: string;
  
  /**
   * Description text to display
   */
  description: string;
  
  /**
   * Optional action button to show
   */
  actionLabel?: string;
  
  /**
   * Callback for when the action button is clicked
   */
  onAction?: () => void;
  
  /**
   * Props to pass to the action button
   */
  buttonProps?: Omit<ButtonProps, "onClick">;
  
  /**
   * Additional class names to apply to the container
   */
  className?: string;
}

/**
 * NoContentFound component for displaying empty state with optional action
 */
export function NoContentFound({
  variant = "section",
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  buttonProps,
  className,
}: NoContentFoundProps) {
  const iconSize = variant === "page" ? "size-20" : "size-16";
  const titleSize = variant === "page" ? "text-xl" : "text-lg";
  const paddingSize = variant === "page" ? "py-16" : "py-10";
  
  return (
    <div className={cn(
      "text-center space-y-4",
      paddingSize,
      className
    )}>
      <Icon className={cn(iconSize, "mx-auto text-muted-foreground")} />
      
      <h3 className={cn(titleSize, "font-medium")}>
        {title}
      </h3>
      
      <p className="text-muted-foreground max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button 
            onClick={onAction}
            variant="default"
            {...buttonProps}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}