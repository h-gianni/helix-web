"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

type SheetOverlayElement = React.ElementRef<typeof SheetPrimitive.Overlay>;
type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>;

const SheetOverlay = React.forwardRef<SheetOverlayElement, SheetOverlayProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
      ref={ref}
      className={cn("sheet-overlay", className)}
      {...props}
    />
  )
);
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva("sheet-content", {
  variants: {
    side: {
      top: "sheet-content-top",
      bottom: "sheet-content-bottom",
      left: "sheet-content-left",
      right: "sheet-content-right",
    },
  },
  defaultVariants: {
    side: "right",
  },
});

type SheetContentElement = React.ElementRef<typeof SheetPrimitive.Content>;
type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> &
  VariantProps<typeof sheetVariants>;

const SheetContent = React.forwardRef<SheetContentElement, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="sheet-close">
          <X className="sheet-close-icon" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn("sheet-header", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn("sheet-footer", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

type SheetTitleElement = React.ElementRef<typeof SheetPrimitive.Title>;
type SheetTitleProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>;

const SheetTitle = React.forwardRef<SheetTitleElement, SheetTitleProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Title
      ref={ref}
      className={cn("sheet-title", className)}
      {...props}
    />
  )
);
SheetTitle.displayName = SheetPrimitive.Title.displayName;

type SheetDescriptionElement = React.ElementRef<typeof SheetPrimitive.Description>;
type SheetDescriptionProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Description
>;

const SheetDescription = React.forwardRef<SheetDescriptionElement, SheetDescriptionProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Description
      ref={ref}
      className={cn("sheet-description", className)}
      {...props}
    />
  )
);
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};