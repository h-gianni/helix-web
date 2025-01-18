"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/Label"

type BaseSelectProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>

interface SelectProps extends BaseSelectProps {
  error?: boolean;
  size?: 'sm' | 'base' | 'lg';
  withLabel?: boolean;
  withIcons?: boolean;
  label?: string;
  helperText?: string;
  required?: boolean;
  width?: 'inline' | 'full';
  triggerClassName?: string;
}

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  error?: boolean;
  size?: 'sm' | 'base' | 'lg';
  icon?: React.ReactNode;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, error, size = 'base', icon, ...props }, ref) => (
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
    <span>
      {icon && <span className="select-icon">{icon}</span>}
      {children}
    </span>
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="select-icon size-4" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const Select = ({ 
  error, 
  size = 'base', 
  withLabel = false, 
  label, 
  helperText, 
  required, 
  disabled, 
  children, 
  width = 'inline',
  triggerClassName,
  ...props 
}: SelectProps) => {
  const [focused, setFocused] = React.useState(false);
  const selectId = React.useId();

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  // Clone children to pass down width prop to SelectTrigger
  const updatedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === SelectTrigger) {
      const triggerChild = child as React.ReactElement<SelectTriggerProps>;
      return React.cloneElement(triggerChild, {
        ...triggerChild.props,
        className: cn(
          triggerChild.props.className, 
          width === 'full' ? "w-full" : "w-fit",
          triggerClassName
        ),
        onFocus: handleFocus,
        onBlur: handleBlur
      });
    }
    return child;
  });

  if (!withLabel && !helperText) {
    return (
      <div className={width === 'full' ? 'w-full relative' : 'relative'}>
        <SelectPrimitive.Root 
          required={required}
          disabled={disabled}
          onValueChange={() => {}} 
          {...props}
        >
          {updatedChildren}
        </SelectPrimitive.Root>
      </div>
    );
  }

  return (
    <div className={width === 'full' ? 'w-full relative' : 'relative'}>
      {label && withLabel && (
        <Label 
          htmlFor={selectId}
          data-error={error}
          data-focused={focused}
          data-disabled={disabled}
          required={required}
        >
          {label}
        </Label>
      )}
      <SelectPrimitive.Root 
        required={required}
        disabled={disabled}
        onValueChange={() => {}} 
        {...props}
      >
        {updatedChildren}
      </SelectPrimitive.Root>
      {helperText && (
        <p 
          id={`${selectId}-helper`}
          className={cn(
            "select-helper",
            error && "select-helper-error"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
Select.displayName = SelectPrimitive.Root.displayName

const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

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
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "select-viewport",
          position === "popper" && "select-viewport-popper"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  size?: 'sm' | 'base' | 'lg';
  withIcon?: React.ReactNode;
}

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, withIcon, size = 'base', ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "select-item",
      `select-item-${size}`,
      className
    )}
    {...props}
  >
    <span>
      {withIcon && <span className="select-icon">{withIcon}</span>}
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </span>
    <SelectPrimitive.ItemIndicator>
      <Check className={cn(
        "select-item-indicator",
        `select-item-indicator-${size}`
      )} />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("select-scroll-button", className)}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("select-scroll-button", className)}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

interface SelectLabelProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> {
  size?: 'sm' | 'base' | 'lg';
}

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  SelectLabelProps
>(({ className, size = 'base', ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "select-label",
      `select-label-${size}`,
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("select-separator", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  type SelectProps,
  type SelectTriggerProps,
  type SelectItemProps,
  type SelectLabelProps,
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}