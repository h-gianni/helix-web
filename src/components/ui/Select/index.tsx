import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";

type SelectSize = "sm" | "base" | "lg";
type SelectWidth = "inline" | "full";

interface ExtendedSelectProps extends SelectPrimitive.SelectProps {
  className?: string;
  error?: boolean;
  width?: SelectWidth;
  withLabel?: boolean;
  label?: string;
  helperText?: string;
  required?: boolean;
}

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  ExtendedSelectProps
>(({ 
  className, 
  children, 
  width = "full", 
  withLabel, 
  label, 
  error,
  helperText,
  required,
  disabled,
  ...props 
}, ref) => {
  const selectId = React.useId();
  const helperId = React.useId();

  const content = (
    <div className="form-layout-field">
      {helperText && (
        <p
          id={helperId}
          className="form-layout-helper"
          data-error={error}
        >
          {helperText}
        </p>
      )}
      <div className={cn("select-container", className)} data-width={width}>
        <SelectPrimitive.Root
          disabled={disabled}
          required={required}
          {...props}
        >
          {React.Children.map(children, child => {
            if (!React.isValidElement(child)) return child;
            
            if ((child.type as any).displayName === SelectTrigger.displayName) {
              return React.cloneElement(child as React.ReactElement<any>, {
                error,
                'aria-describedby': helperText ? helperId : undefined,
                'aria-labelledby': label ? selectId : undefined,
              });
            }
            return child;
          })}
        </SelectPrimitive.Root>
      </div>
    </div>
  );

  if (!withLabel || !label) return content;

  return (
    <div className="form-layout">
      <div className="form-layout-label">
        <Label
          htmlFor={selectId}
          data-error={error}
          data-disabled={disabled}
          required={required}
        >
          {label}
        </Label>
        {content}
      </div>
    </div>
  );
});
Select.displayName = SelectPrimitive.Root.displayName;

interface ExtendedSelectTriggerElement extends React.ReactElement<
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
> {
  type: typeof SelectTrigger;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    error?: boolean;
    size?: SelectSize;
    icon?: React.ReactNode;
  }
>(({ className, children, error, size = "base", icon, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "select-trigger",
      `select-trigger-${size}`,
      error && "select-trigger-error",
      className
    )}
    {...props}
  >
    {icon && <span className="select-trigger-icon">{icon}</span>}
    <span className="select-value">{children}</span>
    <SelectPrimitive.Icon className="select-chevron">
      <ChevronDown className="size-4" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "select-content",
        position === "popper" && "select-content-popper",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport 
        className={cn(
          "select-viewport",
          position === "popper" && "select-viewport-popper"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    size?: SelectSize;
    withIcon?: React.ReactNode;
  }
>(({ className, children, size = "base", withIcon, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn("select-item", `select-item-${size}`, className)}
    {...props}
  >
    <span className="select-item-indicator">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <span className="select-item-text">
      {withIcon && <span className="select-item-icon">{withIcon}</span>}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;

export {
  type SelectSize,
  type SelectWidth,
  type ExtendedSelectProps,
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
};