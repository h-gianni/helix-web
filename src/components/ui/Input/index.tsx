import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "../Label"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  error?: boolean;
  inputSize?: 'sm' | 'base' | 'lg';
  leadingIcon?: React.ReactNode;
  withLabel?: boolean;
  label?: string;
  helperText?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    error, 
    inputSize = 'base', 
    leadingIcon,
    withLabel = false,
    label,
    helperText,
    required,
    disabled,
    id,
    ...props 
  }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const inputId = id || React.useId();

    // The base input element
    const inputElement = (
      <div className="input-wrapper">
        {leadingIcon && (
          <div 
            className={cn(
              "input-icon",
              `input-icon-${inputSize}`,
              error && "input-icon-error",
              disabled && "input-icon-disabled"
            )}
          >
            {leadingIcon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          aria-invalid={error}
          aria-describedby={helperText ? `${inputId}-helper` : undefined}
          className={cn(
            "input",
            `input-${inputSize}`,
            leadingIcon && `input-with-icon-${inputSize}`,
            error && "input-error",
            className
          )}
          onFocus={(e) => {
            setFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            props.onBlur?.(e)
          }}
          ref={ref}
          {...props}
        />
      </div>
    );

    // Helper text element if provided
    const helperTextElement = helperText && (
      <p 
        id={`${inputId}-helper`}
        className={cn(
          "input-helper",
          error && "input-helper-error"
        )}
      >
        {helperText}
      </p>
    );

    // If withLabel is false or no label is provided, return just the input
    if (!withLabel || !label) {
      return (
        <div className="form-control">
          {inputElement}
          {helperTextElement}
        </div>
      );
    }

    // Return the labeled version
    return (
      <div className="label-input-wrapper">
        <Label 
          htmlFor={inputId}
          data-error={error}
          data-focused={focused}
          data-disabled={disabled}
          required={required}
        >
          {label}
        </Label>
        {inputElement}
        {helperTextElement}
      </div>
    );
  }
)
Input.displayName = "Input"

export { Input }