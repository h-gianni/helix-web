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
  size?: SelectSize;
  withLabel?: boolean;
  label?: string;
  helperText?: string;
  required?: boolean;
  showItemIndicator?: boolean;
}

const Select = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Root>,
  ExtendedSelectProps
>(({ 
  className, 
  children, 
  width = "full",
  size = "base",
  withLabel = false, 
  label, 
  error,
  helperText,
  disabled,
  required,
  showItemIndicator = true,
  ...props 
}, ref) => {
  const elementId = React.useId();

  const selectElement = (
    <div className={cn("ui-select", className)} data-width={width} data-size={size}>
      <SelectPrimitive.Root disabled={disabled} required={required} {...props}>
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) return child;
          
          if ((child.type as any).displayName === SelectTrigger.displayName) {
            return React.cloneElement(child as React.ReactElement<any>, {
              error,
              size,
              'aria-describedby': helperText ? `${elementId}-helper` : undefined,
              'aria-labelledby': label ? elementId : undefined,
            });
          }
          if ((child.type as any).displayName === SelectContent.displayName) {
            return React.cloneElement(child as React.ReactElement<any>, {
              size,
            });
          }
          if ((child.type as any).displayName === SelectItem.displayName) {
            return React.cloneElement(child as React.ReactElement<any>, {
              size,
              'data-show-indicator': showItemIndicator,
            });
          }
          return child;
        })}
      </SelectPrimitive.Root>
    </div>
  );
 
  if (!withLabel || !label) {
    return selectElement;
  }
 
  return (
    <div className="ui-form-element-wrapper">
      <Label
        htmlFor={elementId}
        data-error={error || undefined}
        data-disabled={disabled}
        required={required}
      >
        {label}
      </Label>
      {selectElement}
      {helperText && (
        <p id={`${elementId}-helper`} className="ui-form-helper" data-error={error}>
          {helperText}
        </p>
      )}
    </div>
  );
 });
Select.displayName = SelectPrimitive.Root.displayName;

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
    className={cn("ui-select-trigger")}
    data-size={size}
    data-error={error}
    data-has-icon={!!icon}
    {...props}
  >
    {icon && <span className="ui-select-icon">{icon}</span>}
    <span className="ui-select-value" data-size={size} data-with-icon={!!icon}>
      {children}
    </span>
    <SelectPrimitive.Icon>
      <ChevronDown className="ui-select-chevron" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
    size?: SelectSize;
  }
>(({ className, children, position = "popper", size = "base", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn("ui-select-content")}
      data-position={position}
      data-size={size}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport 
        className="ui-select-viewport"
        data-position={position}
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
    className={cn("ui-select-item")}
    data-size={size}
    {...props}
  >
    <span className="ui-select-item-content">
      {withIcon && <span className="ui-select-item-icon">{withIcon}</span>}
      <SelectPrimitive.ItemText>
        <span className="ui-select-item-text" data-with-icon={!!withIcon} data-size={size}>
          {children}
        </span>
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator>
        <Check className="ui-select-item-indicator" data-size={size} />
      </SelectPrimitive.ItemIndicator>
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