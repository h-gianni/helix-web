"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle, CircleCheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const RadioGroupCards = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("w-full", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroupCards.displayName = "RadioGroupCards"

interface RadioGroupCardsContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean
  layout?: "compact" | "loose"
  direction?: "vertical" | "horizontal"
}

const RadioGroupCardsContainer = React.forwardRef<
  HTMLDivElement,
  RadioGroupCardsContainerProps
>(({ className, scrollable, layout = "loose", direction = "vertical", ...props }, ref) => {
  // Default: on mobile use scrollable, on desktop use flex-wrap
  const [isMobile, setIsMobile] = React.useState(false)
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  // If scrollable is explicitly set, use that value, otherwise use mobile detection
  const shouldScroll = scrollable !== undefined ? scrollable : isMobile
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex",
        layout === "loose" ? "gap-2" : "",
        direction === "vertical" ? "flex-col" : "flex-row",
        layout === "compact" && "overflow-hidden border border-border",
        layout === "compact" && direction === "vertical" && "divide-y divide-border",
        layout === "compact" && direction === "horizontal" && "divide-x divide-border",
        shouldScroll ? 
          "overflow-x-auto snap-x scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent -mx-2" : 
          "flex-wrap",
        className
      )}
      {...props}
    />
  )
})
RadioGroupCardsContainer.displayName = "RadioGroupCardsContainer"

interface RadioGroupCardProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  containerClassName?: string
  children?: React.ReactNode
  disabled?: boolean
  layout?: "compact" | "loose"
  radioSymbol?: boolean
  direction?: "vertical" | "horizontal"
  isFirst?: boolean
  isLast?: boolean
}

const RadioGroupCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupCardProps
>(({ 
  className, 
  containerClassName, 
  children, 
  disabled = false,
  layout = "loose",
  radioSymbol = true,
  direction = "vertical",
  isFirst = false,
  isLast = false,
  ...props 
}, ref) => {
  const [isChecked, setIsChecked] = React.useState(false);
  
  // Check if this card is the selected one whenever the RadioGroup value changes
  React.useEffect(() => {
    const checkRadioState = () => {
      if (props.id) {
        const radioInput = document.getElementById(props.id) as HTMLInputElement;
        if (radioInput) {
          setIsChecked(radioInput.getAttribute('data-state') === 'checked');
        }
      }
    };
    
    checkRadioState();
    
    // Create a MutationObserver to watch for changes to the data-state attribute
    if (props.id) {
      const radioInput = document.getElementById(props.id);
      if (radioInput) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === 'attributes' && 
              mutation.attributeName === 'data-state'
            ) {
              checkRadioState();
            }
          });
        });
        
        observer.observe(radioInput, { 
          attributes: true,
          attributeFilter: ['data-state'] 
        });
        
        return () => observer.disconnect();
      }
    }
  }, [props.id]);
  
  return (
    <div className={cn(
      "snap-start", 
      "md:min-w-24",
      layout === "compact" ? "mb-[-1px]" : "",
      containerClassName
    )}>
      <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
          "peer sr-only",
          className
        )}
        disabled={disabled}
        {...props}
      />
      <label
        htmlFor={props.id}
        className={cn(
          "flex py-3 px-4 min-h-14 transition-all text-foreground font-medium text-base leading-none truncate",
          "h-full w-full",
          
          // Loose layout styling: Rounded borders for all items
          layout === "loose" && "border border-border rounded-lg mx-auto",
        
          // Compact layout styling: No borders by default
          layout === "compact" && "border-none",
        
          // Special handling for selected items in compact layout
          layout === "compact" && "peer-data-[state=checked]:relative peer-data-[state=checked]:z-10",
          layout === "compact" && "peer-data-[state=checked]:border peer-data-[state=checked]:border-primary",
        
          // Apply rounded corners based on position and direction
          layout === "compact" && direction === "vertical" && isFirst && "peer-data-[state=checked]:rounded-t-md",
          layout === "compact" && direction === "vertical" && isLast && "peer-data-[state=checked]:rounded-b-md",
          layout === "compact" && direction === "horizontal" && isFirst && "peer-data-[state=checked]:rounded-l-md",
          layout === "compact" && direction === "horizontal" && isLast && "peer-data-[state=checked]:rounded-r-md",
        
          // Hover and disabled states
          !disabled && "cursor-pointer hover:bg-muted",
          disabled && "cursor-not-allowed opacity-50",
        
          // Selected state styling
          "peer-data-[state=checked]:bg-primary-50 peer-data-[state=checked]:text-primary-600",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
        )}
        
      >
        <div className={cn(
          "flex w-full",
          radioSymbol ? "items-center gap-3" : "items-center justify-center"
        )}>
          {radioSymbol && isChecked && (
            <CircleCheckIcon className="size-4 text-primary shrink-0" />
          )}
          {radioSymbol && !isChecked && (
            <Circle className="size-4 text-neutral-300 shrink-0" />
          )}
          {children}
        </div>
      </label>
    </div>
  )
})
RadioGroupCard.displayName = "RadioGroupCard"

export { RadioGroupCards, RadioGroupCardsContainer, RadioGroupCard }