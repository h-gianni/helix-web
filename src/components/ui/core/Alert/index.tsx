import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border min-h-8 px-4 py-3 text-sm shadow-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3 [&>svg]:text-foreground [&>svg~*]:pl-6",
  {
    variants: {
      variant: {
        default: "bg-background border-neutral-lighter text-neutral-darker dark:border-neutral-lighter [&>svg]:text-neutral",
        primary:
          "bg-primary-lightest border-primary-lighter text-primary-darker dark:border-primary-lighter [&>svg]:text-primary",
        info:
          "bg-info-lightest border-info-lighter text-info-darker dark:border-info-lighter [&>svg]:text-info",
        destructive:
          "bg-destructive-lightest border-destructive-lighter text-destructive-darker dark:border-destructive-lighter [&>svg]:text-destructive",
          warning:
            "bg-warning-lightest border-warning-lighter text-warning-darker dark:border-warning-lighter [&>svg]:text-warning",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight py-1", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm leading-4 mt-1", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
