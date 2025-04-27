"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

// Define size variants
const tabsListVariants = {
  base: "lg:h-9 text-sm rounded-lg",
  lg: "lg:h-12 px-1 text-sm rounded-lg lg:rounded-full"
}

const tabsTriggerVariants = {
  base: "px-3 py-1 text-sm rounded",
  lg: "px-2 lg:px-4 py-2 text-sm rounded-lg lg:rounded-full"
}

// Create a size context to pass the size prop down to children
type SizeContextType = "base" | "lg"
const SizeContext = React.createContext<SizeContextType>("base")

// Create a type for the size prop
type TabsRootProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
  size?: SizeContextType
}

// Extend the Tabs component to accept the size prop and provide it via context
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsRootProps
>(({ size = "base", children, ...props }, ref) => (
  <SizeContext.Provider value={size}>
    <TabsPrimitive.Root ref={ref} {...props}>
      {children}
    </TabsPrimitive.Root>
  </SizeContext.Provider>
))
Tabs.displayName = TabsPrimitive.Root.displayName

// Use the size from context in TabsList
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const size = React.useContext(SizeContext)
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "inline-flex w-full lg:gap-1 items-center p-1 justify-center bg-muted text-foreground border-t border-neutral-300",
        tabsListVariants[size],
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

// Use the size from context in TabsTrigger
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const size = React.useContext(SizeContext)
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex h-full w-full items-center justify-center !leading-4 -mt-px rounded-md font-medium cursor-pointer ring-offset-background transition-all hover:bg-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-raised data-[state=active]:text-foreground-strong data-[state=active]:shadow",
        tabsTriggerVariants[size],
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }