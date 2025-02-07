import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Bell,
  TriangleAlert,
  XOctagon,
  HelpCircle,
  CheckCircle,
  CircleCheckBig,
} from "lucide-react";

export type AlertVariant = "default" | "primary" | "danger" | "warning" | "success";
export type AlertSize = "sm" | "base";
export type AlertIcon = "AlertCircle" | "Bell" | "TriangleAlert" | "OctagonX" | "CircleHelp" | "CircleCheck" | "CircleCheckBig";

const iconMap = {
  AlertCircle,
  Bell,
  TriangleAlert,
  OctagonX: XOctagon,
  CircleHelp: HelpCircle,
  CircleCheck: CheckCircle,
  CircleCheckBig: CircleCheckBig,
} as const;

interface AlertContextValue {
  variant: AlertVariant;
  size: AlertSize;
}

const AlertContext = createContext<AlertContextValue>({
  variant: "default",
  size: "base",
});

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  size?: AlertSize;
  fullWidth?: boolean;
  icon?: AlertIcon;
  withTitle?: boolean;
  withDescription?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      size = "base",
      fullWidth = false,
      icon = "AlertCircle",
      withTitle = true,
      withDescription = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className={fullWidth ? "w-full" : "w-fit"}>
        <AlertContext.Provider value={{ variant, size }}>
          <div
            ref={ref}
            role="alert"
            className={cn("ui-alert", className)}
            data-variant={variant}
            data-size={size}
            {...props}
          >
            {children}
          </div>
        </AlertContext.Provider>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export interface AlertIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: AlertIcon;
}

const AlertIconContainer = React.forwardRef<HTMLDivElement, AlertIconProps>(
  ({ className, icon = "AlertCircle", ...props }, ref) => {
    const { variant, size } = useContext(AlertContext);
    const IconComponent = iconMap[icon];

    return (
      <div
        ref={ref}
        className={cn("ui-alert-icon", className)}
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {props.children || <IconComponent />}
      </div>
    );
  }
);
AlertIconContainer.displayName = "AlertIconContainer";

const AlertContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("ui-alert-content", className)} {...props} />
  )
);
AlertContent.displayName = "AlertContent";

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  show?: boolean;
}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, show = true, ...props }, ref) => {
    const { variant, size } = useContext(AlertContext);
    if (!show) return null;

    return (
      <h5
        ref={ref}
        className={cn("ui-alert-title", className)}
        data-variant={variant}
        data-size={size}
        {...props}
      />
    );
  }
);
AlertTitle.displayName = "AlertTitle";

export interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  show?: boolean;
}

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, show = true, ...props }, ref) => {
    const { variant, size } = useContext(AlertContext);
    if (!show) return null;

    return (
      <p
        ref={ref}
        className={cn("ui-alert-description", className)}
        data-variant={variant}
        data-size={size}
        {...props}
      />
    );
  }
);
AlertDescription.displayName = "AlertDescription";

export {
  Alert,
  AlertIconContainer,
  AlertContent,
  AlertTitle,
  AlertDescription,
  iconMap,
};
