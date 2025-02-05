"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/Label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  inputSize?: "sm" | "base" | "lg";
  maxLength?: number;
  showCount?: boolean;
  withLabel?: boolean;
  label?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      inputSize = "base",
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
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(0);
    const [focused, setFocused] = React.useState(false);
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    // Update character count on change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    // Initialize character count on mount/update
    React.useEffect(() => {
      setCharCount(String(value || "").length);
    }, [value]);

    // Base textarea element
    const textareaElement = (
      <div className="ui-textarea-wrapper">
        <textarea
          id={textareaId}
          className={cn(
            "ui-textarea",
            `ui-textarea-${inputSize}`,
            error && "ui-textarea-error",
            className
          )}
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
          aria-describedby={helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
      </div>
    );

    // Footer element: helper text and character count
    const textareaFooter =
      (helperText || showCount) && (
        <div className="ui-textarea-footer">
          {helperText && (
            <p
              id={`${textareaId}-helper`}
              className={cn(
                "ui-textarea-helper",
                error && "ui-textarea-helper-error"
              )}
            >
              {helperText}
            </p>
          )}
          {showCount && (
            <div
              className={cn(
                "ui-textarea-counter",
                error && "ui-textarea-counter-error",
                !helperText && "ui-textarea-counter-solo"
              )}
            >
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </div>
          )}
        </div>
      );

    // If no label is required, return the textarea and footer within a control container
    if (!withLabel || !label) {
      return (
        <div className="ui-textarea-control">
          {textareaElement}
          {textareaFooter}
        </div>
      );
    }

    // If a label is provided, wrap with a label wrapper and include the label
    return (
      <div className="ui-textarea-label-wrapper">
        <Label
          htmlFor={textareaId}
          data-error={error}
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
Textarea.displayName = "Textarea";

export { Textarea };
