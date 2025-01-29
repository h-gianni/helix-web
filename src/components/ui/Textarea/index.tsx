import * as React from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/Label"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  inputSize?: 'sm' | 'base' | 'lg';
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
    inputSize = 'base', 
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
    const textareaId = id || generatedId;
    
    // Handle text changes and character count
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    // Initialize character count on mount
    React.useEffect(() => {
      setCharCount(String(value || '').length);
    }, [value]);

    // The base textarea element
    const textareaElement = (
      <div className="textarea-wrapper">
        <textarea
          id={textareaId}
          className={cn(
            "textarea",
            `textarea-${inputSize}`,
            error && "textarea-error",
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

    // Footer element with helper text and character count
    const textareaFooter = (helperText || showCount) && (
      <div className="textarea-footer">
        {helperText && (
          <p 
            id={`${textareaId}-helper`}
            className={cn(
              "textarea-helper",
              error && "textarea-helper-error"
            )}
          >
            {helperText}
          </p>
        )}
        {showCount && (
          <div 
            className={cn(
              "textarea-counter",
              error && "textarea-counter-error",
              !helperText && "textarea-counter-solo"
            )}
          >
            {charCount}
            {maxLength && ` / ${maxLength}`}
          </div>
        )}
      </div>
    );

    // If withLabel is false or no label is provided, return just the textarea
    if (!withLabel || !label) {
      return (
        <div className="form-control">
          {textareaElement}
          {textareaFooter}
        </div>
      );
    }

    // Return the labeled version
    return (
      <div className="label-input-wrapper">
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
)

Textarea.displayName = "Textarea"

export { Textarea }