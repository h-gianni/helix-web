"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type ActionConfig = {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
};

interface DialogFooterConfig {
  primaryAction: ActionConfig;
  secondaryAction?: ActionConfig;
  textAction?: ActionConfig;
}

export interface DialogConfigProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  title?: string;
  hideClose?: boolean;
  size?: "base" | "lg" | "xl";
  footer?: "one-action" | "two-actions" | "three-actions";
  footerConfig?: DialogFooterConfig;
  className?: string;
  children: React.ReactNode;
}

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: "base" | "lg" | "xl";
  hideClose?: boolean;
}

const DEFAULT_FOOTER_CONFIG: DialogFooterConfig = {
  primaryAction: {
    label: "Confirm",
    onClick: () => {},
    isLoading: false,
  },
};

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn("ui-dialog-overlay", className)}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size = "base", hideClose = false, ...props }, ref) => (
  <DialogPortal>
    <div className="ui-dialog-container">
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn("ui-dialog-content", className)}
        data-size={size}
        {...props}
      >
        {children}
        {!hideClose && (
          <DialogClose className="ui-dialog-close">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("ui-dialog-header", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("ui-dialog-footer", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("ui-dialog-title", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("ui-dialog-description", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Utility component for common dialog configurations
const DialogWithConfig = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogConfigProps
>(
  (
    {
      children,
      title,
      hideClose = false,
      size = "base",
      footer = "one-action",
      footerConfig = DEFAULT_FOOTER_CONFIG,
      className,
      ...props
    },
    ref
  ) => {
    // Prevent body scroll when dialog is open
    React.useEffect(() => {
      if (props.open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [props.open]);

    return (
      <Dialog {...props}>
        <DialogContent ref={ref} size={size} hideClose={hideClose} className={className}>
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
          )}
          <div className="ui-dialog-body">
            {children}
          </div>
          <DialogFooter>
            {footer === "three-actions" && footerConfig.textAction && (
              <Button
                variant="neutral"
                volume="soft"
                onClick={footerConfig.textAction.onClick}
                isLoading={footerConfig.textAction.isLoading}
              >
                {footerConfig.textAction.label}
              </Button>
            )}
            {(footer === "two-actions" || footer === "three-actions") &&
              footerConfig.secondaryAction && (
                <Button
                  variant="neutral"
                  volume="moderate"
                  onClick={footerConfig.secondaryAction.onClick}
                  isLoading={footerConfig.secondaryAction.isLoading}
                >
                  {footerConfig.secondaryAction.label}
                </Button>
              )}
            <Button
              variant="primary"
              onClick={footerConfig.primaryAction.onClick}
              isLoading={footerConfig.primaryAction.isLoading}
            >
              {footerConfig.primaryAction.label}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
DialogWithConfig.displayName = "DialogWithConfig";

// export type { DialogConfigProps, DialogContentProps, DialogFooterConfig };
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogWithConfig,
};
