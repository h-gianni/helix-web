import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bell,
  TriangleAlert,
  XOctagon,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';

type AlertVariant = "default" | "primary" | "danger" | "warning";
type AlertSize = "sm" | "base";
type AlertIcon = "AlertCircle" | "Bell" | "TriangleAlert" | "OctagonX" | "CircleHelp" | "CircleCheck";

const iconMap = {
  AlertCircle,
  Bell,
  TriangleAlert,
  OctagonX: XOctagon,
  CircleHelp: HelpCircle,
  CircleCheck: CheckCircle,
} as const;

interface AlertContextValue {
  variant: AlertVariant;
  size: AlertSize;
}

const AlertContext = createContext<AlertContextValue>({ 
  variant: "default",
  size: "base"
});

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  size?: AlertSize;
  fullWidth?: boolean;
  icon?: AlertIcon;
  withTitle?: boolean;
  withDescription?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    className, 
    variant = "default", 
    size = "base",
    fullWidth = false,
    icon = "AlertCircle",
    withTitle = true,
    withDescription = true,
    children,
    ...props 
  }, ref) => (
    <div className={fullWidth ? 'w-full' : 'w-fit'}>
      <AlertContext.Provider value={{ variant, size }}>
        <div
          ref={ref}
          role="alert"
          className={cn(
            "alert-base",
            `alert-${variant}`,
            `alert-${size}`,
            className
          )}
          {...props}
        >
          {children}
        </div>
      </AlertContext.Provider>
    </div>
  )
);
Alert.displayName = "Alert";

interface AlertIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: AlertIcon;
}

const AlertIconContainer = React.forwardRef<HTMLDivElement, AlertIconProps>(
  ({ className, icon = "AlertCircle", ...props }, ref) => {
    const { variant, size } = useContext(AlertContext);
    const IconComponent = iconMap[icon];

    return (
      <div
        ref={ref}
        className={cn(
          "alert-icon",
          `alert-icon-${variant}`,
          `alert-icon-${size}`,
          className
        )}
        {...props}
      >
        {props.children || <IconComponent />}
      </div>
    );
  }
);
AlertIconContainer.displayName = "AlertIconContainer";

const AlertContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("alert-content", className)}
    {...props}
  />
));
AlertContent.displayName = "AlertContent";

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  show?: boolean;
}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, show = true, ...props }, ref) => {
    const { variant, size } = useContext(AlertContext);
    if (!show) return null;

    return (
      <h5
        ref={ref}
        className={cn(
          "alert-title",
          `alert-title-${variant}`,
          `alert-title-${size}`,
          className
        )}
        {...props}
      />
    );
  }
);
AlertTitle.displayName = "AlertTitle";

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  show?: boolean;
}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, show = true, ...props }, ref) => {
    const { variant, size } = useContext(AlertContext);
    if (!show) return null;

    return (
      <p
        ref={ref}
        className={cn(
          "alert-description",
          `alert-description-${variant}`,
          `alert-description-${size}`,
          className
        )}
        {...props}
      />
    );
  }
);
AlertDescription.displayName = "AlertDescription";

export { 
  type AlertProps,
  type AlertIcon,
  type AlertVariant,
  type AlertSize,
  Alert, 
  AlertIconContainer, 
  AlertContent, 
  AlertTitle, 
  AlertDescription,
  iconMap
};