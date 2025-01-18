import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/Button"
import {
  AlertCircle,
  TriangleAlert,
  XOctagon,
  HelpCircle,
} from 'lucide-react';

const variantIconMap = {
  primary: AlertCircle,
  warning: TriangleAlert,
  danger: XOctagon,
  neutral: HelpCircle,
} as const;

interface AlertDialogProps extends React.ComponentProps<typeof AlertDialogPrimitive.Root> {
  withIcon?: boolean;
}

const AlertDialog = ({ withIcon = true, ...props }: AlertDialogProps) => (
  <AlertDialogPrimitive.Root {...props} />
);

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = ({
  children,
  ...props
}: AlertDialogPrimitive.AlertDialogPortalProps) => (
  <AlertDialogPrimitive.Portal {...props}>
    <div className="alert-dialog-container">
      {children}
    </div>
  </AlertDialogPrimitive.Portal>
);

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn("alert-dialog-overlay", className)}
    {...props}
  />
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;

interface AlertDialogIconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof variantIconMap;
}

const AlertDialogIconContainer = React.forwardRef<HTMLDivElement, AlertDialogIconContainerProps>(
  ({ className, variant, ...props }, ref) => {
    const IconComponent = variantIconMap[variant];
    return (
      <div
        ref={ref}
        className={cn(
          "alert-dialog-icon",
          `alert-dialog-icon-${variant}`,
          className
        )}
        {...props}
      >
        <IconComponent />
      </div>
    );
  }
);
AlertDialogIconContainer.displayName = "AlertDialogIconContainer";

interface AlertDialogContentProps extends 
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {
  withIcon?: boolean;
  variant?: keyof typeof variantIconMap;
}

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(({ className, withIcon = true, variant = 'primary', children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn("alert-dialog-content", className)}
      {...props}
    >
      <div className="alert-dialog-content-with-icon">
        {withIcon && (
          <AlertDialogIconContainer variant={variant} />
        )}
        <div className="flex-1">{children}</div>
      </div>
    </AlertDialogPrimitive.Content>
  </AlertDialogPortal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("alert-dialog-header", className)}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("alert-dialog-footer", className)}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("alert-dialog-title", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("alert-dialog-description", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action> & {
    variant?: keyof typeof variantIconMap;
  }
>(({ className, variant = "primary", ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      buttonVariants({ variant: variant === 'neutral' ? 'primary' : variant }),
      className
    )}
    {...props}
  />
));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "neutral", appearance: "default" }),
      "sm:mt-0",
      className
    )}
    {...props}
  />
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  type AlertDialogProps,
  type AlertDialogContentProps,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};