"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/core/Label";

// index.tsx
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  "data-size"?: "sm" | "base" | "lg"; // Changed from inputSize
  maxLength?: number;
  showCount?: boolean;
  withLabel?: boolean;
  label?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    error,
    "data-size": size = "base",
    maxLength,
    showCount,
    withLabel = false,
    label,
    helperText,
    required,
    disabled,
    id,
    value,
    onChange,
    ...props
  }, ref) => {
    const [charCount, setCharCount] = React.useState(0);
    const [focused, setFocused] = React.useState(false);
    const generatedId = React.useId();
    const elementId = id || generatedId;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    React.useEffect(() => {
      setCharCount(String(value || "").length);
    }, [value]);

    const textareaElement = (
      <div className="ui-textarea-wrapper">
        <textarea
          id={elementId}
          className={cn("ui-textarea", className)}
          data-size={size}
          data-error={error || undefined}
          ref={ref}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          disabled={disabled}
          required={required}
          aria-invalid={error}
          aria-describedby={helperText ? `${elementId}-helper` : undefined}
          {...props}
        />
      </div>
    );

    const textareaFooter = (helperText || showCount) && (
      <div className="ui-textarea-footer">
        {helperText && (
          <p
            id={`${elementId}-helper`}
            className="ui-form-helper"
            data-error={error || undefined}
          >
            {helperText}
          </p>
        )}
        {showCount && (
          <div 
            className="ui-textarea-counter"
            data-error={error || undefined}
            data-solo={!helperText || undefined}
          >
            {charCount}
            {maxLength && ` / ${maxLength}`}
          </div>
        )}
      </div>
    );

    if (!withLabel || !label) {
      return (
        <div className="ui-textarea-wrapper">
          {textareaElement}
          {textareaFooter}
        </div>
      );
    }

    return (
      <div 
        className="ui-textarea-wrapper"
        data-has-label={true}
      >
        <Label
          htmlFor={elementId}
          data-error={error || undefined}
          data-focused={focused}
          data-disabled={disabled}
          required={required}
        >
          {label}
        </Label>
        {textareaElement}
        {textareaFooter}
      </div>
    );
  }
);

export { Textarea };