import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../Label";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  error?: boolean;
  inputSize?: "sm" | "base" | "lg";
  leadingIcon?: React.ReactNode;
  withLabel?: boolean;
  label?: string;
  helperText?: string;
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      inputSize = "base",
      leadingIcon,
      withLabel = false,
      label,
      helperText,
      required,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const inputElement = (
      <div>
        {helperText && (
        <p
          id={`${inputId}-helper`}
          className="form-layout-helper"
          data-error={error}
        >
          {helperText}
        </p>
      )}
      <div className="form-layout-field">
        {leadingIcon && (
          <div
            className="form-layout-icon"
            data-size={inputSize}
            data-error={error}
            data-disabled={disabled}
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
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          ref={ref}
          {...props}
        />
      </div>

        </div>
    );

    if (!withLabel || !label) return inputElement;

    return (
      <div className="form-layout">
        <div className="form-layout-label">
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
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
