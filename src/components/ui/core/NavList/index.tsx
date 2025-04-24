"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { Label } from "@/components/ui/core/Label";

/* NavList - A mobile-first navigation component
 * 
 * This component replaces RadioGroupCards with a more streamlined navigation
 * pattern where clicking any item directly navigates to the next step.
 */

const navListVariants = cva(
  "w-full border border-border rounded-lg overflow-hidden divide-y divide-border",
  {
    variants: {
      variant: {
        default: "bg-white",
        accent: "bg-accent/5",
      },
      size: {
        default: "",
        sm: "text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const navListItemVariants = cva(
  "flex items-center justify-between w-full px-4 py-3 text-foreground font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        default: "hover:bg-neutral-50",
        accent: "hover:bg-accent/10",
      },
      size: {
        default: "min-h-14",
        sm: "min-h-12",
      },
      destructive: {
        true: "text-destructive hover:bg-destructive-50",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "cursor-pointer",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      destructive: false,
      disabled: false,
    },
    compoundVariants: [
      {
        destructive: true,
        disabled: true,
        className: "opacity-50 text-destructive/60",
      },
    ]
  }
);

export interface NavListProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof navListVariants> {
  children?: React.ReactNode;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  emptyStateIcon?: React.ReactNode;
  emptyStateText?: string;
}

type ButtonProps = {
  asLink?: false;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

type AnchorProps = {
  asLink: true;
  href?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'>;

export type NavListItemProps = {
  variant?: VariantProps<typeof navListItemVariants>['variant'];
  size?: VariantProps<typeof navListItemVariants>['size'];
  icon?: React.ReactNode;
  description?: string;
  trailingContent?: React.ReactNode;
  showChevron?: boolean;
  selected?: boolean; // Keep prop for compatibility but don't use for styling
  disabled?: boolean;
  destructive?: boolean;
  className?: string;
} & (ButtonProps | AnchorProps);

const NavList = React.forwardRef<HTMLDivElement, NavListProps>(
  ({ 
    className, 
    variant, 
    size, 
    isLoading = false,
    emptyState,
    emptyStateIcon,
    emptyStateText = "No items available",
    children,
    ...props 
  }, ref) => {
    // Check if there are any children elements
    const hasChildren = React.Children.count(children) > 0;

    // Handle loading state
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-6 border border-border rounded-lg bg-white">
          <div className="flex flex-col items-center gap-2">
            <div className="size-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm text-foreground-weak">Loading...</p>
          </div>
        </div>
      );
    }

    // Handle empty state
    if (!hasChildren) {
      if (emptyState) {
        return <>{emptyState}</>; // Custom empty state
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 border border-border rounded-lg bg-muted/30 text-center">
          {emptyStateIcon || (
            <div className="size-8 rounded-full bg-muted flex items-center justify-center mb-2">
              <span className="text-foreground-muted">?</span>
            </div>
          )}
          <p className="text-foreground-muted">{emptyStateText}</p>
        </div>
      );
    }

    // Normal list rendering
    return (
      <div
        ref={ref}
        className={cn(navListVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);
NavList.displayName = "NavList";

const NavListItem = React.forwardRef<HTMLElement, NavListItemProps>(
  ({
    className,
    variant,
    size,
    icon,
    description,
    children,
    trailingContent,
    showChevron = true,
    selected,
    disabled = false,
    destructive = false,
    ...props
  }, ref) => {
    // Common content to avoid duplication
    const content = (
      <>
        <div className="flex items-center gap-3 min-w-0">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="min-w-0">
            <div className="truncate">{children}</div>
            {description && (
              <div className="text-sm font-normal text-foreground-weak truncate mt-0.5">
                {description}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {trailingContent && <div>{trailingContent}</div>}
          {showChevron && !disabled && (
            <ChevronRight
              className={cn(
                "size-4",
                destructive ? "text-destructive-300" : "text-muted-foreground"
              )}
            />
          )}
        </div>
      </>
    );

    const styles = cn(navListItemVariants({
      variant,
      size,
      destructive,
      disabled,
      className
    }));

    // Common ARIA props
    const ariaProps = {
      'aria-disabled': disabled,
      role: 'option',
    };

    if ('asLink' in props && props.asLink) {
      // Anchor element
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={styles}
          {...ariaProps}
          {...(props as AnchorProps)}
        >
          {content}
        </a>
      );
    }

    // Button element
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={styles}
        disabled={disabled}
        {...ariaProps}
        {...(props as ButtonProps)}
      >
        {content}
      </button>
    );
  }
);
NavListItem.displayName = "NavListItem";

interface NavListSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const NavListSection = React.forwardRef<HTMLDivElement, NavListSectionProps>(
  ({ title, description, children, className }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2.5", className)}>
        {title && (
          <Label className="!text-foreground-weak px-1">{title}</Label>
        )}
        {description && (
          <p className="text-sm text-foreground-muted px-1 -mt-1.5 mb-1">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);
NavListSection.displayName = "NavListSection";

export { NavList, NavListItem, NavListSection };