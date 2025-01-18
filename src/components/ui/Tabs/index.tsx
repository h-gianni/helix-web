"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

type TabsAppearance = "base" | "compact"
type TabsWidth = "inline" | "full"
type TabsSize = "base" | "lg"

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  appearance?: TabsAppearance
  width?: TabsWidth
  size?: TabsSize
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, appearance = "base", width = "inline", size = "base", ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn(className)}
    {...props}
  />
))
Tabs.displayName = TabsPrimitive.Root.displayName

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  appearance?: TabsAppearance
  width?: TabsWidth
  size?: TabsSize
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, appearance = "base", width = "inline", size = "base", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "tabs-list-base",
      `tabs-list-appearance-${appearance}`,
      `tabs-list-width-${width}`,
      `tabs-list-size-${size}`,
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  appearance?: TabsAppearance
  size?: TabsSize
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, appearance = "base", size = "base", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "tabs-trigger-base",
      `tabs-trigger-appearance-${appearance}`,
      `tabs-trigger-size-${size}`,
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("tabs-content", className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsProps, TabsListProps, TabsTriggerProps }