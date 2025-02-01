import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";

type SelectSize = "sm" | "base" | "lg";
type SelectWidth = "inline" | "full";

const Select = SelectPrimitive.Root;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    error?: boolean;
    size?: SelectSize;
  }
>(({ className, children, error, size = "base", ...props }, ref) => (
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
  }
>(({ className, children, size = "base", ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn("select-item", `select-item-${size}`, className)}
    {...props}
  >
    <span className="select-item-text">
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </span>
    <SelectPrimitive.ItemIndicator className="select-indicator">
      <Check className="size-4" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;
const SelectLabel = SelectPrimitive.Label;
const SelectSeparator = SelectPrimitive.Separator;

interface ExtendedSelectTriggerElement extends React.ReactElement<
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
> {
  type: typeof SelectTrigger;
}

interface SelectFieldProps extends React.ComponentPropsWithoutRef<typeof Select> {
  error?: boolean;
  size?: SelectSize;
  width?: SelectWidth;
  label?: string;
  helperText?: string;
  required?: boolean;
  withLabel?: boolean;
  triggerClassName?: string;
  children: React.ReactNode;
}

const SelectField: React.FC<SelectFieldProps> = ({
  error,
  size = "base",
  width = "inline",
  label,
  helperText,
  required,
  disabled,
  withLabel = false,
  triggerClassName,
  children,
  ...props
}) => {
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
      <div className="select-container" data-width={width}>
        <Select
          disabled={disabled}
          required={required}
          {...props}
        >
          {React.Children.map(children, child => {
            if (!React.isValidElement(child)) return child;
            
            if (child.type === SelectTrigger) {
              const triggerProps = {
                ...child.props,
                error,
                size,
                className: cn(child.props.className, triggerClassName),
                'aria-describedby': helperText ? helperId : undefined,
                'aria-labelledby': label ? selectId : undefined,
              };
              
              return React.cloneElement(child as ExtendedSelectTriggerElement, triggerProps);
            }
            return child;
          })}
        </Select>
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
};
SelectField.displayName = "SelectField";

export {
  type SelectFieldProps,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectField,
};