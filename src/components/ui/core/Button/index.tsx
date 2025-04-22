import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 pb-0.5 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-linear-to-br from-neutral-100 to-neutral-200/75 text-neutral-950 hover:opacity-90",
        neutral: "bg-linear-to-br from-neutral-900 to-neutral-950 text-white hover:opacity-90",
        primary: "bg-linear-to-br from-secondary-500 to-primary-500 text-white hover:opacity-90",
        destructive:
          "bg-linear-to-br from-destructive-500 to-destructive-600 text-white hover:opacity-90",
        outline:
          "border border-border-strong bg-transparent hover:bg-neutral-50 text-neutral-900 hover:bg-neutral-50",
        accent: "bg-linear-to-br from-accent-400 to-accent-600/80 text-accent-foreground hover:opacity-90",
        ghost: "text-foreground-strong hover:bg-neutral-50 hover:opacity-90",
        link: "text-primary underline-offset-4 hover:underline",
          
        // To be removed
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 rounded-md px-6 text-base",
        icon: "size-9 rounded-full",
        
        // To be removed
        xl: "h-12 rounded-md px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
