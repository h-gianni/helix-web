import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/Label"

interface RadioGroupProps 
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  error?: boolean;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "blocks" | "compact";
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, error, orientation = "vertical", variant = "default", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        "radio-group-base",
        variant === "default" && orientation === "vertical" && "radio-group-vertical",
        variant === "default" && orientation === "horizontal" && "radio-group-horizontal",
        variant === "blocks" && orientation === "vertical" && "radio-group-blocks-vertical",
        variant === "blocks" && orientation === "horizontal" && "radio-group-blocks-horizontal",
        variant === "compact" && [
          "radio-group-compact",
          orientation === "vertical" ? "radio-group-compact-vertical" : "radio-group-compact-horizontal"
        ],
        error && "radio-group-error",
        className
      )}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

interface RadioGroupItemProps 
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "blocks" | "compact";
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, children, label, description, variant = "default", ...props }, ref) => {
  const { disabled, required, "aria-invalid": ariaInvalid } = props
  const error = ariaInvalid === true || ariaInvalid === "true"
  const orientation = props["aria-orientation"]
  
  const radio = (
    <div className="radio-container">
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "radio-base",
          !props['aria-invalid'] ? "radio-default" : "radio-error",
          !props['aria-invalid'] ? "radio-focus" : "radio-focus-error",
          props.disabled && "radio-disabled",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="radio-indicator">
          <Circle className="size-3 fill-current" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    </div>
  )

  if (variant === "blocks" || variant === "compact") {
    return (
      <label
        className={cn(
          "radio-label-wrapper group",
          variant === "blocks" && "radio-label-wrapper-blocks",
          variant === "compact" && orientation === "vertical" && "radio-label-wrapper-compact-vertical",
          variant === "compact" && orientation === "horizontal" && "radio-label-wrapper-compact-horizontal",
          props.disabled && "radio-disabled"
        )}
        data-state={props.checked ? "checked" : "unchecked"}
      >
        <div className={cn(
          "radio-content-wrapper",
          orientation === "horizontal" && "radio-content-wrapper-horizontal"
        )}>
          <div className="flex-none w-4 h-4">{radio}</div>
          <div className="radio-label-content">
            {label && <div className="radio-label-text">{label}</div>}
            {description && <div className="radio-description">{description}</div>}
            {children}
          </div>
        </div>
      </label>
    )
  }

  if (label) {
    return (
      <div className="radio-label-row">
        {radio}
        <Label
          htmlFor={props.id}
          disabled={disabled}
          required={required}
          error={error}
        >
          {label}
        </Label>
      </div>
    )
  }

  return radio
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
export type { RadioGroupProps, RadioGroupItemProps }