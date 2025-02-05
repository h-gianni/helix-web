"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../Label";

// index.tsx
export interface InputProps
 extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
 error?: boolean;
 "data-size"?: "sm" | "base" | "lg";
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
   "data-size": size = "base",
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
   const generatedId = React.useId();
   const inputId = id || generatedId;

   const helperElement = helperText && (
     <p
       id={`${inputId}-helper`}
       className="ui-input-helper"
       data-error={error}
     >
       {helperText}
     </p>
   );

   const inputElement = (
     <div className="ui-input-wrapper">
       {leadingIcon && (
         <div
           className="ui-input-icon"
           data-size={size}
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
         data-size={size}
         aria-describedby={helperText ? `${inputId}-helper` : undefined}
         className={cn(
           "ui-input",
           leadingIcon && "ui-input-with-icon",
           error && "ui-input-error",
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
   );

   if (!withLabel || !label) {
     return (
       <>
         {helperElement}
         {inputElement}
       </>
     );
   }

   return (
     <div className="ui-input-control">
       <div className="ui-input-label-wrapper">
         <Label
           htmlFor={inputId}
           data-error={error}
           data-focused={focused}
           data-disabled={disabled}
           required={required}
         >
           {label}
         </Label>
         {helperElement}
         {inputElement}
       </div>
     </div>
   );
 }
);

Input.displayName = "Input";

export { Input };